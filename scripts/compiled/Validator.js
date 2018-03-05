"use strict";
exports.__esModule = true;
var Validator = /** @class */ (function () {
    function Validator(_value, regex) {
        if (regex === void 0) { regex = /.^/; }
        this._value = _value;
        this.regex = regex;
        this._errors = [];
        return this;
    }
    Validator.prototype.value = function () {
        return this._value;
    };
    Validator.prototype.errors = function () {
        return this._errors;
    };
    Validator.prototype.isAlpha = function () {
        if (!/^[a-z]+$/i.test(this._value)) {
            this._errors.push("_value is not alphabetic");
        }
        return this;
    };
    Validator.prototype.isLowerCase = function () {
        return this;
    };
    Validator.prototype.isUpperCase = function () {
        return this;
    };
    Validator.prototype.isCapitalized = function () {
        return this;
    };
    Validator.prototype.isNum = function () {
        if (!/^[0-9]+$/.test(this._value)) {
            this._errors.push("_value is not numeric");
        }
        return this;
    };
    Validator.prototype.isAlphaNum = function () {
        if (!/^[a-z0-9]+$/i.test(this._value)) {
            this._errors.push("_value is not alphanumeric");
        }
        return this;
    };
    Validator.prototype.isRestrictedSentence = function () {
        var unicode_letters = "\u00E0\u00E2\u00E7\u00E8\u00E9\u00EA\u00EB\u00EF\u00F1\u00F4\u00FB\u0153";
        // àâçèéêëïñôûœ
        var regex = new RegExp("^([.,\(\)a-z" + unicode_letters + "]+|[0-9]+)(((\\s|-|')[.,\(\)a-z" + unicode_letters + "]+)|((\\s|-|')[0-9]+))*$", "iu");
        if (!regex.test(this._value)) {
            this._errors.push("_value must be a valid sentence");
        }
        return this;
    };
    Validator.prototype.isRegex = function () {
        if (!this.regex.test(this._value)) {
            this._errors.push("_value does not respect specified regex " + this.regex);
        }
        return this;
    };
    Validator.prototype.isMin = function (mininum, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        if (exclusive) {
            if (!(this._value > mininum)) {
                this._errors.push("_value must be greater than " + mininum);
            }
        }
        if (!(this._value >= mininum)) {
            this._errors.push("_value must be greater or equal to " + mininum);
        }
        return this;
    };
    Validator.prototype.isMax = function (maximum, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        if (exclusive) {
            if (!(this._value < maximum)) {
                this._errors.push("_value must be smaller than " + maximum);
            }
        }
        if (!(this._value <= maximum)) {
            this._errors.push("_value must be smaller or equal to " + maximum);
        }
        return this;
    };
    Validator.prototype.isValid = function () {
        if (this.errors.length == 0)
            return true;
        return false;
    };
    Validator.prototype.throw_errors = function () {
        throw this._errors;
        /*for (let error of this._errors) {
            throw error + "\n_value was: " + this._value;
        }*/
    };
    Validator.prototype.sanitizer = function () {
        // Will return an instance of "Sanitizer(this._value)" to link to sanitizer's methods.
    };
    return Validator;
}());
exports.Validator = Validator;
