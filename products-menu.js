SpaceMiner.Products = {
	init: function () {
		this.graphicalInit();
	},
	graphicalUpdate: function () {
		if ($('#product-menu').css('display') == 'block') {
			for (var i = 0; i < fabricables.length; i++) {
				var div_name = "div-product-" + fabricables[i].id;

				var costs = "";
				for (var j = 0; j < fabricables[i].cost.length; j++) {
					var color = 'black';
					if (fabricables[i].cost[j][1] > SpaceMiner.General.findObject(fabricables[i].cost[j][0]).quantity) {
						color = 'red';
					}
					costs += "<span style='color:" + color + "'>" + fabricables[i].cost[j][1] + " " + SpaceMiner.General.findObject(fabricables[i].cost[j][0]).name + "</span><br/>";
				}

				$('#' + div_name + '-quantity').text(fabricables[i].quantity);
				$('#' + div_name + '-costs').empty();
				$('#' + div_name + '-costs').append(costs);
			}
		}
	},
	graphicalInit: function () {
		$('#product-menu').remove();
		$('#central-panel').append("<div id='product-menu' class='central-menu'></div>");

		for (var i = 0; i < fabricables.length; i++) {
			this.addToMenu(fabricables[i]);
		}
	},

	addToMenu: function (product) {
		var div_name = "div-product-" + product.id;

		$('#product-menu').append("<div class='list-div' id='" + div_name + "'></div>");

		$('#' + div_name).append("<div id='" + div_name + "-details' style='float:left; position: relative; width:100%; overflow: visible;'>");
		$('#' + div_name + "-details").append("<div id='" + div_name + "-left' style='float:left; position: relative; width:47%'>");
		$('#' + div_name + "-details").append("<div id='" + div_name + "-right' style='float:right; position: relative; width:47%'>");

		$('#' + div_name + '-left').append("<b>" + product.name + "</b><br/>");
		if (product.toggleable) {
			$('#' + div_name + '-left').append("<a href='#' id='" + div_name + "-toggle'>" + (product.active ? "Disable" : "Enable") + "</a><br/><br/>");
		}
		$('#' + div_name + '-left').append("Quantity: <span id='" + div_name + "-quantity'></span><br/>");
		$('#' + div_name + '-left').append("Description: " + product.description + "<br/>");

		$('#' + div_name + '-right').append("<table id='" + div_name + "-right-table'>");

		var costs = "";
		for (var i = 0; i < product.cost.length; i++) {
			costs += product.cost[i][1] + " " + SpaceMiner.General.findObject(product.cost[i][0]).name + "<br/>";
		}
		var produces = "";
		for (var i = 0; i < product.production.length; i++) {
			produces += (product.production[i][1]) + " " + SpaceMiner.General.findObject(product.production[i][0]).name + "<br/>"
		}

		$('#' + div_name + '-right-table').append("<tr><td valign='top'>Build time:</td><td>" + product.build_time / game_state.building.fabricator.build_speed + " s</td></tr>");
		$('#' + div_name + '-right-table').append("<tr><td valign='top'>Cost:</td><td id='" + div_name + "-costs'>" + costs + "</td></tr>");
		if (produces != "") {
			$('#' + div_name + '-right-table').append("<tr><td valign='top'>Produces:</td><td><span style='color:blue'>" + produces + "</span></td></tr>");
		}

		$('#' + div_name).append("<div style='clear:both'><p>-----</p></div>");

		(function (product, div_name) {
			$('#' + div_name + '-toggle').on('click', function () {
				product.active = !product.active;
				$('#' + div_name + '-toggle').text(product.active ? "Disable" : "Enable");
			});
		}(product, div_name));
	}
}
;
