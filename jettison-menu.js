
var jettison_displayed = false;

function jettison_init () {
	jettison_graphical_init();
}

function jettison_graphical_update() {
	if ($('#jettison-menu').css('display') == 'block' && !jettison_displayed) {
		$('#jettison-dropdown').empty();
		for (var i = 0; i < glob.length; i++) {
			if (glob[i].appear_in_game && glob[i].quantity > 0 && glob[i].jettisonable) {
				$('#jettison-dropdown').append ("<div class='jettison-opt' onclick='jettison_click(" + i + ")' id='opt" + i + 
					"' onmouseenter=\"general_info.call (glob[" + i + "])\">" 
					+ glob[i].name + "</div>");
			}
		}
	}
}

function jettison_graphical_init() {	
	$('#jettison-menu').remove();
	$('#central-panel').append ("<div id='jettison-menu' class='central-menu'></div>");	
	$('#jettison-menu').append ("<div id='jettison-select' onclick='jettison_drop()'>Jettison:<span id='jettison-select-arrow'>" + '\u25BC' + "</span></div>")
	$('#jettison-menu').append ("<div id='jettison-dropdown' onclick='jettison_drop()'></div>");
	$('#jettison-menu').append ("<div id='jettison-details'></div>");
	
	
}

x = true;
function jettison_drop() {
	if (x == true) {
		jettison_displayed = true;
		$('#jettison-details').empty();
		document.getElementById("jettison-dropdown").style.display = "inline-block";
		x = false;
	} else if (x == false) {
		document.getElementById("jettison-dropdown").style.display = "none";
		x = true;
	}
}

function jettison_click (i) {
	general_info.call (glob[i])
	$('#jettison-select').empty();
	$('#jettison-select').append (glob[i].name + "<span id='jettison-select-arrow'>" + '\u25BC' + "</span>");
	$('#jettison-details').append ("<input type='range' id='jettison-quantity' min='0' max='" + glob[i].quantity + "' value=0 oninput='outputUpdate(value)'>");
	$('#jettison-details').append ("<output for='jettison-quantity' id='jettison-indicator'>0</output>");
	$('#jettison-details').append ("<button type='button' id='jettison-confirm' onclick='jettison(" + i + ")'>Jettison!</button>");
}

function outputUpdate(vol) {
	document.querySelector('#jettison-indicator').value = vol;
}

function jettison (i) {
	$('#jettison-select').empty();
	general_change_quantity ([[glob[i].id, -document.querySelector('#jettison-indicator').value]]);
	general_info.call (glob[i]);
	$('#jettison-details').empty();
	$('#jettison-select').append ("Jettison:<span id='jettison-select-arrow'>" + '\u25BC' + "</span>");
}














