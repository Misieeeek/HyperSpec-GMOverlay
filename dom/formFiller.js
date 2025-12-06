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
