"use strict";
exports.__esModule = true;
var Validator_1 = require("./Validator");
function test() {
    var validator = new Validator_1.Validator("Hello");
    console.assert(validator.isAlpha().isAlphaNum().isValid());
}
exports.test = test;
