var express = require('express');
var router = express.Router();

var test_controller = require("../controllers/testController");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('layout.ejs', {
		page_title: "No test specified",
		inner_page: "404",
		message: "Please specifiy a test"
	})
});

router.get('/validator', test_controller.validator);

module.exports = router;