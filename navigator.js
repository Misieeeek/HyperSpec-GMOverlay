class CSVNavigator {
    constructor() {
        this.csvData = [];
        this.currentIndex = 0;
        this.csvHeaders = [];
        this.storageKey = 'csvNavigatorData';
    }

    async loadCSVFromExtension() {
        try {
            const savedData = this.loadFromLocalStorage();

            if (savedData) {
                console.log("Załadowano dane z Local Storage");
                this.csvData = savedData.data;
                this.csvHeaders = savedData.headers;
                this.currentIndex = savedData.currentIndex || 0;
                console.log(`Załadowano ${this.csvData.length} wierszy z Local Storage`);
                return this.csvData.length;
            }

            const csvUrl = chrome.runtime.getURL("znizki.csv");
            const response = await fetch(csvUrl);

            if (!response.ok) {
                throw new Error("Nie można załadować pliku CSV, sprawdź czy znajduje się w tym samym folderze co reszta plików.");
            }

            const text = await response.text();
            this.parseCSV(text);
            console.log(`Załadowano ${this.csvData.length} wierszy z CSV`);

            this.saveToLocalStorage();

            return this.csvData.length;
        } catch (error) {
            console.error("Błąd ładowania CSV:", error);
            throw error;
        }
    }

    saveToLocalStorage() {
        try {
            const dataToSave = {
                data: this.csvData,
                headers: this.csvHeaders,
                currentIndex: this.currentIndex,
                lastSaved: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            console.log('Dane zapisane do Local Storage');
        } catch (error) {
            console.error('Błąd zapisu do Local Storage:', error);
            alert('Nie można zapisać danych. Pamięć może być pełna.');
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Błąd odczytu z Local Storage:', error);
        }
        return null;
    }

    clearLocalStorage() {
        localStorage.removeItem(this.storageKey);
        console.log('Local Storage wyczyszczony');
    }

    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) return;

        this.csvHeaders = lines[0].split(',').map(h => h.trim());

        this.csvData = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};

            this.csvHeaders.forEach((header, index) => {
                row[header] = values[index] || '';
            });

            this.csvData.push(row);
        }

        this.currentIndex = 0;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    getCurrentRow() {
        if (this.csvData.length === 0) return null;
        return this.csvData[this.currentIndex];
    }

    nextRow() {
        if (this.currentIndex < this.csvData.length - 1) {
            this.currentIndex++;
            this.saveToLocalStorage();
            return this.getCurrentRow();
        }
        return null;
    }

    previousRow() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.saveToLocalStorage();
            return this.getCurrentRow();
        }
        return null;
    }

    getCurrentCoordinates() {
        const row = this.getCurrentRow();
        if (!row) return null;

        const headers = this.csvHeaders;
        const latHeader = headers[headers.length - 4];
        const lonHeader = headers[headers.length - 3];

        const latValue = row['lat'] || row[latHeader];
        const lonValue = row['lon'] || row[lonHeader];

        const lat = parseFloat(latValue);
        const lon = parseFloat(lonValue);

        if (isNaN(lat) || isNaN(lon)) {
            console.error("Nieprawidłowe współrzędne:", { latValue, lonValue, lat, lon, row });
            return null;
        }

        return { lat, lon };
    }

    updateGoogleMaps(lat, lon) {
        const currentUrl = window.location.href;

        let urlMatch = currentUrl.match(/place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (!urlMatch) {
            urlMatch = currentUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        }

        if (urlMatch) {
            const currentLat = parseFloat(urlMatch[1]);
            const currentLon = parseFloat(urlMatch[2]);

            if (Math.abs(currentLat - lat) < 0.0001 && Math.abs(currentLon - lon) < 0.0001) {
                console.log("Lokalizacja zbliżona do poprzedniej, pomijanie przeładnowania");
                return;
            }
        }

        const newUrl = `https://www.google.com/maps/place/${lat},${lon}/@${lat},${lon},19z`;

        console.log(`Przeładowuję stronę na: ${newUrl}`);

        window.location.href = newUrl;
    }

    goToNextLocation() {
        this.saveCurrentRowData();

        const nextRow = this.nextRow();

        if (!nextRow) {
            alert("To jest ostatni wiersz w pliku CSV!");
            return false;
        }

        const coords = this.getCurrentCoordinates();

        if (!coords) {
            alert("Nie można odczytać współrzędnych z tego wiersza!");
            return false;
        }

        console.log(`Przechodząc do wiersza ${this.currentIndex + 1}/${this.csvData.length}`);
        console.log(`Współrzędne: ${coords.lat}, ${coords.lon}`);

        this.updateGoogleMaps(coords.lat, coords.lon);
        return true;
    }

    findAndFillRowByCoordinates(targetLat, targetLon) {
        console.log(`Szukam wiersza dla współrzędnych: ${targetLat}, ${targetLon}`);

        for (let i = 0; i < this.csvData.length; i++) {
            const row = this.csvData[i];
            const lat = parseFloat(row['lat']);
            const lon = parseFloat(row['lon']);

            if (Math.abs(lat - targetLat) < 0.0001 && Math.abs(lon - targetLon) < 0.0001) {
                console.log(`Znaleziono wiersz ${i + 1}: ${row['name']}`);
                this.currentIndex = i;
                this.saveToLocalStorage();

                setTimeout(() => {
                    this.fillFormWithCurrentRow();
                }, 500);

                return true;
            }
        }

        console.log("Nie znaleziono wiersza dla tych współrzędnych");
        return false;
    }

    goToFirstUncheckedLocation() {
        let foundIndex = -1;

        for (let i = 0; i < this.csvData.length; i++) {
            const row = this.csvData[i];
            if (row['verified'] !== 'true' || row['skip'] !== 'false') {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex === -1) {
            console.log("Wszystkie lokalizacje zostały już zbadane!");
            alert("Gratulacje! Wszystkie lokalizacje zostały już sprawdzone.");
            this.currentIndex = 0;
            this.saveToLocalStorage();
            this.fillFormWithCurrentRow();
            return false;
        }

        this.currentIndex = foundIndex;
        this.saveToLocalStorage();
        console.log(`Znaleziono niezbadaną lokalizację: wiersz ${this.currentIndex + 1}`);

        const coords = this.getCurrentCoordinates();

        if (!coords) {
            console.error("Nie można odczytać współrzędnych!");
            return false;
        }

        this.fillFormWithCurrentRow();

        this.updateGoogleMaps(coords.lat, coords.lon);
        return true;
    }

    saveCurrentRowData() {
        const currentRow = this.getCurrentRow();
        if (!currentRow) return;

        currentRow['name'] = document.getElementById('input-name')?.value || '';
        currentRow['address'] = document.getElementById('input-address')?.value || '';
        currentRow['phone'] = document.getElementById('input-phone')?.value || '';
        currentRow['website'] = document.getElementById('input-website')?.value || '';
        currentRow['type'] = document.getElementById('input-category')?.value || '';
        currentRow['lat'] = document.getElementById('input-lat')?.value || '';
        currentRow['lon'] = document.getElementById('input-lon')?.value || '';
        currentRow['student_discounts'] = document.getElementById('input-student-discounts')?.value || '';
        currentRow['verified'] = document.getElementById('input-verified')?.checked ? 'true' : 'false';
        currentRow['skip'] = document.getElementById('input-skip')?.checked ? 'true' : 'false';

        console.log('Zapisano dane wiersza:', this.currentIndex, currentRow);

        this.saveToLocalStorage();
    }

    fillFormWithCurrentRow() {
        const row = this.getCurrentRow();
        if (!row) return;

        const fieldMapping = {
            'name': 'input-name',
            'address': 'input-address',
            'phone': 'input-phone',
            'website': 'input-website',
            'type': 'input-category',
            'lat': 'input-lat',
            'lon': 'input-lon',
            'student_discounts': 'input-student-discounts'
        };

        Object.keys(fieldMapping).forEach(csvColumn => {
            const inputId = fieldMapping[csvColumn];
            const input = document.getElementById(inputId);

            if (input && row[csvColumn]) {
                input.value = row[csvColumn];
            }
        });

        if (row['opening_hours']) {
            this.fillOpeningHours(row['opening_hours']);
        } else {
            this.clearOpeningHours();
        }

        this.updateCounter();
    }

    fillOpeningHours(openingHoursStr) {
        if (!openingHoursStr) {
            this.clearOpeningHours();
            return;
        }

        const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
        const dayAbbrev = {
            'Mo': 0, 'Tu': 1, 'We': 2, 'Th': 3, 'Fr': 4, 'Sa': 5, 'Su': 6
        };

        this.clearOpeningHours();

        const parts = openingHoursStr.split(';').map(p => p.trim());

        parts.forEach(part => {
            const match = part.match(/([A-Za-z\-,]+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);

            if (match) {
                const dayRange = match[1];
                const openTime = match[2];
                const closeTime = match[3];

                const affectedDays = this.parseDayRange(dayRange, dayAbbrev);

                affectedDays.forEach(dayIndex => {
                    const dayName = days[dayIndex];
                    const fromInput = document.getElementById(`hours-${dayName}-from`);
                    const toInput = document.getElementById(`hours-${dayName}-to`);

                    if (fromInput) fromInput.value = openTime;
                    if (toInput) toInput.value = closeTime;
                });
            }
        });
    }

    parseDayRange(dayStr, dayAbbrev) {
        const days = [];

        if (dayStr.includes('-')) {
            const [start, end] = dayStr.split('-');
            const startIdx = dayAbbrev[start.trim()];
            const endIdx = dayAbbrev[end.trim()];

            if (startIdx !== undefined && endIdx !== undefined) {
                for (let i = startIdx; i <= endIdx; i++) {
                    days.push(i);
                }
            }
        } else if (dayStr.includes(',')) {
            dayStr.split(',').forEach(day => {
                const idx = dayAbbrev[day.trim()];
                if (idx !== undefined) days.push(idx);
            });
        } else {
            const idx = dayAbbrev[dayStr.trim()];
            if (idx !== undefined) days.push(idx);
        }

        return days;
    }

    clearOpeningHours() {
        const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

        days.forEach(day => {
            const fromInput = document.getElementById(`hours-${day}-from`);
            const toInput = document.getElementById(`hours-${day}-to`);

            if (fromInput) fromInput.value = '';
            if (toInput) toInput.value = '';
        });
    }

    updateCounter() {
        const counter = document.getElementById('row-counter');
        if (counter) {
            counter.innerText = `Wiersz: ${this.currentIndex + 1} / ${this.csvData.length}`;
        }
    }

    getStatus() {
        return {
            totalRows: this.csvData.length,
            currentIndex: this.currentIndex,
            hasNext: this.currentIndex < this.csvData.length - 1,
            hasPrevious: this.currentIndex > 0
        };
    }

    exportToCSV() {
        if (this.csvData.length === 0) {
            alert("Brak danych do eksportu!");
            return;
        }

        this.saveCurrentRowData();

        const headers = this.csvHeaders.join(',');

        const rows = this.csvData.map(row => {
            return this.csvHeaders.map(header => {
                let value = row[header] || '';
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            }).join(',');
        });

        const csvContent = [headers, ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'znizki_updated.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('CSV wyeksportowany!');
    }

    resetToOriginal() {
        if (confirm('Czy na pewno chcesz zresetować wszystkie dane do oryginalnego CSV? Wszystkie zmiany zostaną utracone!')) {
            this.clearLocalStorage();
            location.reload();
        }
    }
}

const csvNavigator = new CSVNavigator();

window.addEventListener("load", async () => {
    try {
        await csvNavigator.loadCSVFromExtension();
        console.log("CSV załadowany pomyślnie");

        document.addEventListener('change', (e) => {
            if (e.target.matches('input, textarea, select')) {
                csvNavigator.saveCurrentRowData();
            }
        });

        setTimeout(() => {
            const currentUrl = window.location.href;

            let urlMatch = currentUrl.match(/place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
            if (!urlMatch) {
                urlMatch = currentUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
            }

            if (urlMatch) {
                const currentLat = parseFloat(urlMatch[1]);
                const currentLon = parseFloat(urlMatch[2]);

                csvNavigator.findAndFillRowByCoordinates(currentLat, currentLon);
            } else {
                csvNavigator.goToFirstUncheckedLocation();
            }
        }, 2500);
    } catch (error) {
        console.error("Nie można załadować pliku CSV:", error);
        alert("Błąd: Nie można załadować pliku znizki.csv");
    }
});
