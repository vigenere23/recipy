var express = require('express');
var fs = require('fs');
var multer = require("multer");
var Sanitizer = require('../sanitizer');

var router = express.Router();
var storage = multer.diskStorage({
	destination: './public/images/',
	filename: function (req, file, callback) {
		var recipe_title = req.body.recipe_title;
		var recipe_name = Sanitizer(recipe_title)
			.toSnakeCase().element;

		callback(null, recipe_name + '.jpg');
	}
});
var upload = multer({storage: storage});

// Require controller modules.
var recipes_controller = require("../controllers/recipesController");

// GET recipes listing.
router.get('/', recipes_controller.index);

// GET request for new recipe.
router.get('/new/:recipe_name', recipes_controller.new);
router.get('/new', recipes_controller.new);

// POST request for new recipe.
router.post('/new/:recipe_name', upload.single("picture"), recipes_controller.new_post);
router.post('/new', upload.single("picture"), recipes_controller.new_post);

// GET request for recipe.
router.get('/:recipe_name', recipes_controller.recipe);

// GET request for editing recipe.
router.get('/:recipe_name/edit', recipes_controller.edit);

// POST request for editing recipe.
router.post('/:old_recipe_name/edit', upload.single("picture"), recipes_controller.edit_post);

module.exports = router;
