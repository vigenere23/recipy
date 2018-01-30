document.addEventListener("DOMContentLoaded", function() {
	new LazyLoader("[data-image-url]");
	new Expander("input[type=text]");
	new InvalidInputs("invalid-name");
	new InvalidInputs("name-already-taken");
});