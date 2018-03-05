export class Validator
{
	private _errors: string[];

	constructor(private _value: any, private regex = /.^/) {
		this._errors = [];
		return this;
	}

	value(): any {
		return this._value;
	}

	errors(): string[] {
		return this._errors;
	}

	isAlpha(): Validator {
		if (!/^[a-z]+$/i.test(this._value)) {
			this._errors.push("_value is not alphabetic");
		}
		return this;
	}

	isLowerCase(): Validator {
		return this;
	}

	isUpperCase(): Validator {
		return this;
	}

	isCapitalized(): Validator {
		return this;
	}

	isNum(): Validator {
		if(!/^[0-9]+$/.test(this._value)) {
			this._errors.push("_value is not numeric");
		}
		return this;
	}

	isAlphaNum(): Validator {
		if(!/^[a-z0-9]+$/i.test(this._value)) {
			this._errors.push("_value is not alphanumeric");
		}
		return this;
	}

	isRestrictedSentence(): Validator {
		let unicode_letters = "\u00E0\u00E2\u00E7\u00E8\u00E9\u00EA\u00EB\u00EF\u00F1\u00F4\u00FB\u0153";
		// àâçèéêëïñôûœ
		let regex = new RegExp("^([.,\(\)a-z" + unicode_letters + "]+|[0-9]+)(((\\s|-|')[.,\(\)a-z" + unicode_letters + "]+)|((\\s|-|')[0-9]+))*$", "iu");
		if(!regex.test(this._value)) {
			this._errors.push("_value must be a valid sentence");
		}
		return this;
	}

	isRegex(): Validator {
		if(!this.regex.test(this._value)) {
			this._errors.push("_value does not respect specified regex " + this.regex);
		}
		return this;
	}

	isMin(mininum: any, exclusive = false): Validator {
		if (exclusive) {
			if(!(this._value > mininum)) {
				this._errors.push("_value must be greater than " + mininum);
			}
		}
		if(!(this._value >= mininum)) {
			this._errors.push("_value must be greater or equal to " + mininum);
		}
		return this;
	}

	isMax(maximum: any, exclusive = false): Validator {
		if (exclusive) {
			if(!(this._value < maximum)) {
				this._errors.push("_value must be smaller than " + maximum);
			}
		}
		if(!(this._value <= maximum)) {
			this._errors.push("_value must be smaller or equal to " + maximum);
		}
		return this;
	}

	isValid(): boolean {
		if (this.errors.length == 0) return true;
		return false;
	}

	throw_errors() {
		throw this._errors;
		/*for (let error of this._errors) {
			throw error + "\n_value was: " + this._value;
		}*/
	}

	sanitizer() /*: Sanitizer*/ {
		// Will return an instance of "Sanitizer(this._value)" to link to sanitizer's methods.
	}
}