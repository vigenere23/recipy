var Validator = require('./validator');

function Sanitizer(element) {
	if (!(this instanceof Sanitizer)) {
		return new Sanitizer(element);
	}
	this.element = element;
};

Sanitizer.prototype.capitalize = function capitalize() {
	Validator(this.element).assumeIsString();
	this.element = this.element.charAt(0).toUpperCase() + this.element.slice(1);
	return this;
};

Sanitizer.prototype.toSnakeCase = function toSnakeCase() {
	Validator(this.element).assumeIsString();
	this.element = this.element.replace(/ /g, '_').toLowerCase();
	return this;
};

Sanitizer.prototype.toNormalCase = function toNormalCase() {
	Validator(this.element).assumeIsString();
	this.element = this.element.replace(/_/g, ' ');
	return this;
};

Sanitizer.prototype.toString = function toString() {
	this.element = this.element.toString();
};

Sanitizer.prototype.toInt = function toInt() {
	this.element = Number(this.element);
	Validator(this.element).assumeIsNumber();
	return this;
};

Sanitizer.prototype.maxLength = function maxLength(maxLength) {
	Validator(this.element).assumeIsString();
	Validator(maxLength).assumeIsInt().assumeIsPositive();
	if (this.element.length > maxLength - 1) {
		this.element = this.element.slice(0, maxLength - 1) + "\u2026";
	}
	return this;
}


module.exports = Sanitizer;