
function affordable (cost, multiplier) {
	for (var i = 0; i < cost.length; i++) {
		if (cost[i][0].quantity < cost[i][1] * multiplier) {
			return false;
		}
	}
	return true;
}


{	
	var game_object = {};
	
	// Generic game_object methods
	game_object.create = function () {
		if (this.have_ingredients() && this.buildable){// && has_ingredients) {
			this.consume_ingredients();
			this.create_free();
		}
	};
	
	game_object.fabricate = function () {
		if (this.fabricable) {
			if (storage.quantity >= this.storage_used){
				this.create_free();
				return true;
			}
		} else {
			alert ("Error! Attempt to fabricate non-fabricable item");
		}
		return false;
	};
	
	// Should never be called from anywhere else
	game_object.create_free = function () {
		this.quantity++;
		this.built_count++;

		
		for (var i = 0; i < this.storage.length; i++) {
			this.storage[i][0].change_capacity (this.storage[i][1]);
		}
		
		storage.change_quantity (this.storage_used * -1, true);
	};
	
	game_object.init_values = function () {
		this.quantity = 0;
		this.description = "If you're seeing this; there's a bug. Please report.";
		this.name = "Game object root class";
		this.id = "game_object";					// No spaces, or weird html breaking symbols
		this.flags = [];
		this.production = [];
		this.cost = [];							// Cost to build/fabricate/whatever
		this.consumption = [];
		this.storage = [];
		this.start_quantity = 0;
		this.storage_used = 0;
		this.buildable = false;					// Should it show up in build menu
		this.collection = [];					// Array of instances of this object
		this.fabricable = false;					// Built in fabricator?
		this.toggleable = false;					// Can you enable/disable?
		this.build_point_cost = 0;				// How long/difficult it is to build
		this.built_count = 0;					// Total built since game start
		this.max_load = 1;						// Used for furnaces only, at the moment
		this.current_load = 0;					// How much of capacity is being utilised. E.g. 4 load / 10 capacity
		this.active = false;					// Is it working? 
		this.visible = true;					// Invisible items should never show up as unique/changeable items.
	};
	
	game_object.init = function () {
		var result = this.init_values ();
		if (result !== null) {
			for (var i = 0; i < result.start_quantity; i++) {
				result.create_free ();
			}
			return result;
		}
	};
	game_object.init();
	
	game_object.tick = function () {
		for (var i = 0; i < this.quantity; i++) {
			if (this.can_maintain() && this.active) {
				for (var j = 0; j < this.consumption.length; j++) {
					this.consumption[j][0].change_quantity (this.consumption[j][1] * tick_length/1000 * -1);
					this.consumption[j][0].gen_speed[resource_generation_index] -= this.consumption[j][1];
				}
				
				for (var j = 0; j < this.production.length; j++) {
					this.production[j][0].change_quantity (this.production[j][1] * tick_length/1000);
					this.production[j][0].gen_speed[resource_generation_index] += this.production[j][1];
				}
			}
		}
	};
	
	game_object.consume_ingredients = function () {
		var cost = this.cost;
		for (var i = 0; i < cost.length; i++) {
			cost[i][0].change_quantity (-1 * cost[i][1]);
		}
	};
	
	game_object.have_ingredients = function () {
		return affordable (this.cost, 1);
	};
	
	game_object.can_maintain = function () {
		return affordable (this.consumption, tick_length/1000);
	};
	
	game_object.change_quantity = function (quantity) {
		if (storage.change_quantity (this.storage_used * quantity * -1)) {
			this.quantity += quantity;
			return true;
		} 
		return false;
	};
	
	game_object.change_capacity = function (quantity) {
		this.capacity += quantity;
	};
	
	game_object.info = function () {
		$('#info-table').empty();
		
		$('#info-table').append ("<tr><td>Name: </td><td>" + this.name + "</td></tr>");
		$('#info-table').append ("<tr><td>Quantity: </td><td>" + this.quantity.toFixed(0) + "</td></tr>");
		
		if (this.build_point_cost > 0) {
			$('#info-table').append ("<tr><td>Build time: </td><td>" + this.build_point_cost/fabricator.build_speed + " s</td></tr>");
		}
		
		if (this.production.length > 0) {
			var costs = "";
			for (var i = 0; i < this.cost.length; i++) {
				if (this.cost[i][1] > this.cost[i][0].quantity) {
					costs += "<span style='color: red'>";
				}

				costs += this.cost[i][1].toFixed(0) + " " + this.cost[i][0].name + "<br/>";
				
				if (this.cost[i][1] > this.cost[i][0].quantity) {
					costs += "</span>";
				}
			}
		
			$('#info-table').append ("<tr><td>Cost: </td><td>" + costs + "</td></tr>");
		}
			
		if (this.production.length > 0) {
			var production = "";
			for (var i = 0; i < this.production.length; i++) {
				production +=  (this.production[i][1]) + " "  + this.production[i][0].name + "<br/>"
			}
			$('#info-table').append ("<tr><td>Production: </td><td>" + production + "</td></tr>");
		}
	
		if (this.consumption.length > 0) {
			var consumption = "";
			for (var i = 0; i < this.consumption.length; i++) {
				consumption +=  (this.consumption[i][1]) + " "  + this.consumption[i][0].name + "<br/>"
			}
			$('#info-table').append ("<tr><td>Consumption: </td><td>" + consumption + "</td></tr>");
		}
	}
}
/*
if (debug) {
	
	var tester = $.extend (tester, Object.create(game_object));
	glob.push (tester);
	{
		tester.description = "For debugging use";
		tester.name = "Debug test object";
		tester.id = "debugger-object";
		tester.buildable = true;
		tester.production = [["iron_ore", 1000]];
	}
}*/

// Resources
{

	// Template for all resources
	{
		var resource = $.extend (true, resource, game_object);
		
		resource.init_values = function () {
			game_object.init_values.call (this);
			this.flags = ["resource"];
			this.unit = "kg";			// Noun
			this.smeltable = false;		// (?) Indicate whether player has the ability to smelt the ore yet
			this.gen_speed = [];		// Stores info in array on how many resources generated per tick over the past second
			this.storage_used = 1;
			this.capacity = 0;
			this.build_point_cost = 300;
			
			return resource;
		};
		
		resource.init();
		resource.tick = function () {
		};
		resource.create = function () {
		};
		
		resource.generation_speed = function () {
			var total = 0;
			for (var i = 0; i < this.gen_speed.length; i++) {
				total += this.gen_speed[i];
			}
			return total / this.gen_speed.length;
		};
		
		resource.smelt = function () {		
			if (this.smeltable) {
				if (storage.quantity >= this.storage_used){
					this.create_free();
					return true;
				}
			} else {
				alert ("Error! Attempt to smelt non-smeltable item");
			}
			return false;
		}
	}
	
	var storage = $.extend (storage, resource);
	glob.push (storage);
	storage.init_values = function () {
		resource.init_values.call (storage);
		storage.name = "Storage";
		storage.id = "storage";
		storage.description = "Storage space. We never quite have enough of it";
		storage.active = true;
		storage.visible = false;
		storage.gen_speed = [];
		storage.unit = "m<sup>3</sup>";
		
		resources.push (storage);
		
		storage.change_quantity = function (quantity, force) {
			force = force === 'undefined' ? false : force;
			if (this.quantity + quantity > 0 || force) {
				this.quantity += quantity;
				return true;
			}
			return false;
		};
	
		storage.change_capacity = function (quantity) {
			this.capacity += quantity;
			this.quantity += quantity;
		};
		return storage;
	};
			


	var copper_ore = $.extend (copper_ore, resource);
	glob.push (copper_ore);
	copper_ore.init_values = function () {
		resource.init_values.call (copper_ore);
		copper_ore.name = "Copper ore";
		copper_ore.id = "copper_ore";
		copper_ore.description = "Smelt in a furnace to produce copper";
		copper_ore.active = true;
		copper_ore.gen_speed = [];
		
		resources.push (copper_ore);
		ores.push (copper_ore);
		return copper_ore;
	};
	
	var copper = $.extend (copper, resource);
	glob.push (copper);
	copper.init_values = function () {
		resource.init_values.call (copper);
		copper.name = "Copper";
		copper.id = "copper";
		copper.description = "A malleable reddish-brown metal, widely used as a conductor";
		copper.cost = [[copper_ore, 3]];
		copper.active = true;
		copper.smeltable = true;
		copper.gen_speed = [];
		
		resources.push (copper);
		return copper;
	};
	
	var iron_ore = $.extend (iron_ore, resource);
	glob.push (iron_ore);
	iron_ore.init_values = function () {
		resource.init_values.call (iron_ore);
		iron_ore.name = "Iron ore";
		iron_ore.id = "iron_ore";
		iron_ore.description = "Smelt in a furnace to produce iron";
		iron_ore.active = true;
		iron_ore.gen_speed = [];
		
		ores.push (iron_ore);
		resources.push (iron_ore);
		return iron_ore;
	};
	
	var iron = $.extend (iron, resource);
	glob.push (iron);
	iron.init_values = function () {
		resource.init_values.call (iron);
		iron.name = "Iron";
		iron.id = "iron";
		iron.description = "The basic building material of the modern age";
		iron.cost = [[iron_ore, 3]];
		iron.start_quantity = 100;
		iron.active = true;
		iron.smeltable = true;
		iron.gen_speed = [];
		
		resources.push (iron);
		return iron;
	};
	
	var energy = $.extend (energy, resource);
	glob.push (energy);
	energy.init_values = function () {
		resource.init_values.call (energy);
		energy.name = "Energy";
		energy.id = "energy";
		energy.unit = "MJ";
		energy.description = "I have the power!";
		energy.start_quantity = 1000;
		energy.capacity = 1000;
		energy.storage_used = 0;
		energy.active = true;
		energy.visible = false;
		energy.gen_speed = [];
		
		resources.push (energy);
		return energy;
	}
	
}

// Basic objects
{
	var chassis = $.extend (chassis, game_object);
	glob.push (chassis);
	chassis.init_values = function () {
		game_object.init_values.call (chassis);
		chassis.name = "Chassis";
		chassis.id = "chassis";
		chassis.description = "Multipurpose robot body";
		chassis.cost = [[iron, 50]];
		chassis.storage_used = 1;
		chassis.fabricable = true;
		chassis.build_point_cost = 1000;
		
		fabricables.push (chassis);
		return chassis;
	};
	
	var solar_panel = $.extend (solar_panel, game_object);
	glob.push (solar_panel);
	solar_panel.init_values = function () {
		game_object.init_values.call (solar_panel);
		solar_panel.name = "Solar panel";
		solar_panel.id = "solar_panel";
		solar_panel.description = "Solar panel for power generation";
		solar_panel.cost = [[iron, 50]];
		solar_panel.storage_used = 1;
		solar_panel.fabricable = true;
		solar_panel.build_point_cost = 1000;
		
		fabricables.push (solar_panel);
		return solar_panel;
	};

	var circuit_board = $.extend (circuit_board, game_object);
	glob.push (circuit_board);
	circuit_board.init_values = function () {
		game_object.init_values.call (circuit_board);
		circuit_board.name = "Circuit board";
		circuit_board.id = "circuit_board";	
		circuit_board.description = "Basic logic circuit board";
		circuit_board.cost = [[iron, 1], [copper, 1]];
		circuit_board.storage_used = 0.1;
		circuit_board.fabricable = true;
		circuit_board.build_point_cost = 500;
		
		fabricables.push (circuit_board);
		return circuit_board;
	};
	
	var miner = $.extend (miner, game_object);
	glob.push (miner);
	miner.init_values = function () {
		game_object.init_values.call (miner);
		miner.name = "Miner";
		miner.id = "miner";
		miner.description = "A small mining robot that goes from asteroid to asteroid and mines them for precious ores";
		miner.fabricable = true;
		miner.active = true;
		miner.toggleable = true;
		miner.cost = [[chassis, 1], [solar_panel, 1], [circuit_board, 3]];
		miner.production = [[iron_ore, 1], [copper_ore, 1]];
		miner.start_quantity = 2;
		miner.build_point_cost = 500;
		
		fabricables.push(miner);
		return miner;
	};

	var warehouse = $.extend (warehouse, game_object);
	glob.push (warehouse);
	warehouse.init_values = function () {
		game_object.init_values.call (warehouse);
		warehouse.name = "Warehouse";
		warehouse.id = "warehouse";
		warehouse.description = "Warehouse for storing goods";
		warehouse.buildable = true;
		warehouse.storage = [[storage, 10000]];
		warehouse.cost = [[iron, 500]];
		
		return warehouse;
	};

	var cargo_hold = $.extend (cargo_hold, game_object);
	glob.push (cargo_hold);
	cargo_hold.init_values = function () {
		game_object.init_values.call (cargo_hold);
		cargo_hold.name = "Cargo Hold";
		cargo_hold.id = "cargo_hold";
		cargo_hold.description = "Cargo_hold for storing goods";
		cargo_hold.storage = [[storage, 1000]];
		cargo_hold.start_quantity = 1;
		cargo_hold.visible = false;
		
		return cargo_hold;
	};
	/*
	var solar_array = $.extend (solar_array, game_object);
	glob.push (solar_array);
	solar_array.init_values = function () {
		game_object.init_values.call (solar_array);
		solar_array.name = "Solar array";
		solar_array.id = "solar_array";
		solar_array.description = "Array of solar panels to power small facilities";
		solar_array.cost = [[solar_panel, 4], [copper, 50], [circuit_board,5]];
		solar_array.buildable = true;
		
		return solar_array;
	}*/
}



// Fabricator
{
	var fabricator = $.extend (fabricator, game_object);
	glob.push (fabricator);
	fabricator.init_values = function () {
		game_object.init_values.call (fabricator);
		fabricator.name = "Fabricator";
		fabricator.id = "fabricator";						// No spaces, or weird html breaking symbols
		fabricator.description = "Automated mini-factory to create finished goods from raw materials";
		fabricator.cost = [[solar_panel, 1], [circuit_board, 10], [iron, 100], [copper,5]];
		fabricator.consumption = [];
		fabricator.storage = [];
		fabricator.start_quantity = 1;
		fabricator.buildable = true;
		fabricator.build_speed = 100;
		
		fabricator_types.push (fabricator);
		return fabricator;
	};

	fabricator.create_free = function () {
		// Generic method code.
		this.quantity++;
		this.built_count++;

		for (var i = 0; i < this.storage.length; i++) {
			this.storage[i][0].capacity += this.storage[i][1];
		}
		
		storage.change_quantity (this.storage_used);
		
		// Class specific
		var fab_instance = Object.create(this);
		fab_instance.uid = this.id + "-" + (this.collection.length+1);
		fab_instance.name += " #" + this.built_count;
		fab_instance.current_product = null;					// What it's currently producing. Just a string of the name
		fab_instance.current_product_progress = 0;				// Function of build_speed and ticks
		fab_instance.current_product_build_cost = 0; 			// How much time/effort the product takes
		fab_instance.current_product_paid = false;				// Has the product cost been paid?
		fab_instance.loop_production = false;
		fab_instance.status = "Stopped";
		fab_instance.active = true;								// Is it active? Note: Can be active and current_product == null. Expected behaviour.
		
		this.collection.push (fab_instance);
		add_to_fabricator_list (fab_instance);
	};
		
	fabricator.produce = function (product) {
		this.current_product_paid = false;
		this.current_product = find_object(product);
		this.current_product_progress = 0;
		this.active = true;
		if (product !== null) {
			this.current_product_build_cost = this.current_product.build_point_cost;
		}
	};

	fabricator.tick = function () {
		for (var i = 0 ; i < fabricator.collection.length; i++) {
			var fab = fabricator.collection[i];

			if (fab.current_product !== null && fab.active) {
			
				if (!fab.current_product_paid) {
					if (fab.current_product.have_ingredients()) {
						fab.current_product.consume_ingredients();
						fab.current_product_paid = true;
					} else {
						fab.status = "Waiting for resources";
					}
					
				}
				if (fab.current_product_paid) {
					fab.status = "Fabricating";
					fab.current_product_progress += fab.build_speed * tick_length/1000;
					if (fab.current_product_progress >= fab.current_product_build_cost) {
						if (fab.current_product.fabricate()) {
							fab.current_product_progress = 0;
							fab.current_product_paid = false;
							if (!fab.loop_production) {
								fab.status = "Stopped";
								fab.active = false;
							}
						} else {
							fab.status = "Out of storage space";
						}
					}				
				}	
			}
		}
	}
}	
	
// Furnace
{
	var furnace = $.extend (furnace, Object.create(game_object));
	glob.push (furnace);
	furnace.init_values = function () {
		game_object.init_values.call (furnace);
		furnace.name = "Furnace";
		furnace.id = "furnace";
		furnace.description = "Electric furnace to smelt ores into irons";
		furnace.cost = [[iron, 100]];
		furnace.toggleable = true;
		furnace.start_quantity = 1;
		furnace.buildable = true;
		furnace.build_speed = 100;
		furnace.max_load = 10;
		furnace.collection = [];
		
		furnace_types.push (furnace);
		return furnace;
	};
	
	furnace.create_free = function () {
		// Generic method code.
		this.quantity++;
		this.built_count++;

		for (var i = 0; i < this.storage.length; i++) {
			this.storage[i][0].capacity += this.storage[i][1];
		}
		
		storage.change_quantity (this.storage_used);
		
		// Class specific
		var fur_instance = Object.create(this);
		fur_instance.uid = this.id + "-" + (this.collection.length+1);
		fur_instance.name += " #" + this.built_count;
		fur_instance.current_product = null;					// What it's currently producing. Just a string of the name
		fur_instance.current_product_progress = 0;				// Function of build_speed and ticks
		fur_instance.current_product_build_cost = 0; 			// How much time/effort the product takes
		fur_instance.current_product_paid = false;				// Has the product cost been paid?
		fur_instance.loop_production = false;
		fur_instance.status = "Stopped";
		fur_instance.active = true;								// Is it active? Note: Can be active and current_product == null. Expected behaviour.
		
		this.collection.push (fur_instance);
		add_to_furnace_list (fur_instance);
	};
		
	furnace.produce = function (product) {
		this.current_product = find_object(product);
		this.current_product_progress = 0;
		this.active = true;
		if (product !== null) {
			this.current_product_build_cost = this.current_product.build_point_cost;
		}
	};
	
	furnace.tick = function () {
		for (var i = 0 ; i < furnace.collection.length; i++) {
			var fur = furnace.collection[i];

			if (fur.current_product !== null && fur.active) {
				if (!fur.current_product_paid) {
					fur.load = 0;
					for (var j = 0; j < this.max_load; j++) {
						if (fur.current_product.have_ingredients()) {
							fur.current_product.consume_ingredients();
							fur.current_product_paid = true;
							fur.load++;
						} else if (j == 0) {
							fur.status = "Waiting for resources";
							break;
						}
					}
				}
				
				if (fur.current_product_paid) {
					fur.status = "Smelting (x" + fur.load + ")";
					fur.current_product_progress += fur.build_speed * tick_length/1000;
					fur.current_product.gen_speed[resource_generation_index] += fur.load * fur.build_speed / fur.current_product_build_cost;
					if (fur.current_product_progress >= fur.current_product_build_cost) {
						for (var j = 0; j < fur.load; j++) {
							if (fur.current_product.smelt()) {
								fur.load--;
								j--;
								if (fur.load == 0) {
									fur.current_product_progress = 0;
									fur.current_product_paid = false;
									if (!fur.loop_production) {
										fur.status = "Stopped";
										fur.active = false;
									}
								}
							} else {
								fur.status = "Out of storage space";
							}
						}
					}			
				}
			}
		}
	}
}
