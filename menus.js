function show_tab(tab_name) {
	$('.central-menu').hide();
	$('#' + tab_name).show();
	jettison_displayed = false;
}

$('#menu-buttons').append("<a href='#' id='build-link'>Construction</a>&nbsp;&nbsp;|&nbsp;&nbsp;");
$('#menu-buttons').append('<a href="#" id="products-link">Products</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
$('#menu-buttons').append('<a href="#" id="fabrication-link">Fabricators</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
$('#menu-buttons').append('<a href="#" id="furnace-link">Furnaces</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
$('#menu-buttons').append('<a href="#" id="jettison-link">Jettison</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
$('#menu-buttons').append('<a href="#" id="reset-link">Reset</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
$('#menu-buttons').append('<a href="#" id="save-link">Save</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
if (debug) {
	$('#menu-buttons').append('<a href="#" id="debug-link">Debug</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
}

// Add button listeners
(function() {
	$('#build-link').on('click', function () {
		show_tab("build-menu");
	});
}());

(function() {
	$('#fabrication-link').on('click', function () {
		manufacturer_graphical_init("fabricator");
		show_tab("manufacturer-menu");
	});
}());

(function() {
	$('#products-link').on('click', function () {
		show_tab("product-menu");
	});
}());

(function() {
	$('#furnace-link').on('click', function () {
		manufacturer_graphical_init("furnace");
		show_tab("manufacturer-menu");
	});
}());

if (debug) {
	(function() {
		$('#debug-link').on('click', function () {
			
			var a = {a:1, b:2, c:3};
			a.print = function (){console.log (this);}
			b = {b:4};
			var b = $.extend (a, b);
			//b = $.extend (b, {b:4});
			
			console.log (b);
			
			var test1 = {};
			var test2 = {};
			
			test1.name = 'id1';
			test2.name = 'id2';
			
			test1.print = function() {
				console.log ("test1");
				console.log (this.name);
				console.log (this);
			}
			
			var keys = Object.keys(test1);
			
			for (var i = 0; i < keys.length; i++) {
				var val = test1[keys[i]];
				//console.log (typeof(val));
				if (typeof(val) == 'function') {
					test2.print = val.bind (test2);
				}
			}
			
			
			var keys = Object.keys(test2);
			for (var i = 0; i < keys.length; i++) {
				var val = test2[keys[i]];
			}
					
			for (var key in copper) {
				if (copper.hasOwnProperty(key)) {
					var val = copper[key];
					//console.log (key);
					//console.log (val);
				}
			}
			
			//console.log (JSON.stringify(copper));
		});
	}());
}

(function() {
	$('#reset-link').on('click', function () {
		$('.central-menu').hide();
		game_state.reset();
	});
}());

(function() {
	$('#save-link').on('click', function () {
		for (var i = 0; i < glob.length; i++) {
			localStorage["glob"+i] = JSON.stringify(glob[i]);
		}
	});
}());


(function() {
	$('#jettison-link').on('click', function () {
		show_tab("jettison-menu");
	});
}());
