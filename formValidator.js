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
