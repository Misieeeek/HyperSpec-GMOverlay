class FormValidator {
    constructor() {
        this.errors = [];
    }

    validateName(name) {
        if (!name || name.trim() === '') {
            this.errors.push("⚠️ Nazwa nie może być pusta!");
            return false;
        }
        return true;
    }

    validateAndFormatPhone(phone) {
        if (!phone || phone.trim() === '') {
            return { valid: true, formatted: '' };
        }

        let cleaned = phone.replace(/[\s-]/g, '');

        if (cleaned.startsWith('+48')) {
            cleaned = cleaned.substring(3);
        } else if (cleaned.startsWith('48') && cleaned.length === 11) {
            cleaned = cleaned.substring(2);
        }

        if (!/^\d{9}$/.test(cleaned)) {
            this.errors.push(
                "⚠️ Numer telefonu musi zawierać 9 cyfr!\n" +
                "Akceptowane formaty: +48 xxx xxx xxx, xxx xxx xxx, xxxxxxxxx"
            );
            return { valid: false, formatted: phone };
        }

        const formatted = cleaned.substring(0, 3) + ' ' +
            cleaned.substring(3, 6) + ' ' +
            cleaned.substring(6, 9);

        return { valid: true, formatted: formatted };
    }

    validateFirstDiscount() {
        const wrapper = document.getElementById("discounts-wrapper");
        if (!wrapper) return;

        const firstRow = wrapper.querySelector(".discount-row");

        if (!firstRow) {
            this.errors.push("⚠️ Zaznaczono 'Potwierdzenie', więc musisz dodać przynajmniej jedną zniżkę!");
            return;
        }

        const valueInput = firstRow.querySelector(".discount-value");
        const conditionsInput = firstRow.querySelector(".discount-conditions");

        const value = valueInput ? valueInput.value : '';
        const conditions = conditionsInput ? conditionsInput.value : '';

        if (!value || value.trim() === '' || parseFloat(value) <= 0) {
            this.errors.push("⚠️ Pierwsza zniżka: Uzupełnij wartość zniżki (musi być większa od 0)!");
            if (valueInput) valueInput.style.borderColor = "red";
        } else {
            if (valueInput) valueInput.style.borderColor = "#ddd";
        }

        if (!conditions || conditions.trim() === '') {
            this.errors.push("⚠️ Pierwsza zniżka: Opisz warunki otrzymania zniżki (np. 'Legitymacja')!");
            if (conditionsInput) conditionsInput.style.borderColor = "red";
        } else {
            if (conditionsInput) conditionsInput.style.borderColor = "#ddd";
        }
    }

    validate(formData, isVerified) {
        this.errors = [];

        if (!isVerified) {
            return { valid: true, data: formData };
        }

        this.validateName(formData.name);

        const phoneResult = this.validateAndFormatPhone(formData.phone);
        if (phoneResult.valid && phoneResult.formatted) {
            formData.phone = phoneResult.formatted;
        }

        this.validateFirstDiscount();

        return {
            valid: this.errors.length === 0,
            data: formData,
            errors: this.errors
        };
    }

    showErrors() {
        if (this.errors.length > 0) {
            alert("Błędy walidacji:\n\n" + this.errors.join("\n\n"));
        }
    }
}

const formValidator = new FormValidator();
window.formValidator = formValidator;
