var manufacturer_type = "";
var manufacturer = [];
var div_name = "";
var noun = "";

SpaceMiner.Manufacturer = {
	init: function () {
		this.graphicalInit();
	},
	graphicalUpdate: function () {
		if ($('#manufacturer-menu').css('display') === 'block') {
			for (var j = 0; j < manufacturer.length; j++) {
				var man = manufacturer[j];
				var div_name1 = div_name + man.uid;

				document.getElementById(div_name1 + "-progress").value = man.current_product_progress;
				document.getElementById(div_name1 + "-progress").max = man.current_product_build_time;
				$('#' + div_name1 + "-status").text(man.status);
				if (man.active === false && man.current_product !== null) {
					$('#' + div_name1 + "-resume").show();
				}
				$('#' + div_name1 + "-quantity").text(man.current_product === null ? "-" : SpaceMiner.General.findObject(man.current_product).quantity.toFixed(0));
			}
		}
	},
	graphicalInit: function (type) {
		manufacturer_type = type;
		var $manufacturer = $('#manufacturer-menu');
		$manufacturer.remove();
		$manufacturer.empty();
		$('#central-panel').append("<div id='manufacturer-menu' class='central-menu'></div>");

		if (manufacturer_type === "furnace") {
			manufacturer = furnaces;
			div_name = "div-furnace-";
			noun = "smelting";
		} else if (manufacturer_type === "fabricator") {
			manufacturer = fabricators;
			div_name = "div-fabricator-";
			noun = "fabricating";
		}

		for (var j = 0; j < manufacturer.length; j++) {
			this.addToMenu(manufacturer[j]);
		}
	},
	getDropdown: function (divName, man) {
		var selected = man.current_product === null ? null : SpaceMiner.General.findObject(man.current_product).id;
		var result = "<select id='" + div_name + "-dropdown' size=8>";
		var product = [];

		if (manufacturer_type === 'furnace') {
			for (var i = 0; i < resources.length; i++) {
				if (resources[i].smelted) {
					product.push(resources[i]);
				}
			}
		} else if (manufacturer_type === 'fabricator') {
			for (var i = 0; i < fabricables.length; i++) {
				if (fabricables[i].fabricable) {
					product.push(fabricables[i]);
				}
			}
		}

		if (selected === null) {
			result += "<option value='None' selected>Nothing</option>";
		} else {
			result += "<option value='None'>Nothing</option>";
		}

		for (var i = 0; i < product.length; i++) {
			if (product[i].id === selected) {
				result += "<option id='" + div_name + "-option-" + i + "' value='" + product[i].id + "' selected>" + product[i].name + "</option>";
			} else {
				result += "<option id='" + div_name + "-option-" + i + "' value='" + product[i].id + "'>" + product[i].name + "</option>";
			}

			$(document).on('mouseenter', "#" + div_name + "-option-" + i, function (e) {
				SpaceMiner.General.info.call(SpaceMiner.General.findObject(e.currentTarget.value));
			});

			$(document).on('mouseleave', "#" + div_name + "-option-" + i, function (e) {
				//$('#info-table').empty();
			});
		}

		result += "</select>";

		return result;
	},

	addToMenu: function (man) {
		var div_name1 = div_name + man.uid;

		$('#manufacturer-menu').append("<div class='list-div' id='" + div_name1 + "'></div>");
		$('#' + div_name1).append("<b>" + man.name + "</b><br/><br/>");

		$('#' + div_name1).append("<table style='float:left;'><tr><td style='padding:0px; vertical-align:middle'>Currently " + noun + ": <br/></td><td style='padding:0px;'  id='" + div_name1 + "-product'></td></tr></table>");
		$('#' + div_name1).append("<span style='float: right'>Quantity: <span id='" + div_name1 + "-quantity'>-</span></span><br/>");
		$('#' + div_name1).append("<span style='float: right'><input id='" + div_name1 + "-checkbox' type='checkbox'>Loop production</span>");
		$('#' + div_name1 + '-checkbox').prop('checked', man.loop_production);
		$('#' + div_name1).append("<div id='" + div_name1 + "-buttons' style='clear:left'></div>");
		if (man.max_load > 1) {
			$('#' + div_name1 + '-buttons').append("Capacity: " + man.max_load + "<br/>");
		}
		$('#' + div_name1 + '-buttons').append("<a href='#' id='" + div_name1 + "-change-product'>(Change product)</a>");
		$('#' + div_name1 + '-buttons').append("<a href='#' id='" + div_name1 + "-confirm' title='test'>(Confirm)</a>");
		$('#' + div_name1 + '-buttons').append("<a href='#' id='" + div_name1 + "-cancel'>(Cancel)</a>");


		$('#' + div_name1).append("<br/>");
		$('#' + div_name1).append("Status: <span id='" + div_name1 + "-status'></span>&nbsp;<span id='" + div_name1 + "-resume'><a href='#'>(Resume)</a></span><br/>");
		$('#' + div_name1).append("<progress id='" + div_name1 + "-progress' class='progress' value=0 max_value=" + man.current_product_build_time + "></progress>");
		$('#' + div_name1).append("<p>-----</p>");


		$('#' + div_name1 + "-confirm").hide();
		$('#' + div_name1 + "-cancel").hide();
		$('#' + div_name1 + "-resume").hide();
		$('#' + div_name1 + "-product").text(man.current_product === null ? "Nothing" : SpaceMiner.General.findObject(man.current_product).name);


		// Add button listener
		(function (man, div_name1) {
			$('#' + div_name1 + '-checkbox').click(function () {
				var $this = $(this);
				man.loop_production = $this.is(':checked');
			});
		}(man, div_name1));

		(function (man, div_name1) {
			$('#' + div_name1 + '-change-product').on('click', function () {
				$('#' + div_name1 + "-product").empty();
				$('#' + div_name1 + "-product").append(this.getDropdown(div_name1, man));
				$('#' + div_name1 + '-change-product').hide();
				$('#' + div_name1 + '-confirm').show();
				$('#' + div_name1 + '-cancel').show();
				if (!man.current_product_paid) {
					man.status = "Stopped";
					man.active = false;
				}
			});
		}(man, div_name1));

		(function (man, div_name1) {
			$('#' + div_name1 + '-confirm').on('click', function () {
				var selected = $('#' + div_name1 + "-dropdown").val();
				if (man.current_product !== selected) {
					if (selected !== 'None') {
						SpaceMiner.General.setProduction.call(man, selected);
						document.getElementById(div_name1 + "-progress").max = man.current_product_build_time;
					} else {
						SpaceMiner.General.setProduction.call(man, null);
						document.getElementById(div_name1 + "-progress").max = 0;
					}
				} else if (selected !== 'None') {
					man.active = true;
				}

				$('#' + div_name1 + "-product").text(man.current_product === null ? "Nothing" : SpaceMiner.General.findObject(man.current_product).name);
				$('#' + div_name1 + '-confirm').hide();
				$('#' + div_name1 + '-cancel').hide();
				$('#' + div_name1 + "-dropdown").remove();
				$('#' + div_name1 + '-change-product').show();
				$('#' + div_name1 + "-resume").hide();
			});
		}(man, div_name1));

		(function (div_name1) {
			$('#' + div_name1 + '-cancel').on('click', function () {
				$('#' + div_name1 + "-product").text(man.current_product === null ? "Nothing" : SpaceMiner.General.findObject(man.current_product).name);
				$('#' + div_name1 + '-confirm').hide();
				$('#' + div_name1 + '-cancel').hide();
				$('#' + div_name1 + "-dropdown").remove();
				$('#' + div_name1 + '-change-product').show();
			});
		}(div_name1));

		(function (man, div_name1) {
			$('#' + div_name1 + '-resume').on('click', function () {
				$('#' + div_name1 + "-resume").hide();
				man.active = true;
			});
		}(man, div_name1));
	}
};
