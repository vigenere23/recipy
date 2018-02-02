if (!(HTMLElement.prototype.ancestor)) {
	HTMLElement.prototype.ancestor = function(className) {
		var element = this;
		while (!(element.classList.contains(className)) && element != document) {
			element = element.parentNode;
		}
		if (element == document) {
			throw "ERROR: " + this + " has no ancestor with className " + className;
		}
		return element;
	}
}

if (!(HTMLElement.prototype.hasParent)) {
	HTMLElement.prototype.hasParent = function(className) {
		var old_element = this;
		var new_element = this;
		while (!(new_element.classList.contains(className)) && new_element != document) {
			old_element = new_element;
			new_element = new_element.parentNode;
		}
		if (new_element != document) {
			return old_element;
		}

	}
}

if (!(HTMLElement.prototype.clearEntries)) {
	HTMLElement.prototype.clearEntries = function(selector="") {
		var inputs;
		if (selector) {
			inputs = this.querySelectorAll(selector);
		}
		else {
			inputs = this.children;
		}
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].value = "";
		}
	}
}

if (!(HTMLElement.prototype.removeClasses)) {
	HTMLElement.prototype.removeClasses = function(classNames) {
		for (let i = 0; i < classNames.length; i++) {
			for (let j = 0; j < this.classList.length; j++) {
				if (this.classList[j].includes(classNames[i])) {
					this.classList[j].remove(classNames[i]);
					break;
				}
			}
		}
	}
}

if (!(HTMLElement.prototype.siblings)) {
	HTMLElement.prototype.siblings = function() {
		return this.parentNode.children;
	}
}

if (!(HTMLCollection.prototype.last)) {
	HTMLCollection.prototype.last = function() {
		return this[this.length - 1];
	}
}

if(!(NodeList.prototype.removeClasses)) {
	NodeList.prototype.removeClasses = function(classNames) {
		for (let x = 0; x < this.length; x++) {
			for (let i = 0; i < classNames.length; i++) {
				for (let j = 0; j < this[x].classList.length; j++) {
					if (this[x].classList[j].includes(classNames[i])) {
						this[x].classList.remove(this[x].classList[j]);
						break;
					}
				}
			}
		}
	}
}

var childrenEmpty = function(element, childrenSelector) {
	var children = element.querySelectorAll(childrenSelector);
	for (var i = 0; i < children.length; i++) {
		if (children[i].value) {
			return false;
		}
	}
	return true;
}



class Expander {
	constructor(inputSelector) {
		this.inputSelector = inputSelector;
		var inputs = document.querySelectorAll(".expander " + inputSelector);
		for (var i = 0; i < inputs.length; i++) {
			this.addEventBlur(inputs[i]);
			this.expander(inputs[i]);
		}
	}

	childInputs(parent) {
		return parent.querySelectorAll(this.inputSelector);
	}

	addEventBlur(input) {
		var self = this;
		input.addEventListener("input", function(event) {
			self.expander(event.target);
		});
	}

	expander(input) {
		var expandable = input.hasParent("expander");
		if (!(input.value)) {
			var expandables = expandable.siblings();
			if (expandables.length > 2) {
				if (expandable != expandables.last()) {
					this.removeExpandable(expandable);
					this.reorder(expandables);
				}
			}
			else if (expandables.length == 1) {
				this.addExpandable(expandable.parentNode);
			}
		}
		else {
			if (!(childrenEmpty(expandable.siblings().last(), this.inputSelector))) {
				this.addExpandable(expandable.parentNode);
				var inputs = this.childInputs(expandable);
				for (var i = 0; i < inputs.length; i++) {
					inputs[i].required = true;
				}
			}
		}
	}

	addExpandable(expander) {
		var last_expandable = expander.children.last();
		var new_expandable = last_expandable.cloneNode(true);
		new_expandable.clearEntries("input, select");
		this.childInputs(new_expandable).removeClasses(["error"]);
		new_expandable.id = String(parseInt(last_expandable.id) + 1);
		expander.appendChild(new_expandable);

		var key = expander.className.replace("expander", "").replace(/ /g, "");
		this.rename(key, new_expandable.children);

		var inputs = this.childInputs(new_expandable);
		for (var i = 0; i < inputs.length; i++) {
			this.addEventBlur(inputs[i]);
			inputs[i].required = false;
		}
	}

	removeExpandable(expandable) {
		expandable.parentNode.removeChild(expandable);
	}

	rename(key, items) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var secondaryKey = (item.className) ? "[" + item.className + "]" : "";
			item.setAttribute("name", key + "[" + item.parentNode.id + "]" + secondaryKey);
		}
	}

	reorder(expandables) {
		for (var i = 0; i < expandables.length; i++) {
			var expandable = expandables[i];
			expandable.id = String(i);

			var key = expandable.ancestor("expander").className.replace("expander", "").replace(/ /g, "");
			this.rename(key, expandable.children);
		}
	}
}
