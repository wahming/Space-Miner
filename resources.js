function resources_init () {
	for (var i = 0; i < resources.length; i++) {
		resource_last_turn[i] = resources[i].quantity;
	}	
	resources_graphical_init();
}

function resources_graphical_init() {
	$('#resource-table').empty();
	for (var i = 0; i < resources.length; i++) {		
		if (resources[i].appear_in_game) {
			$('#resource-table').append ("<tr><td>" + resources[i].name + ":</td><td id='" + resources[i].id + "-quantity'></td><td id='" + resources[i].id + 
				"-capacity'></td><td id='" + resources[i].id + "-rate'></td></tr>");
		}
	}
}

function resources_graphical_update() {
	for (var i = 0; i < resources.length; i++) {
		if (resources[i].appear_in_game) {
			var quantity = resources[i].quantity;
			var id = resources[i].id;
			
			$('#' + id + '-quantity').text((quantity < 0 ? -1 * quantity : quantity).toFixed(0));		// Remove minus signs, usually show up on zeroes (floating point error)
			
			if (resources[i].capacity <= 0) {
				$('#' + id + '-quantity').append (" " + resources[i].unit);
			} else {
				var storage = "/" + resources[i].capacity + " " + resources[i].unit;
				$('#' + id + '-capacity').empty();
				$('#' + id + '-capacity').append(storage);
			}
			
			$('#' + id + '-rate').empty();
			if (id != "storage") {
				var rate = resources_get_generation_speed.call(resources[i]).toFixed(0);
				if (rate > 0) {rate = "(+" + rate + "/s)";}
				else {rate = "(" + rate + "/s)";}
				
				$('#' + id + '-rate').text(rate);
			}
		}
	}
}

function resources_get_generation_speed () {
	var result;
	var gen_speed = this.generation_speed_array;
	
	var xave = (gen_speed.length-1)/2;
	var yave = 0;
	for (i in gen_speed) {
		yave += gen_speed[i];
	}
	yave = yave/gen_speed.length;
	
	var sum1 = 0;
	var sum2 = 0;
	
	for (i in gen_speed) {
		sum1 += ((i - xave) * (gen_speed[i] - yave));
		sum2 += ((i - xave) * (i - xave));
	}
	
	result = (sum1/sum2) * 1000 / tick_length

	return result;
}
