var fs = require('fs');

var Sanitizer = require('../sanitizer');
var Validator = require('../validator');


if (!(Array.prototype.last)) {
	Array.prototype.last = function() {
		return this[this.length - 1];
	}
}


// Display list of recipes.
exports.index = function(req, res) {
	fs.readFile("recipes.json", "utf-8", function(err, data) {
		if (err) throw err;
		
		var recipe_catalog = JSON.parse(data);
		var recipes = [];
		for (let recipe_name in recipe_catalog) {
			let image_name = fs.existsSync("./public/images/" + recipe_name + ".jpg")
				? recipe_name
				: "default";
			
			let recipe_title = Sanitizer(recipe_name)
				.toNormalCase()
				.capitalize()
				.maxLength(50)
				.element;

			recipes.push({
				"recipe_name": recipe_name,
				"recipe_title": recipe_title,
				"image_name": image_name
			});
		}
		res.render("layout.ejs", {
			page_title: "Recipes",
			inner_page: "recipes",
			recipes: recipes
		});
	});
};


// GET single recipe
exports.recipe = function(req, res) {
	var recipe_name = req.params.recipe_name;
	var recipe_title = Sanitizer(recipe_name)
		.toNormalCase()
		.capitalize()
		.element;

	fs.readFile("recipes.json", "utf-8", function (err, data) {
		if (err) throw err;
		var recipes = JSON.parse(data);

		if (!(recipe_name in recipes)) {
			res.render("layout.ejs", {
				page_title: "Recipe not found",
				inner_page: "404",
				message: "There's no recipe called \"" + recipe_title + "\"",
				button_text: "Create it!",
				button_link: "/recipes/new/" + recipe_name
			});
		}
		else {		
			var recipe = recipes[recipe_name];
			let image_name = fs.existsSync("./public/images/" + recipe_name + ".jpg")
				? recipe_name
				: "default";
			var image_path = "/images/" + image_name + ".jpg";

			res.render("layout.ejs", {
				page_title: recipe_title,
				inner_page: "recipe",
				recipe_name: recipe_name,
				image_path: image_path,
				ingredients: recipe.ingredients,
				steps: recipe.steps
			});
		}
	});
};


// GET edit form for a single recipe
exports.edit = function(req, res) {
	var recipe_name = req.params.recipe_name;
	var recipe_title = Sanitizer(recipe_name)
		.toNormalCase()
		.capitalize()
		.element;
	
		fs.readFile("recipes.json", "utf-8", function (err, data) {
		if (err) throw err;
		var recipes = JSON.parse(data);

		if (!(recipe_name in recipes)) {
			res.render("layout.ejs", {
				page_title: "Recipe not found",
				inner_page: "404",
				message: "There's no recipe called \"" + recipe_title + "\"",
				button_text: "Create it!",
				button_link: "/new_recipe/" + recipe_name
			});
		}
		else {		
			var recipe = recipes[recipe_name];
			res.render("layout.ejs", {
				page_title: recipe_title,
				inner_page: "recipe_form",
				recipe_title: recipe_title,
				ingredients: recipe.ingredients,
				steps: recipe.steps
			});
		}
	});
};


// POST edit form for a single recipe
exports.edit_post = function(req, res) {
	fs.readFile("recipes.json", "utf-8", function(err, data) {
		if (err) throw err;

		var recipes = JSON.parse(data);
		var recipe_title = req.body.recipe_title;
		var new_recipe_name = Sanitizer(recipe_title)
			.toSnakeCase()
			.element;
		var ingredients = req.body.ingredients;
		var steps = req.body.steps;
		var old_recipe_name = req.params.old_recipe_name;

		var rendering_options = {
			page_title: "Edit - " + recipe_title,
			inner_page: "recipe_form",
			recipe_title: recipe_title,
			ingredients: ingredients,
			steps: steps
		}

		// Removes empty ingredients for further parsing
		while (ingredients.last().name == "") {
			ingredients.pop();
		}

		// Removes empty steps for further parsing
		while (steps.last() == "") {
			steps.pop();
		}

		var has_errors = false;

		// Check if new recipe name already exists
		if (new_recipe_name in recipes && new_recipe_name != old_recipe_name) {
			rendering_options.name_already_taken = true;
			has_errors = true;
		}

		// Check if recipe title respects the regex pattern
		if (!(Validator(recipe_title).checkIfText()) || recipe_name == "default") {
			rendering_options.invalid_name = true;
			has_errors = true;
		}

		// Check if ingredients names respect the regex pattern
		for (let i = 0; i < ingredients.length; i++) {
			if (!(Validator(ingredients[i]["name"]).checkIfText())) {
				rendering_options.invalid_ingredient = i;
				has_errors = true;
			}
		}

		// Check if steps names respect the regex pattern
		for (let i = 0; i < steps.length; i++) {
			if (!(Validator(steps[i]).checkIfText())) {
				rendering_options.invalid_step = i;
				has_errors = true;
			}
		}

		if (has_errors) {
			res.render("layout.ejs", rendering_options);
			return;
		}

		// Everything in order, delete or rename sold image if needed
		if (new_recipe_name != old_recipe_name) {
			var old_image_path = './public/images/' + old_recipe_name + '.jpg';
			if (req.file) {
				fs.unlinkSync(old_image_path);
			}
			else {
				var new_image_path = './public/images/' + new_recipe_name + '.jpg';				
				fs.renameSync(old_image_path, new_image_path);
			}
		}
		
		// ...remove old recipe...
		delete recipes[old_recipe_name];

		// ..., add recipe to object...
		recipes[new_recipe_name] = {
			"ingredients": ingredients,
			"steps": steps
		};

		// ...and rewrite it to json file
		fs.writeFile("recipes.json", JSON.stringify(recipes), function(err) {
			if (err) throw err;
			res.redirect("/recipes/" + new_recipe_name);
		});
	});
};


// GET new recipe form
exports.new = function(req, res) {
	res.render("layout.ejs", {
		page_title: "New recipe",
		inner_page: "recipe_form"
	});
};


// POST new recipe form
exports.new_post = function(req, res) {
	fs.readFile("recipes.json", "utf-8", function(err, data) {
		if (err) throw err;

		var recipes = JSON.parse(data);
		var recipe_title = req.body.recipe_title;
		var recipe_name = Sanitizer(recipe_title)
			.toSnakeCase()
			.element;
		var ingredients = req.body.ingredients;
		var steps = req.body.steps;

		var rendering_options = {
			page_title: "New recipe",
			inner_page: "recipe_form",
			recipe_title: recipe_title,
			ingredients: ingredients,
			steps: steps
		}

		// Removes empty ingredients for further parsing
		while (ingredients.last().name == "") {
			ingredients.pop();
		}

		// Removes empty steps for further parsing
		while (steps.last() == "") {
			steps.pop();
		}

		var has_errors = false;

		// Check if recipe already exists (by its name)
		if (recipe_name in recipes) {
			rendering_options.name_already_taken = true;
			has_errors = true;
		}

		// Check if recipe title respects the regex pattern
		if (!(Validator(recipe_title).checkIfText()) || recipe_name == "default") {
			rendering_options.invalid_name = true;
			has_errors = true;
		}

		// Check if ingredients names respect the regex pattern
		for (let i = 0; i < ingredients.length; i++) {
			if (!(Validator(ingredients[i]["name"]).checkIfText())) {
				rendering_options.invalid_ingredient = i;
				has_errors = true;
			}
		}

		// Check if steps names respect the regex pattern
		for (let i = 0; i < steps.length; i++) {
			if (!(Validator(steps[i]).checkIfText())) {
				rendering_options.invalid_step = i;
				has_errors = true;
			}
		}

		if (has_errors) {
			res.render("layout.ejs", rendering_options);
			return;
		}

		// Everything in order, add recipe to object...
		recipes[recipe_name] = {
			"ingredients": ingredients,
			"steps": steps
		};

		// ...and rewrite it to json file
		fs.writeFile("recipes.json", JSON.stringify(recipes), function(err) {
			if (err) throw err;
			res.redirect("/recipes/" + recipe_name);
		});
	});
};