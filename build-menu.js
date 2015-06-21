
function build_init () {
	build_graphical_init();
}

function build_graphical_init() {
	$('#build-menu').remove();
	$('#central-panel').append("<div id='build-menu' class='central-menu'></div>");
	$('#build-menu').show();
	
	$('#build-menu').append ("<div id='build-current' class='list-div' style='border: 2px solid #8AC007;'></div>");
	$('#build-current').append ("Currently constructing: <span id='build-current-name'>Nothing</span><br/>");
	$('#build-current').append ("Queued: <span id='build-current-queue'>Nothing</span><br/><br/>");
	$('#build-current').append ("<progress id='build-current-progress-bar' class='progress' value=" + construction_progress + " max=0></progress>");
	if (construction_queue.length > 0) {
		build_current_graphical_init();
	}

	for (var i = 0; i < buildings.length; i++) {
		if (buildings[i].appear_in_game) {
			build_add_to_menu.call (buildings[i]);
		}
	}
}

function build_graphical_update () {
	if ($('#build-menu').css('display') == 'block') {
		for (i in buildings) {
			if (buildings[i].appear_in_game) {
				div_name = "div-build-" + buildings[i].id;
				
				if (buildings[i].cost.length > 0) {
					$('#' + div_name + "-cost").empty();
					
					for (j = 0; j < buildings[i].cost.length; j++) {
						var item = general_find_object (buildings[i].cost[j][0]);
						var color = buildings[i].cost[j][1] <= item.quantity ? 'black' : 'red';
						
						if (j > 0) {
							$('#' + div_name + "-cost").append("<br/>");
						}
						
						$('#' + div_name + "-cost").append("<span style='color:" + color + ";'>" + buildings[i].cost[j][1] + " " + item.name + "</span>");
					}
				}
				$('#' + div_name + "-quantity").text(buildings[i].quantity);
			}
		}
	}
}


// Create graphical building list
	// Named sectors in here:
	// (Div) div-build-*id*
	// (Button) *div_name*-build-button
	// (Span) *div_name*-quantity
	// (TD) *div_name*-cost
function build_add_to_menu() {
	div_name = "div-build-" + this.id;
	$('#build-menu').append ("<div id='" + div_name + "' class='list-div'></div>");
	
	$('#' + div_name).append ("<b>" + this.name + "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	$('#' + div_name).append ("<span style='float: right'>Quantity: <span id='" + div_name + "-quantity'>" + this.quantity + "</span></span><br/><br/>");
	$('#' + div_name).append (this.description + "<br/>");
	$('#' + div_name).append ("<div style='width:100%; position: relative;' id='" + div_name + "-body'></div>");
	$('#' + div_name + "-body").append ("<div style='float:left; position: relative; width:47%;' id='" + div_name + "-left'></div>");
	$('#' + div_name + "-left").append ("<table id='" + div_name + "-left-table'></table>");
	$('#' + div_name + "-left-table").append ("<tr><td valign='top'>Produces: </td><td id='" + div_name + "-production'></td></tr>");
	$('#' + div_name + "-left-table").append ("<tr><td valign='top'>Consumes: </td><td id='" + div_name + "-consumption'></td></tr>");
	
	var produces = "";
	var consumes = "";
	
	if (this.production.length > 0) {
		for (i in this.production) {
			if (i > 0) {
				produces += "<br/>";
			}
			produces += this.production[i][1] + " " + general_find_object (this.production[i][0]).name;
		}
	} else {produces += "-";}
	
	if (this.consumption.length > 0) {
		for (i in this.consumption) {
			if (i > 0) {
				consumes += "<br/>";
			}
			consumes += this.consumption[i][1] + " " + general_find_object (this.consumption[i][0]).name;
		}
	} else {consumes += "-";}
	
	$('#' + div_name + "-production").append (produces);
	$('#' + div_name + "-consumption").append (consumes);
	
	
	$('#' + div_name + "-body").append ("<div style='float: right; position: relative; width:47%' id='" + div_name + "-right'>");
	$('#' + div_name + "-right").append ("<table id='" + div_name + "-right-table'></table>");
	$('#' + div_name + "-right-table").append ("<tr><td valign='top'>Cost: </td><td id='" + div_name + "-cost'></td></tr>");
	$('#' + div_name + "-right-table").append ("<tr><td valign='top'>Storage: </td><td id='" + div_name + "-storage'></td></tr>");
	
	var cost = "";
	var storage = "";
	if (this.cost.length > 0) {
		for (i in this.cost) {
			if (i > 0) {
				cost += "<br/>";
			}
			cost += (this.cost[i][1]) + " " + general_find_object (this.cost[i][0]).name;
		}
	} else {cost += "-";}
	
	if (this.storage.length > 0) {
		for (i in this.storage) {
			if (i > 0) {
				storage += "<br/>";
			}
			storage += this.storage[i][1] + " " + general_find_object (this.storage[i][0]).name;
		}
	} else {storage += "-";}
	
	$('#' + div_name + "-cost").append (cost);
	$('#' + div_name + "-storage").append (storage);	
	$('#' + div_name).append("<div style='clear:both' id='" + div_name + "-button-div'></div>");

	if (this.buildable) {
		$('#' + div_name + '-button-div').append ("<button id='" + div_name + "-build-button'>Build " + this.name + "</button>");

		// Add button listener
		(function(item) {
			$('#' + div_name + "-build-button").on ('click', function () {
				build_set_construction.call (item);
			});
		}(this));

		$('#' + div_name).append ("<p>-----</p>");
	}
}

function build_current_graphical_init () {
	document.getElementById ("build-current-progress-bar").value = construction_progress;

	if (construction_queue.length > 0) {
		$("#build-current-name").text (construction_queue[0].name);
		document.getElementById ("build-current-progress-bar").max = construction_queue[0].build_time;
		$ ("#build-current-queue").empty();
		for (var i = 1; i < construction_queue.length; i++) {
			$ ("#build-current-queue").append (construction_queue[i].name + "<br/>");
		}
	} else {
		$ ("#build-current-name").text ("Nothing");
		$ ("#build-current-queue").text ("Nothing");
	}
}

function build_set_construction () {
	if (general_can_afford (this.cost)){
		general_change_quantity (this.cost, -1);
		construction_queue.push (this);
		build_current_graphical_init ();
	}
}

function build_tick () {
    if (construction_queue.length > 0) {
		construction_progress += game_state.product.construction_bot.build_speed * game_state.product.construction_bot.quantity * tick_length/1000;
		document.getElementById ("build-current-progress-bar").value = construction_progress;
		if (construction_progress > construction_queue[0].build_time) {
			general_create.call (construction_queue[0], true);
			construction_queue.splice (0, 1);
			construction_progress = 0;
			build_current_graphical_init();
		}
    }
}