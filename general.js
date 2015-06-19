var resource_last_turn = [];
var general_info_target = {};

SpaceMiner.General = {
	tick: function () {
		for (i in procons) {
			if (procons[i].active) {
				if (this.changeQuantity(procons[i].consumption, -1, tick_length / 1000 * procons[i].quantity)) {
					this.changeQuantity(procons[i].production, 1, tick_length / 1000 * procons[i].quantity);
				}
			}
		}

		for (i in furnaces) {
			this.manufacture.call(furnaces[i]);
		}
		for (i in fabricators) {
			this.manufacture.call(fabricators[i]);
		}
	},

	info: function () {
		var $info = $('#info-table');
		$info.empty();

		$info.append("<tr><td>Name: </td><td>" + this.name + "</td></tr>");
		$info.append("<tr><td>Quantity: </td><td>" + this.quantity.toFixed(0) + "</td></tr>");

		if (this.build_time > 0) {
			$info.append("<tr><td>Build time: </td><td>" + this.build_time / gameState.building.fabricator.build_speed + " s</td></tr>");
		}

		if (this.cost.length > 0) {
			var costs = "";
			for (var i = 0; i < this.cost.length; i++) {
				if (this.cost[i][1] > this.findObject(this.cost[i][0]).quantity) {
					costs += "<span style='color: red'>";
				}

				costs += this.cost[i][1].toFixed(0) + " " + this.findObject(this.cost[i][0]).name + "<br/>";

				if (this.cost[i][1] > this.findObject(this.cost[i][0]).quantity) {
					costs += "</span>";
				}
			}

			$info.append("<tr><td>Cost: </td><td>" + costs + "</td></tr>");
		}

		if (this.production.length > 0) {
			var production = "";
			for (var i = 0; i < this.production.length; i++) {
				production += (this.production[i][1]) + " " + this.findObject(this.production[i][0]).name + "<br/>"
			}
			$info.append("<tr><td>Production: </td><td>" + production + "</td></tr>");
		}

		if (this.consumption.length > 0) {
			var consumption = "";
			for (var i = 0; i < this.consumption.length; i++) {
				consumption += (this.consumption[i][1]) + " " + this.findObject(this.consumption[i][0]).name + "<br/>"
			}
			$info.append("<tr><td>Consumption: </td><td>" + consumption + "</td></tr>");
		}

		$info.append("<tr><td colspan=2><br/>" + this.flavor_text + "</td></tr>");
	},

	/**
	 *
	 * @param free
	 * @param quantity
	 * @returns {boolean}
	 */
	create: function (free, quantity) {
		free = free || false;
		quantity = typeof (quantity) === "undefined" ? 1 : quantity;

		for (var i = 0; i < quantity; i++) {
			if (this.storage_used <= gameState.resource.storage.quantity) {
				if (!free) {
					if (this.canAfford(this.cost, this.storage_used)) {
						this.changeQuantity(this.cost, -1);
					} else {
						return false;
					}
				}

				this.built_count++;

				if (this.has_collection) {
					var new_item = $.extend({}, this);
					new_item.has_collection = false;
					new_item.name = this.name + " #" + this.built_count;
					new_item.uid = this.built_count;
					SpaceMiner.General.pushToArray.call(new_item);
				}
				SpaceMiner.General.changeCapacity(this.storage);
				SpaceMiner.General.changeQuantity([[this.id, 1]]);
			}
		}
		return true;
	},

	pushToArray: function () {
		if (this.flag.indexOf("fabricator") > -1) {
			fabricators.push(this);
		}

		if (this.flag.indexOf("furnace") > -1) {
			furnaces.push(this);
		}
	},

	/**
	 *
	 * @param name
	 * @returns {*}
	 */
	findObject: function (name) {
		for (var i = 0; i < glob.length; i++) {
			if (glob[i].id === name) {
				return glob[i];
			}
		}
		if (name === null) {
			return null;
		}

		console.log("No such object: " + name + ". Called from: " + arguments.callee.caller.name);
		return null;
	},

	/**
	 *
	 * @param change
	 * @param sign
	 * @param multiplayer
	 * @returns {boolean}
	 */
	changeQuantity: function (change, sign, multiplayer) {// 2d array, sign should be -1 or nothing
		storage_needed = 0;
		sign = sign || 1;
		multiplier = typeof (multiplier) === "undefined" ? 1 : multiplier;

		for (i in change) {
			storage_needed += change[i][1] * this.findObject(change[i][0]).storage_used * multiplier * sign;
			if (change[i][1] * sign * multiplier + this.findObject(change[i][0]).quantity < 0) {
				return false
			}
		}

		if (storage_needed <= gameState.resource.storage.quantity) {
			for (i in change) {
				var obj = this.findObject(change[i][0]);
				obj.quantity += change[i][1] * sign * multiplier;

				if (obj.quantity > obj.capacity && obj.capacity >= 0) {
					obj.quantity = obj.capacity
				}
			}
			gameState.resource.storage.quantity -= storage_needed;
			return true;
		}
		return false;
	},
	/**
	 *
	 * @param change
	 * @param sign
	 */
	changeCapacity: function (change, sign) {
		sign = sign || 1;
		for (i in change) {
			var obj = this.findObject(change[i][0]);
			obj.capacity += change[i][1] * sign;
			obj.quantity = obj.quantity > obj.capacity ? obj.capacity : obj.quantity;
			if (obj.id == "storage") {
				obj.quantity += change[i][1];
			}
		}
	},
	/**
	 *
	 * @param cost
	 * @param space
	 * @param multiplayer
	 * @returns {boolean}
	 */
	canAfford: function (cost, space, multiplayer) {
		multiplier = multiplier || 1;
		space = space || 0;

		for (i in cost) {
			if (this.findObject(cost[i][0]).quantity < cost[i][1] * multiplier) {
				return false;
			}
		}

		if (gameState.resource.storage.quantity < space * multiplier) {
			return false;
		}
		return true;
	},
	/**
	 *
	 * @param product
	 */
	setProduction: function (product) {
		this.current_product_paid = false;
		product = this.findObject(product);
		this.current_product_progress = 0;
		if (product !== null) {
			this.current_product = product.id;
			this.current_product_build_time = product.build_time;
			this.active = true;
		} else {
			this.current_product = null;
		}
	},

	manufacture: function () {
		if (!this.active) {
			SpaceMiner.General.changeQuantity(this.consumption, -1, 0.1 * tick_length / 1000);
		} else if (this.changeMonth(this.consumption, -1, tick_length / 1000)) {
			if (this.current_product !== null && this.active) {
				var product = this.findObject(this.current_product);
				if (!this.current_product_paid) {
					this.load = 0;
					for (var j = 0; j < this.max_load; j++) {
						if (this.changeQuantity(product.cost, -1)) {
							this.current_product_paid = true;
							this.load++;
						} else if (j === 0) {
							this.status = "Waiting for resources";
							break;
						}
					}
				}
			}

			if (this.current_product_paid) {
				this.status = this.noun + " (x" + this.load + ")";
				this.current_product_progress += this.build_speed * tick_length / 1000;
				product.generation_speed_array[resource_generation_index] += this.load * this.build_speed / this.current_product_build_time * tick_length / 1000;
				if (this.current_product_progress >= this.current_product_build_time) {
					for (var j = 0; j < this.load; j++) {
						if (this.create.call(product, true)) {
							this.load--;
							j--;
							if (this.load === 0) {
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
};
