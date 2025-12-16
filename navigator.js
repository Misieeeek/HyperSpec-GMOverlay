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
        let tempIndex = this.currentIndex;

        while (tempIndex < this.csvData.length - 1) {
            tempIndex++;
            const row = this.csvData[tempIndex];

            if (row['skip'] !== 'true') {
                this.currentIndex = tempIndex;
                this.saveToLocalStorage();
                return this.getCurrentRow();
            }
        }
        return null;
    }

    previousRow() {
        let tempIndex = this.currentIndex;

        while (tempIndex > 0) {
            tempIndex--;
            const row = this.csvData[tempIndex];
            if (row['skip'] !== 'true') {
                this.currentIndex = tempIndex;
                this.saveToLocalStorage();
                return this.getCurrentRow();
            }
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
        const isVerified = document.getElementById('input-verified')?.checked || false;
        const isSkip = document.getElementById('input-skip')?.checked || false;

        if (isVerified && typeof formValidator !== 'undefined') {
            const formData = {
                name: document.getElementById('input-name')?.value || '',
                address: document.getElementById('input-address')?.value || '',
                phone: document.getElementById('input-phone')?.value || '',
            };

            const validationResult = formValidator.validate(formData, isVerified);

            if (!validationResult.valid) {
                formValidator.showErrors();
                return false;
            }

            if (validationResult.data.phone) {
                document.getElementById('input-phone').value = validationResult.data.phone;
            }
        }

        this.saveCurrentRowData();

        if (typeof window.visualEffects !== 'undefined') {
            if (isVerified) {
                window.visualEffects.triggerConfetti();
            } else if (isSkip) {
                window.visualEffects.triggerTomatoes();
            }
        }

        const delay = (isVerified || isSkip) ? 1500 : 0;

        setTimeout(() => {
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
        }, delay);

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
            if (row['verified'] !== 'true' && row['skip'] !== 'true') {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex === -1) {
            console.log("Wszystkie lokalizacje zostały już zbadane (lub pominięte)!");
            alert("Gratulacje! Wszystkie dostępne lokalizacje zostały sprawdzone.");
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

        const discounts = this.collectDiscountsFromForm();
        currentRow['discounts'] = JSON.stringify(discounts);

        currentRow['verified'] = document.getElementById('input-verified')?.checked ? 'true' : 'false';
        currentRow['skip'] = document.getElementById('input-skip')?.checked ? 'true' : 'false';

        const openingHours = this.collectOpeningHoursFromForm();
        if (openingHours) {
            currentRow['opening_hours'] = openingHours;
        }

        console.log('Zapisano dane wiersza:', this.currentIndex, currentRow);

        this.saveToLocalStorage();
    }

    collectDiscountsFromForm() {
        const wrapper = document.getElementById("discounts-wrapper");
        if (!wrapper) return [];

        const rows = wrapper.querySelectorAll(".discount-row");
        const discounts = [];

        rows.forEach(row => {
            const mode = row.querySelector(".discount-mode")?.value;
            const type = row.querySelector(".discount-type")?.value;
            const studentCheckbox = row.querySelector(".discount-student");
            const conditionsInput = row.querySelector(".discount-conditions");

            const student = studentCheckbox ? studentCheckbox.checked : false;
            const conditions = conditionsInput ? conditionsInput.value.trim() : '';

            let discount = {
                mode: mode,
                student: student
            };

            switch (mode) {
                case "single":
                    const valueInput = row.querySelector(".discount-value");
                    if (valueInput) {
                        const value = parseFloat(valueInput.value);
                        if (!isNaN(value) && value > 0 && conditions) {
                            discount.value = value;
                            discount.type = type;
                            discount.conditions = conditions;
                            discounts.push(discount);
                        }
                    }
                    break;

                case "range":
                    const valueFromInput = row.querySelector(".discount-value-from");
                    const valueToInput = row.querySelector(".discount-value-to");
                    if (valueFromInput && valueToInput) {
                        const valueFrom = parseFloat(valueFromInput.value);
                        const valueTo = parseFloat(valueToInput.value);
                        if (!isNaN(valueFrom) && !isNaN(valueTo) && valueFrom > 0 && valueTo > 0 && conditions) {
                            discount.valueFrom = valueFrom;
                            discount.valueTo = valueTo;
                            discount.type = type;
                            discount.conditions = conditions;
                            discounts.push(discount);
                        }
                    }
                    break;

                case "dynamic":
                    if (conditions) {
                        discount.conditions = conditions;
                        discounts.push(discount);
                    }
                    break;

                case "unspecified":
                    if (conditions) {
                        discount.conditions = conditions;
                        discounts.push(discount);
                    }
                    break;
            }
        });

        return discounts;
    }

    collectOpeningHoursFromForm() {
        const days = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
        const dayAbbrev = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        const hoursMap = {};

        days.forEach((day, index) => {
            const closedCheckbox = document.getElementById(`hours-${day}-closed`);
            const fromInput = document.getElementById(`hours-${day}-from`);
            const toInput = document.getElementById(`hours-${day}-to`);

            if (closedCheckbox && closedCheckbox.checked) {
                return;
            }

            if (fromInput && toInput && fromInput.value && toInput.value) {
                const timeRange = `${fromInput.value}-${toInput.value}`;
                if (!hoursMap[timeRange]) {
                    hoursMap[timeRange] = [];
                }
                hoursMap[timeRange].push(index);
            }
        });

        const parts = [];
        Object.keys(hoursMap).forEach(timeRange => {
            const dayIndices = hoursMap[timeRange];
            const dayStr = this.formatDayRange(dayIndices, dayAbbrev);
            parts.push(`${dayStr} ${timeRange}`);
        });

        return parts.join('; ');
    }

    formatDayRange(indices, dayAbbrev) {
        if (indices.length === 0) return '';
        if (indices.length === 1) return dayAbbrev[indices[0]];

        indices.sort((a, b) => a - b);

        const ranges = [];
        let start = indices[0];
        let end = indices[0];

        for (let i = 1; i < indices.length; i++) {
            if (indices[i] === end + 1) {
                end = indices[i];
            } else {
                ranges.push(start === end ? dayAbbrev[start] : `${dayAbbrev[start]}-${dayAbbrev[end]}`);
                start = indices[i];
                end = indices[i];
            }
        }
        ranges.push(start === end ? dayAbbrev[start] : `${dayAbbrev[start]}-${dayAbbrev[end]}`);

        return ranges.join(',');
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
            'lon': 'input-lon'
        };

        Object.keys(fieldMapping).forEach(csvColumn => {
            const inputId = fieldMapping[csvColumn];
            const input = document.getElementById(inputId);

            if (input && row[csvColumn]) {
                input.value = row[csvColumn];
            }
        });

        this.fillDiscountsForm(row['discounts']);

        if (row['opening_hours']) {
            this.fillOpeningHours(row['opening_hours']);
        } else {
            this.clearOpeningHours();
        }

        this.updateCounter();
    }

    fillDiscountsForm(discountsStr) {
        const wrapper = document.getElementById("discounts-wrapper");
        if (!wrapper) return;

        wrapper.innerHTML = '';

        let discounts = [];

        if (discountsStr && discountsStr.trim()) {
            try {
                discounts = JSON.parse(discountsStr);
                if (!Array.isArray(discounts)) {
                    discounts = [];
                }
            } catch (e) {
                console.log('Nie można sparsować zniżek jako JSON, używam pustej listy');
                discounts = [];
            }
        }

        if (discounts.length === 0) {
            if (typeof addDiscountRow === 'function') {
                addDiscountRow(wrapper);
            }
            return;
        }

        discounts.forEach(discount => {
            if (typeof addDiscountRow === 'function') {
                addDiscountRow(wrapper);

                const lastRow = wrapper.lastElementChild;
                if (lastRow) {
                    const modeSelect = lastRow.querySelector('.discount-mode');
                    const valueInput = lastRow.querySelector('.discount-value');
                    const valueFromInput = lastRow.querySelector('.discount-value-from');
                    const valueToInput = lastRow.querySelector('.discount-value-to');
                    const typeSelect = lastRow.querySelector('.discount-type');
                    const studentCheckbox = lastRow.querySelector('.discount-student');
                    const conditionsInput = lastRow.querySelector('.discount-conditions');

                    if (modeSelect && discount.mode) {
                        modeSelect.value = discount.mode;
                        modeSelect.dispatchEvent(new Event('change'));
                    }

                    if (discount.mode === 'single') {
                        if (valueInput) valueInput.value = discount.value || '';
                        if (typeSelect) typeSelect.value = discount.type || 'percent';
                        if (conditionsInput) conditionsInput.value = discount.conditions || '';
                    } else if (discount.mode === 'range') {
                        if (valueFromInput) valueFromInput.value = discount.valueFrom || '';
                        if (valueToInput) valueToInput.value = discount.valueTo || '';
                        if (typeSelect) typeSelect.value = discount.type || 'percent';
                        if (conditionsInput) conditionsInput.value = discount.conditions || '';
                    } else if (discount.mode === 'dynamic' || discount.mode === 'dynamic') {
                        if (conditionsInput) conditionsInput.value = discount.conditions || '';
                    }

                    if (studentCheckbox) studentCheckbox.checked = discount.student || false;
                }
            }
        });
    }

    fillOpeningHours(openingHoursStr) {
        if (!openingHoursStr) {
            this.clearOpeningHours();
            return;
        }

        const days = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
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
                    const closedCheckbox = document.getElementById(`hours-${dayName}-closed`);
                    const fromInput = document.getElementById(`hours-${dayName}-from`);
                    const toInput = document.getElementById(`hours-${dayName}-to`);

                    if (closedCheckbox) {
                        closedCheckbox.checked = false;
                        closedCheckbox.dispatchEvent(new Event('change'));
                    }

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
        const days = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

        days.forEach(day => {
            const closedCheckbox = document.getElementById(`hours-${day}-closed`);
            const fromInput = document.getElementById(`hours-${day}-from`);
            const toInput = document.getElementById(`hours-${day}-to`);

            if (closedCheckbox) {
                closedCheckbox.checked = false;
                closedCheckbox.dispatchEvent(new Event('change'));
            }

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
            window.location.href = 'https://www.google.com/maps';
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
