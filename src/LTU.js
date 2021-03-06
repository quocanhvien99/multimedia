var LTU = function (elem) {
	var context = this;
	try {
		var file = elem.files[0];
		var fr = new FileReader();
		fr.onload = function () {
			var img = new Image();
			img.onload = function () {
				context.image = img;
				context.imageData = context.extractImageData();
				context.debugger('Type matched. input[file]. Saved as [LTU object]');
				try {
					context.onload();
				} catch (e) {
					context.debugger('ready callback not found');
				}
				return;
			};
			img.src = fr.result;
		};
		fr.readAsDataURL(file);
	} catch (e) {
		context.debugger('Not input[file].');
	}
};

LTU.prototype.debug = false;

LTU.prototype.debugger = function (msg) {
	if (this.debug) {
		console.log(msg);
	}
};

LTU.prototype.ready = function (onLoadFunc) {
	this.onload = onLoadFunc;
};

LTU.prototype.onload = null;

LTU.prototype.extractImageData = function () {
	var img = this.image;
	var drawArea = document.createElement('canvas');
	var ctx = drawArea.getContext('2d');
	drawArea.width = img.width;
	drawArea.height = img.height;
	ctx.drawImage(img, 0, 0, img.width, img.height);
	this.imageData = ctx.getImageData(0, 0, img.width, img.height);
	return this.imageData;
};

LTU.prototype.getColorAt = function (x, y) {
	var index = y * 4 * this.imageData.width + x * 4;
	var colorData = {
		red: this.imageData.data[index],
		green: this.imageData.data[index + 1],
		blue: this.imageData.data[index + 2],
		alpha: this.imageData.data[index + 3],
	};
	return colorData;
};

LTU.prototype.setColorAt = function (x, y, obj) {
	var index = y * 4 * this.imageData.width + x * 4;
	try {
		this.imageData.data[index] = obj.red;
		this.imageData.data[index + 1] = obj.green;
		this.imageData.data[index + 2] = obj.blue;
		this.imageData.data[index + 3] = obj.alpha;
		return true;
	} catch (e) {
		return e;
	}
};

LTU.prototype.blackAndWhite = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			var green = imageData.data[index + 1];
			var blue = imageData.data[index + 2];
			var avg = (red + green + blue) / 3;
			imageData.data[index] = avg;
			imageData.data[index + 1] = avg;
			imageData.data[index + 2] = avg;
		}
	}
	return this;
};

LTU.prototype.blackAndWhite2 = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			var green = imageData.data[index + 1];
			var blue = imageData.data[index + 2];
			var avg = red * 0.3 + green * 0.59 + blue * 0.11;
			imageData.data[index] = avg;
			imageData.data[index + 1] = avg;
			imageData.data[index + 2] = avg;
		}
	}
	return this;
};

LTU.prototype.red = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			imageData.data[index] = red;
			imageData.data[index + 1] = 0;
			imageData.data[index + 2] = 0;
		}
	}
	return this;
};

LTU.prototype.green = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var green = imageData.data[index + 1];
			imageData.data[index] = 0;
			imageData.data[index + 1] = green;
			imageData.data[index + 2] = 0;
		}
	}
	return this;
};

LTU.prototype.blue = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var blue = imageData.data[index + 2];
			imageData.data[index] = 0;
			imageData.data[index + 1] = 0;
			imageData.data[index + 2] = blue;
		}
	}
	return this;
};

LTU.prototype.opacity = function (amount) {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var opacity = imageData.data[index + 3];
			opacity += amount;
			if (opacity < 0) {
				opacity = 0;
			}
			if (opacity > 255) {
				opacity = 255;
			}
			imageData.data[index + 3] = opacity;
		}
	}
	return this;
};

LTU.prototype.sepia = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			var green = imageData.data[index + 1];
			var blue = imageData.data[index + 2];
			imageData.data[index] = red * 0.393 + green * 0.769 + blue * 0.189;
			imageData.data[index + 1] = red * 0.349 + green * 0.686 + blue * 0.168;
			imageData.data[index + 2] = red * 0.272 + green * 0.534 + blue * 0.131;
		}
	}
	return this;
};

LTU.prototype.negative = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			var green = imageData.data[index + 1];
			var blue = imageData.data[index + 2];
			var alpha = imageData.data[index + 3];
			red = 255 - red;
			green = 255 - green;
			blue = 255 - blue;
			imageData.data[index] = red;
			imageData.data[index + 1] = green;
			imageData.data[index + 2] = blue;
		}
	}
	return this;
};

LTU.prototype.random = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

LTU.prototype.noise = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var randRed = this.random(100, 200);
			var randGreen = this.random(100, 200);
			var randBlue = this.random(100, 200);
			var red = (imageData.data[index] + randRed) / 2;
			var green = (imageData.data[index + 1] + randGreen) / 2;
			var blue = (imageData.data[index + 2] + randBlue) / 2;
			imageData.data[index] = red;
			imageData.data[index + 1] = green;
			imageData.data[index + 2] = blue;
		}
	}
	return this;
};

LTU.prototype.contrast = function (amount) {
	var value = (255.0 + amount) / 255.0;
	value *= value;
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var r = imageData.data[index];
			var g = imageData.data[index + 1];
			var b = imageData.data[index + 2];
			var red = r / 255.0;
			var green = g / 255.0;
			var blue = b / 255.0;
			red = ((red - 0.5) * value + 0.5) * 255.0;
			green = ((green - 0.5) * value + 0.5) * 255.0;
			blue = ((blue - 0.5) * value + 0.5) * 255.0;
			if (red > 255) red = 255;
			if (red < 0) red = 0;
			if (green > 255) green = 255;
			if (green < 0) green = 0;
			if (blue > 255) blue = 255;
			if (blue < 0) blue = 0;
			imageData.data[index] = red;
			imageData.data[index + 1] = green;
			imageData.data[index + 2] = blue;
		}
	}
	return this;
};

LTU.prototype.brightness = function (amount) {
	var imageData = this.imageData;
	this.debugger(amount);
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			var green = imageData.data[index + 1];
			var blue = imageData.data[index + 2];
			red = red + amount;
			green = green + amount;
			blue = blue + amount;
			if (red > 255) red = 255;
			if (red < 0) red = 0;
			if (green > 255) green = 255;
			if (green < 0) green = 0;
			if (blue > 255) blue = 255;
			if (blue < 0) blue = 0;
			imageData.data[index] = red;
			imageData.data[index + 1] = green;
			imageData.data[index + 2] = blue;
		}
	}
	return this;
};

LTU.prototype.vintage = function () {
	var imageData = this.imageData;
	for (var i = 0; i < imageData.width; i++) {
		for (var j = 0; j < imageData.height; j++) {
			var index = j * 4 * imageData.width + i * 4;
			var red = imageData.data[index];
			var green = imageData.data[index + 1];
			var blue = imageData.data[index + 2];
			red = green;
			green = red;
			blue = 150;
			imageData.data[index] = red;
			imageData.data[index + 1] = green;
			imageData.data[index + 2] = blue;
		}
	}
	this.contrast(50);
	return this;
};

LTU.prototype.crayon = function () {
	this.noise().contrast(500);
	return this;
};
LTU.prototype.cartoon = function () {
	this.contrast(400);
	return this;
};

LTU.prototype.canvas = null;

LTU.prototype.loadImageToCanvas = function (drawArea) {
	if (drawArea == null && this.canvas != null) {
		drawArea = this.canvas;
	}
	try {
		var imageData = this.imageData;
		var ctx = drawArea.getContext('2d');
		drawArea.width = imageData.width;
		drawArea.height = imageData.height;
		ctx.putImageData(imageData, 0, 0);
		return true;
	} catch (e) {
		return false;
	}
};
