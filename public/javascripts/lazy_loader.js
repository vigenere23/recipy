class LazyLoader {
	constructor(selector) {
		var divs = document.querySelectorAll(selector);
		for (var i = 0; i < divs.length; i++) {
			var div = divs[i];
			var div_bg = window.getComputedStyle(div).getPropertyValue("background-image");
			if (div_bg == "") {
				div.style.backgroundImage = "url(" + div.dataset.imageUrl + ")";
			}
			else {
				div.style.backgroundImage = div_bg + ", url(" + div.dataset.imageUrl + ")";
			}
		}
	}
}
