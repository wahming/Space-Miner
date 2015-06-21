function test(test_data) {
	var xave = (test_data.length-1)/2;
	var yave = 0;
	for (i in test_data) {
		yave += test_data[i];
	}
	yave = yave/test_data.length;
	
	var sum1 = 0;
	var sum2 = 0;
	
	for (i in test_data) {
		sum1 += ((i - xave) * (test_data[i] - yave));
		sum2 += ((i - xave) * (i - xave));
	}
	
	return (sum1/sum2);
}


var resource_last_turn = [];
var general_info_target = {};

function general_tick () {
	for (i in furnaces) {
		general_manufacture.call (furnaces[i]);
	}
	for (i in fabricators) {
		general_manufacture.call (fabricators[i]);
	}	
	
	for (i in procons) {
		if (procons[i].active) {
			if (general_change_quantity (procons[i].consumption, -1, tick_length/1000 * procons[i].quantity)) {
				general_change_quantity (procons[i].production, 1, tick_length/1000 * procons[i].quantity);
			}
		}
	}
}

function general_info_target () {
	
}

function general_info () {
	$('#info-table').empty();
		
	$('#info-table').append ("<tr><td>Name: </td><td>" + this.name + "</td></tr>");
	$('#info-table').append ("<tr><td>Quantity: </td><td>" + this.quantity.toFixed(0) + "</td></tr>");
	
	if (this.build_time > 0) {
		$('#info-table').append ("<tr><td>Build time: </td><td>" + this.build_time/game_state.building.fabricator.build_speed + " s</td></tr>");
	}
	
	if (this.cost.length > 0) {
		var costs = "";
		for (var i = 0; i < this.cost.length; i++) {
			if (this.cost[i][1] > general_find_object(this.cost[i][0]).quantity) {
				costs += "<span style='color: red'>";
			}
			
			costs +=  this.cost[i][1].toFixed(0) + " "  + general_find_object(this.cost[i][0]).name + "<br/>"
			
			if (this.cost[i][1] > general_find_object(this.cost[i][0]).quantity) {
				costs += "</span>";
			}
		}
	
		$('#info-table').append ("<tr><td>Cost: </td><td>" + costs + "</td></tr>");
	}
		
	if (this.production.length > 0) {
		var production = "";
		for (var i = 0; i < this.production.length; i++) {
			production +=  (this.production[i][1]) + " "  + general_find_object(this.production[i][0]).name + "<br/>"
		}
		$('#info-table').append ("<tr><td>Production: </td><td>" + production + "</td></tr>");
	}

	if (this.consumption.length > 0) {
		var consumption = "";
		for (var i = 0; i < this.consumption.length; i++) {
			consumption +=  (this.consumption[i][1]) + " "  + general_find_object(this.consumption[i][0]).name + "<br/>"
		}
		$('#info-table').append ("<tr><td>Consumption: </td><td>" + consumption + "</td></tr>");
	}
	
	$('#info-table').append ("<tr><td colspan=2><br/>" + this.flavor_text + "</td></tr>");
}

function general_create (free, quantity) {			// Call on item
	free = free || false;
	quantity = typeof (quantity) === "undefined" ? 1 : quantity;
	
	for (var i = 0; i < quantity; i++) {
		if (this.storage_used <= game_state.resource.storage.quantity) {
			if (!free) {
				if (general_can_afford (this.cost, this.storage_used)){
					general_change_quantity (this.cost, -1);
				} else {return false;}
			}
			
			this.built_count++;
			
			if (this.has_collection) {
				var new_item = $.extend ({}, this);
				new_item.has_collection = false;
				new_item.name = this.name + " #" + this.built_count;
				new_item.uid = this.built_count;
				general_push_to_array.call (new_item);
			}
			
			general_change_capacity (this.storage);
			general_change_quantity ([[this.id, 1]]);
		} else {
			return false;
		}
	}
	return true;
}

function general_push_to_array () {		// Call on item
	if (this.flag.indexOf ("fabricator") > -1) {
		fabricators.push (this);
	}

	if (this.flag.indexOf ("furnace") > -1) {
		furnaces.push (this);
	}	
}

function general_find_object (name) {
	for (var i = 0; i < glob.length; i++) {
		if (glob[i].id == name) {
			return glob[i];
		} 
	}
	if (name == null) {return null;}
	
	console.log ("No such object: " + name + ". Called from: " + arguments.callee.caller.name);
	return null;
}

function general_change_quantity (change, sign, multiplier) {		// 2d array, sign should be -1 or nothing
	storage_needed = 0;
	sign = sign || 1;
	multiplier = typeof (multiplier) === "undefined" ? 1 : multiplier;
	
	for (i in change) {
		storage_needed += change[i][1] * general_find_object (change[i][0]).storage_used * multiplier * sign;
		if (change[i][1] * sign * multiplier + general_find_object (change[i][0]).quantity < 0) {
			return false
		}
	}
	
	if (storage_needed <= game_state.resource.storage.quantity) {
		for (i in change) {
			var obj = general_find_object (change[i][0]);
			obj.quantity += change[i][1] * sign * multiplier;
			
			if (obj.quantity > obj.capacity && obj.capacity >= 0) {
				obj.quantity = obj.capacity
			}
		}
		game_state.resource.storage.quantity -= storage_needed;
		return true;
	}
	return false;
}

function general_change_capacity (change, sign) {							// 2d array
	sign = sign || 1;
	for (i in change) {
		var obj = general_find_object (change[i][0]);
		obj.capacity += change[i][1] * sign;
		obj.quantity = obj.quantity > obj.capacity ? obj.capacity : obj.quantity;
		if (obj.id == "storage") {
			obj.quantity += change[i][1];
		}
	}
}

function general_can_afford (cost, space, multiplier) {	// 2d array, space of the item being created, and obv, multiplier
	multiplier = multiplier || 1;
	space = space || 0;
	
	for (i in cost) {
		if (general_find_object (cost[i][0]).quantity < cost[i][1] * multiplier) {
			return false;
		}
	}
	
	if (game_state.resource.storage.quantity < space * multiplier) {
		return false;
	}
	return true;
}

function general_set_production (product) {
	this.current_product_paid = false;
	product = general_find_object(product);
	this.current_product_progress = 0;
	if (product != null) {
		this.current_product = product.id;
		this.current_product_build_time = product.build_time;
		this.active = true;
	} else {
		this.current_product = null;
	}
}

function general_manufacture () {
	if (!this.active) {
		general_change_quantity (this.consumption, -1, 0.1 * tick_length/1000);
	} else if (general_change_quantity (this.consumption, -1, tick_length/1000)) {
		if (this.current_product != null && this.active) {
			var product = general_find_object (this.current_product);
			if (!this.current_product_paid) {
				this.load = 0;
				for (var j = 0; j < this.max_load; j++) {
					if (general_change_quantity (product.cost, -1)) {
						this.current_product_paid = true;
						this.load++;
					} else if (j == 0) {
						this.status = "Waiting for resources";
						break;
					}
				}
			}
		}
			
		if (this.current_product_paid) {
			this.status = this.noun + " (x" + this.load + ")";
			this.current_product_progress += this.build_speed * tick_length/1000;
			product.generation_speed_array[product.generation_speed_array.length-1] += this.load * this.build_speed / this.current_product_build_time * tick_length/1000;
			if (this.current_product_progress >= this.current_product_build_time) {
				for (var j = 0; j < this.load; j++) {
					if (general_create.call (product, true)) {
						this.load--;
						j--;
						if (this.load == 0) {
							this.current_product_progress = 0;
							this.current_product_paid = false;
							if (!this.loop_production) {
								this.status = "Stopped";
								this.active = false;
							}
						}
					} else {
						this.status = "Out of storage space";
					}
				}
			}
		}
	} else {
		this.active = false;
		this.status = "Production halted due to lack of power.";
	}
}