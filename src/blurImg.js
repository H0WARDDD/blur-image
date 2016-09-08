+(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.BlurImg = factory();
	}
}(this, function() {
	'use strict';

	var defaults = {
		//Options
		target: document.getElementsByClassName("blur-image"),
		filter: 'css',

		//Callbacks
		onPreviewLoaded: function() {
			return true;
		},
		onOriginalLoaded: function() {
			return true;
		}
	};

	function init(options) {
		var options = options || {};
		for (var i in defaults)
			if (defaults.hasOwnProperty(i) && !options.hasOwnProperty(i))
				options[i] = defaults[i];

		if (options.target.length === 0) {
			throw new Error('No blur elements detected!');
		}
		for (var i in options.target)
			_blur(options.target[i], options);
	};

	function _setStyle(elem, className) {
		if (elem.classList) {
			elem.classList.add(className);
		} else {
			elem.className += ' ' + className;
		}
	};

	function _generateUUID() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	};

	function _blur(elem, options) {
		var previewSrc = elem.getAttribute('data-preview-src') ? elem.getAttribute('data-preview-src') : false;
		var originalSrc = elem.getAttribute('data-original-src');
		var realWidth = elem.getAttribute('data-width');
		var realHeight = elem.getAttribute('data-height');

		var blurContainer = document.createElement("div");
		blurContainer.className = "blur-container";
		blurContainer.style.paddingBottom = realHeight / realWidth * 100 + '%';
		elem.appendChild(blurContainer);
		if (previewSrc) {
			var preview = new Image();
			preview.className = "preview";
			if (options.filter === 'css') {
				_setStyle(preview, 'filter');
			} else if (options.filter === 'canvas') {
				var canvas = document.createElement("canvas");
			}
			preview.src = previewSrc;
			blurContainer.appendChild(preview);
			preview.onload = function() {
				if (canvas) {
					var previewID = _generateUUID();
					var canvasID = _generateUUID();
					preview.id = previewID;
					canvas.id = canvasID;
					blurContainer.appendChild(canvas);
				}
				_setStyle(blurContainer, 'preview-loaded');
				options.onPreviewLoaded.call(this, blurContainer);
			};
		}
		var original = new Image();
		original.className = "original";
		original.src = originalSrc;
		original.onload = function() {
			_setStyle(blurContainer, 'original-loaded');
			options.onOriginalLoaded.call(this, blurContainer);
		};
		blurContainer.appendChild(original);
	};

	return {
		init: init
	};
}));
