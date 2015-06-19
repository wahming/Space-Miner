SpaceMiner.Resources = {
	init: function () {
		resource_generation_index = 0;
		for (var i = 0; i < resources.length; i++) {
			resources[i].generation_speed_array.length = 0;
			resource_last_turn[i] = resources[i].quantity;
		}
		this.graphicalInit();
	},

	graphicalInit: function () {
		$('#resource-table').empty();
		for (var i = 0; i < resources.length; i++) {
			if (resources[i].appear_in_game) {
				$('#resource-table').append("<tr><td>" + resources[i].name + ":</td><td id='" + resources[i].id + "-quantity'></td><td id='" + resources[i].id +
					"-capacity'></td><td id='" + resources[i].id + "-rate'></td></tr>");
			}
		}
	},

	graphicalUpdate: function () {
		for (var i = 0; i < resources.length; i++) {
			if (resources[i].appear_in_game) {
				var quantity = resources[i].quantity;
				var id = resources[i].id;

				$('#' + id + '-quantity').text((quantity < 0 ? -1 * quantity : quantity).toFixed(0));		// Remove minus signs, usually show up on zeroes (floating point error)

				if (resources[i].capacity <= 0) {
					$('#' + id + '-quantity').append(" " + resources[i].unit);
				} else {
					var storage = "/" + resources[i].capacity + " " + resources[i].unit;
					$('#' + id + '-capacity').empty();
					$('#' + id + '-capacity').append(storage);
				}

				$('#' + id + '-rate').empty();
				if (id != "storage") {
					var rate = this.getGenerationSpeed.call(resources[i]).toFixed(0);
					if (rate > 0) {
						rate = "(+" + rate + "/s)";
					}
					else {
						rate = "(" + rate + "/s)";
					}

					$('#' + id + '-rate').text(rate);
				}
			}
		}
	},

	getGenerationSpeed: function () {
		var result = 0;
		var gen_speed = this.generation_speed_array;

		if (gen_speed.length === 0) {
			return 0;
		}
		for (var i = 0; i < gen_speed.length; i++) {
			result += gen_speed[i];
		}

		return result === 0 ? 0 : result / gen_speed.length;
	}
};
