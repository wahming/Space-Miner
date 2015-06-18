SpaceMiner.Jettison = {
	_x: true,
	_jettisonDisplayed: false,

	init: function () {
		this._graphicalInit();
	},
	graphicalUpdate: function () {
		if ($('#jettison-menu').css('display') == 'block' && !this._jettisonDisplayed) {
			$('#jettison-dropdown').empty();
			for (var i = 0; i < glob.length; i++) {
				if (glob[i].appear_in_game && glob[i].quantity > 0 && glob[i].jettisonable) {
					$('#jettison-dropdown').append("<div class='jettison-opt' onclick='jettison_click(" + i + ")' id='opt" + i +
						"' onmouseenter=\"SpaceMiner.General.info.call (glob[" + i + "])\">"
						+ glob[i].name + "</div>");
				}
			}
		}
	},
	_graphicalInit: function () {
		var $jettison = $('#jettison-menu');
		$jettison.remove();
		$('#central-panel').append("<div id='jettison-menu' class='central-menu'></div>");
		$jettison.append("<div id='jettison-select' onclick='this.drop()'>Jettison:<span id='jettison-select-arrow'>" + '\u25BC' + "</span></div>");
		$jettison.append("<div id='jettison-dropdown' onclick='this.drop()'></div>");
		$jettison.append("<div id='jettison-details'></div>");
	},
	drop: function () {
		if (this._x === true) {
			this._jettisonDisplayed = true;
			$('#jettison-details').empty();
			document.getElementById("jettison-dropdown").style.display = "inline-block";
			this._x = false;
		} else if (this._x === false) {
			document.getElementById("jettison-dropdown").style.display = "none";
			this._x = true;
		}
	},

	click: function () {
		SpaceMiner.General.info.call(glob[i]);
		$('#jettison-select').empty();
		$('#jettison-select').append(glob[i].name + "<span id='jettison-select-arrow'>" + '\u25BC' + "</span>");
		$('#jettison-details').append("<input type='range' id='jettison-quantity' min='0' max='" + glob[i].quantity + "' value=0 oninput='outputUpdate(value)'>");
		$('#jettison-details').append("<output for='jettison-quantity' id='jettison-indicator'>0</output>");
		$('#jettison-details').append("<button type='button' id='jettison-confirm' onclick='jettison(" + i + ")'>Jettison!</button>");
	},

	outputUpdate: function (vol) {
		document.querySelector('#jettison-indicator').value = vol;
	},

	jettison: function (i) {
		$('#jettison-select').empty();
		SpaceMiner.General.changeQuantity([[glob[i].id, -document.querySelector('#jettison-indicator').value]]);
		SpaceMiner.General.info.call(glob[i]);
		$('#jettison-details').empty();
		$('#jettison-select').append("Jettison:<span id='jettison-select-arrow'>" + '\u25BC' + "</span>");
	}
};





