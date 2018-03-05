exports.validator = function(req, res) {
	var test = require('../scripts/compiled/ValidatorTest');
	test.test();
	res.render('layout.ejs', {
		page_title: "Validator test",
		inner_page: "empty"
	})
}