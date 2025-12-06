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
