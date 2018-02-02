class InvalidInputs {
	constructor(errorName) {
		this.errorName = errorName;
		this.errorClass = "error-" + errorName;
		var invalid_inputs = document.getElementsByClassName(this.errorClass);
		for (var i = 0; i < invalid_inputs.length; i++) {
			invalid_inputs[i].parentNode.appendChild(this.createError(this.errorName));
			invalid_inputs[i].addEventListener("focus", (event) => {
				event.target.classList.remove(this.errorClass);
				event.target.parentNode.querySelector(".error").style.display = "none";
			});
		}
	}

	createError(error) {
		var text = error.replace(/-/g, " ");
		var div = document.createElement("div");
		var p = document.createElement("p");
		div.className = "error";
		p.innerText = text;
		div.appendChild(p);
		return div;
	}
}

// <div class="error-invalid-name"><p>Error: name is invalid</p></div>
// <div class="error-name-already-taken"><p>Error: name is already taken</p></div>