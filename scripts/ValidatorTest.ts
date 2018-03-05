import { Validator } from './Validator';

export function test() {
	var validator = new Validator("Hello");
	console.assert(validator.isAlpha().isAlphaNum().isValid());
}