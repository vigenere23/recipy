function Validator(element) {
	if (!(this instanceof Validator)) {
		return new Validator(element);
	}
	this.element = element;
}

/*** CHECKERS -> return boolean ***/

Validator.prototype.checkIfString = function checkIfString() {
	return (typeof this.element === 'string');
};

Validator.prototype.checkIfNumber = function checkIfNumber() {
	return (!(isNaN(this.element)));
};

Validator.prototype.checkIfInt = function checkIfInt() {
	return (this.element === parseInt(this.element));
};

Validator.prototype.checkIfPositive = function checkIfPositive() {
	return (this.element > 0);
};

Validator.prototype.checkIfText = function checkIfText() {
	var unicode_letters = "\u00E0\u00E2\u00E9\u00E8\u00EA\u00F4\u00EB\u00EF\u00E7\u00F1\u00FB\u0153";
	var exp = new RegExp("^([.,\(\)a-z" + unicode_letters + "]+|[0-9]+)(((\\s|-|')[.,\(\)a-z" + unicode_letters + "]+)|((\\s|-|')[0-9]+))*$", "iu");
	return(exp.test(this.element));
};


/*** ASSUMERS -> throw errors ***/

Validator.prototype.assumeIsString = function assumeIsString() {
	if (typeof this.element !== 'string') {
		throw new Error("Must be a string!");
	}
	return this;
};

Validator.prototype.assumeIsNumber = function assumeIsNumber() {
	if (isNaN(this.element)) {
		throw new Error("Must be a number!");
	}
	return this;
};

Validator.prototype.assumeIsInt = function() {
	if (this.element !== parseInt(this.element)) {
		throw new Error("Must be an integer!");
	}
	return this;
};

Validator.prototype.assumeIsPositive = function() {
	if (this.element < 0) {
		throw new Error("Must be positive!");
	}
	return this;
};


module.exports = Validator;