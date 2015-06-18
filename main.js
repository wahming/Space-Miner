/*
Notes:
- Crafting as a resource sink and end game activity
	- Maybe starships? Research artifacts, etc?
*/

/*
	Explanation of flags/booleans/whatevers
	Flag.resource:	Is a resource
	Smelted:		Created in a furnace
	Smeltable:		Can be smelted in a furnace into something else. Not mutually exclusive with smelted
	Appear_in_game:	Is it a valid game object, or just a template or similar
	Has_children:	Has sub-objects
	Active:			Status of objects that can be toggled on or off
	Max/cur load:	For objects that can process more than 1 unit at a time (e.g. furnace)
	Fabricable:		Can be fabricated at fabricator?
	Buildable:		Is it a building?
	Toggleable:		Can toggle on or off
	Has_collection:	Is a class of items with unique instances and ids (furnaces, fabs)
	Value:			For mid/late game, higher value -> more difficulty and events
*/

// Should contain all in-game values
game_state.init = function () {
	game_state.resource = {id : 'resource', has_children : true};
	game_state.building = {id : 'building', has_children : true};
	game_state.product = {id : 'product', has_children : true};
	game_state.template = {id : 'template'};
	
	{
	//Template
	game_state.template = {id : 'template', quantity : 0, description : "Item description", name : "Item name", cost : [], storage_used : 0, build_time : 1000, value : 0,
		flag : [], smelted : false, smeltable : false, unit : "units", generation_speed_array : [], capacity : 0, start_quantity : 0, appear_in_game : false, has_children : false,
		fabricable : false, buildable : false, consumption : [], production : [], storage : [], toggleable : false, built_count : 0, max_load : 0, current_load : 0, 
		active : false, loop_production : false, current_product : null, current_product_progress : 0, current_product_build_time : 0, current_product_paid : false, status : "Stopped", uid : "",
		has_collection : false, flavor_text : "", build_speed : 0, jettisonable : false, noun : "", maintain_paid : false};
	}
	
	//
	// Resources
	//
	
	{	// Class template should list the values that the class uses, for easy personal reference
		game_state.resource.template = $.extend (true, {}, game_state.template);
		game_state.resource.template.flag.push ("resource");
		$.extend (game_state.resource.template, {id : 'resource-template', quantity : 0, description : "Resource description", name : "Resource name", cost : [], storage_used : 1, 
			build_time : 300, 	value : 10, smelted : false, smeltable : false, unit : "kg", generation_speed_array : [], capacity : 0, start_quantity : 0, appear_in_game : false, 
			has_children : false, jettisonable : true});
	
	{
		game_state.resource.storage = $.extend (true, {}, game_state.resource.template);
		game_state.resource.storage.flag.push ("storage");
		$.extend (game_state.resource.storage, {id : "storage", description : "More place to put more stuff", name : "Storage", value : 0, storage_used : 0, capacity : 1000,
			start_quantity : 1000, appear_in_game : true, unit : "m<sup>3</sup>", flavor_text : "Not quite up to the level of pokeballs yet."});
	}
	
	{
		game_state.resource.iron = $.extend (true, {}, game_state.resource.template);
		game_state.resource.iron.flag.push ("iron", "smelted", "uses_storage");
		$.extend (game_state.resource.iron, {id : "iron", description : "The basic building material of the modern age", name : "Iron", cost : [["iron_ore", 3]], value : 50,
			smelted : true, start_quantity : 0, appear_in_game : true, flavor_text : "Iron + man : IRONMAN! Iron + bot : Daleks.", capacity : -1});
	}

	{
		game_state.resource.copper = $.extend (true, {}, game_state.resource.template);
		game_state.resource.copper.flag.push ("copper", "smelted", "uses_storage");
		$.extend (game_state.resource.copper, {id : "copper", description : "A malleable reddish-brown metal, widely used as a conductor", name : "Copper", cost : [["copper_ore", 3]], value : 50,
			smelted : true, appear_in_game : true, flavor_text : "They say intelligent people have more copper in their hair. You're a freaking genius.", capacity : -1});
	}
	
	{
		game_state.resource.iron_ore = $.extend (true, {}, game_state.resource.template);
		game_state.resource.iron_ore.flag.push ("iron", "smeltable", "ore", "uses_storage");
		$.extend (game_state.resource.iron_ore, {id : "iron_ore", description : "Smelt in a furnace to produce iron", name : "Iron ore", smeltable : true, 
			flavor_text : "Dust, dust everywhere", appear_in_game : true, capacity : -1});
	}

	{
		game_state.resource.copper_ore = $.extend (true, {}, game_state.resource.template);
		game_state.resource.copper_ore.flag.push ("copper", "smeltable", "ore", "uses_storage");
		$.extend (game_state.resource.copper_ore, {id : "copper_ore", description : "Smelt in a furnace to produce copper", 
			flavor_text : "Brown and crumbly. Thankfully you've never seen poop before.", name : "Copper ore", smeltable : true, appear_in_game : true, capacity : -1});
	}
	
	{
		game_state.resource.energy = $.extend (true, {}, game_state.resource.template);
		game_state.resource.energy.flag.push ("energy", "ore");
		$.extend (game_state.resource.energy, {id : "energy", description : "Keeps your stuff running and you alive", flavor_text : "I HAVE THE POWER!", name : "Energy", 
			appear_in_game : true, unit : "MJ", storage_used : 0, capacity : 1000});
	}
	}
	
	//
	// Buildings
	//
	
	{	// Class template should list the values that the class uses, for easy personal reference
		game_state.building.template = $.extend (true, {}, game_state.template);
		game_state.building.template.flag.push ("building");
		$.extend (game_state.building.template, {id : 'building-template', quantity : 0, description : "Building description", name : "Building name", cost : [], build_time : 3000, 
			value : 1000, start_quantity : 0, appear_in_game : false, has_children : false, max_load : 0, current_load : 0, has_collection : false, production : [], consumption : [], 
			storage : [], buildable : false, toggleable : false, built_count : 0, active : true, loop_production : false, current_product : null, noun : "",
			current_product_progress : 0, current_product_build_time : 0, current_product_paid : false, status : "Stopped", uid : "", has_collection : false, capacity : -1, maintain_paid : false});
	
	{
		game_state.building.furnace = $.extend (true, {}, game_state.building.template);
		game_state.building.furnace.flag.push ("furnace", "production");
		$.extend (game_state.building.furnace, {id : 'furnace', quantity : 0, description : "Electric furnace to smelt ores into metals", name : "Furnace", max_load : 10, build_speed : 100,
			cost : [["iron", 100], ["copper", 10]], build_time : 3000, flavor_text : "Burn, baby, burn.", start_quantity : 1, appear_in_game : true, 
			has_collection : true, consumption : [["energy", 100]], buildable : true, toggleable : true, active : false, noun : "Smelting"});
	}
	
	{
		game_state.building.fabricator = $.extend (true, {}, game_state.building.template);
		game_state.building.fabricator.flag.push ("fabricator", "production");
		$.extend (game_state.building.fabricator, {id : 'fabricator', quantity : 0, description : "Automated mini-factory to create finished goods from raw materials", max_load : 1, 
			name : "Fabricator", cost : [["circuit_board", 10], ["iron", 100], ["copper", 10]], build_time : 3000, flavor_text : "Factorio in spaaaaaaaaaaaaaace!", build_speed : 100,
			start_quantity : 1, appear_in_game : true, has_collection : true, consumption : [["energy", 100]], buildable : true, toggleable : true, active : false, noun : "Fabricating"});
	}

	{
		game_state.building.warehouse = $.extend (true, {}, game_state.building.template);
		game_state.building.warehouse.flag.push ("warehouse", "storage");
		$.extend (game_state.building.warehouse, {id : 'warehouse', quantity : 0, description : "More place to keep more stuff", 
			name : "Warehouse", cost : [["iron", 300]], build_time : 6000, flavor_text : "Drawing a blank on whorehouse... I mean.. oops.", appear_in_game : true,  
			consumption : [["energy", 30]], buildable : true, toggleable : true, active : true, storage : [["storage", 5000]]});
	}

	{
		game_state.building.solar_array = $.extend (true, {}, game_state.building.template);
		game_state.building.solar_array.flag.push ("solar", "energy");
		$.extend (game_state.building.solar_array, {id : 'solar_array', quantity : 0, description : "Bunch of solar panels to generate power", 
			name : "Solar array", cost : [["solar_panel", 9], ["iron", 50], ["copper", 100]], build_time : 2000, flavor_text : "Who said too much sun was bad for you?", 
			start_quantity : 1, appear_in_game : true, production : [["energy", 500]], buildable : true, toggleable : true, active : true});
	}

	{
		game_state.building.capacitor_bank = $.extend (true, {}, game_state.building.template);
		game_state.building.capacitor_bank.flag.push ("storage", "energy");
		$.extend (game_state.building.capacitor_bank, {id : 'capacitor_bank', quantity : 0, description : "Stores power for when you need it", 
			name : "Capacitor bank", cost : [["capacitor", 100], ["iron", 10], ["copper", 50]], build_time : 1000, flavor_text : "Of course, it'll be empty when you do need it...", 
			start_quantity : 0, appear_in_game : true, storage : [["energy", 5000]], buildable : true, toggleable : true, active : true});
	}
	}
	
	//
	// Products
	//
	
	{	// Class template should list the values that the class uses, for easy personal reference
		game_state.product.template = $.extend (true, {}, game_state.template);
		game_state.product.template.flag.push ("product");
		$.extend (game_state.product.template, {id : 'Product_template', quantity : 0, description : "Product description", name : "Product name", cost : [], storage_used : 0, 
			build_time : 1000, value : 100, start_quantity : 0, appear_in_game : false, fabricable : false, production : [], storage : [], toggleable : false, built_count : 0,
			active : false, status : "Stopped", flavor_text : "", capacity : -1, jettisonable: true});
	
	{
		game_state.product.chassis = $.extend (true, {}, game_state.product.template);
		game_state.product.chassis.flag.push ("intermediate-parts");
		$.extend (game_state.product.chassis, {id : 'chassis', description : "A multipurpose robot body", name : "Chassis", cost : [["iron", 50]], storage_used : 1, 
			appear_in_game : true, fabricable : true, flavor_text : "No Daleks were harmed in the making of this product.", start_quantity : 1});
	}
	
	{
		game_state.product.capacitor = $.extend (true, {}, game_state.product.template);
		game_state.product.capacitor.flag.push ("intermediate-parts");
		$.extend (game_state.product.capacitor, {id : 'capacitor', description : "Backup power supply", name : "Capacitor", cost : [["iron", 2], ["copper", 5]], storage_used : 0.2, 
			appear_in_game : true, fabricable : true, flavor_text : "Almost as efficient as an old Nokia battery.", build_time : 500,});
	}
	
	{
		game_state.product.solar_panel = $.extend (true, {}, game_state.product.template);
		game_state.product.solar_panel.flag.push ("intermediate-parts");
		$.extend (game_state.product.solar_panel, {id : 'solar_panel', description : "Produces power for your mobile units", name : "Solar panel", cost : [["iron", 10], ["copper", 50]], 
			storage_used : 1, appear_in_game : true, fabricable : true, flavor_text : "Who said solar was for the birds?", start_quantity : 1});
	}
	
	{
		game_state.product.circuit_board = $.extend (true, {}, game_state.product.template);
		game_state.product.circuit_board.flag.push ("intermediate-parts");
		$.extend (game_state.product.circuit_board, {id : 'circuit_board', description : "Circuits and boards", name : "Circuit board", cost : [["iron", 2], ["copper", 2]], 
			storage_used : 0.1, appear_in_game : true, fabricable : true, flavor_text : "Johnny 5e.", build_time : 300});
	}
	
	{
		game_state.product.miner = $.extend (true, {}, game_state.product.template);
		game_state.product.miner.flag.push ("miner");
		$.extend (game_state.product.miner, {id : 'miner', quantity : 0, description : "Lil robot guy that mines asteroids for ore", name : "Miner", 
			cost : [["chassis", 1], ["solar_panel", 1], ["circuit_board", 3]], storage_used : 1, 
			build_time : 2000, start_quantity : 1, appear_in_game : true, fabricable : true, production : [["copper_ore",1], ["iron_ore",1]], toggleable : true, built_count : 0,
			active : true, status : "Mining", flavor_text : "Metallic counterparts of the suicidal midgets from Dwarf Fortress."});
	}
	
	{
		game_state.product.construction_bot = $.extend (true, {}, game_state.product.template);
		game_state.product.template.flag.push ("construction");
		$.extend (game_state.product.template, {id : 'construction_bot', quantity : 0, description : "", name : "Product name", cost : [["chassis", 1], ["solar_panel", 1], ["circuit_board", 3]],
			storage_used : 1, build_time : 1000, start_quantity : 1, appear_in_game : true, fabricable : true, built_count : 0,
			active : true, status : "Idle", flavor_text : "Seconds since last accident: ... <b><i>Boom</i></b>", capacity : -1, jettisonable: true});
	}
	}
	
	{
		game_state.globals = {};
		game_state.globals.glob = glob;
		game_state.globals.resources = resources;					// List of all resources
		game_state.globals.buildings = buildings;	
		game_state.globals.fabricators = fabricators;	
		game_state.globals.furnaces = furnaces;	
		game_state.globals.procons = procons;			// Contains all items that produce/consume stuff per tick
		game_state.globals.fabricables = fabricables;	
	}
};

game_state.process = function () {
	
	
	resources.sort (function (a, b) {return (a.id < b.id ? -1 : 1);});
	buildings.sort (function (a, b) {return (a.id < b.id ? -1 : 1);});
	fabricables.sort (function (a, b) {return (a.id < b.id ? -1 : 1);});
	fabricators.sort (function (a, b) {return (a.uid < b.uid ? -1 : 1);});
	furnaces.sort (function (a, b) {return (a.uid < b.uid ? -1 : 1);});

	SpaceMiner.Resources.init();
	SpaceMiner.Build.init();
	SpaceMiner.Manufacturer.init();
	SpaceMiner.Products.init();
	SpaceMiner.Jettison.init();
};

game_state.reset = function () {
	game_state.init();
	
	glob.length = 0;
	resources.length = 0;				// List of all resources
	buildings.length = 0;
	fabricators.length = 0;
	furnaces.length = 0;
	procons.length = 0;		// Contains all items that produce/consume stuff per tick
	fabricables.length = 0;			// List of fabricable objects

	game_state.index_items ();
	
	for (i in glob) {
		var item = glob[i];
		if ((item.production.length > 0 || item.consumption.length > 0) && !item.has_collection) {procons.push (item);}

		if (item.flag.indexOf ("resource") > -1) {resources.push (item);}
		
		if (item.flag.indexOf ("building") > -1) {buildings.push (item);}
		
		if (item.flag.indexOf ("product") > -1) {fabricables.push (item);}

		SpaceMiner.General.create.call(item, true, item.start_quantity);
	}
	
	game_state.process();
};

game_state.save = function () {
	localStorage["game_state"] = JSON.stringify (game_state);
};

game_state.load = function () {
	if (localStorage.getItem ("game_state") != "null") {
		$.extend (true, game_state, JSON.parse (localStorage.getItem ("game_state")));
		
		glob = game_state.globals.glob;					// List of all classes/objects
		fabricators = game_state.globals.fabricators;
		furnaces = game_state.globals.furnaces;
	}
	game_state.process();
};

game_state.index_items = function () {
	for (var property in this) {
		var obj = this [property];
		if (this != null && this.hasOwnProperty(property) && obj != null) {
			if (typeof (obj) == "object" && this [property].has_children != null) {
				if (obj.has_children) {
					game_state.index_items.call (obj);
				} else {
					if (obj.appear_in_game) {
						glob.push (obj);
					}
				}
			}
		}
	}
};


game_state.reset ();
game_state.load ();


// Run UI update code every tick
var timer = (new Date()).getTime();
var time_change = 0;
var count = 9;
window.setInterval(function () {
	time_change = (new Date()).getTime() - timer + (time_change % tick_length);
	timer = (new Date()).getTime();
		
	for (var i = 1; i <= time_change/tick_length; i++) {
		SpaceMiner.General.tick();
		SpaceMiner.Resources.graphicalUpdate();
		SpaceMiner.Build.graphicalUpdate();
		SpaceMiner.Products.graphicalUpdate();
		SpaceMiner.Manufacturer.graphicalUpdate();
		SpaceMiner.Jettison.graphicalUpdate();
		count++;
		
		
		for (var i = 0; i < resources.length; i++) {
			resources[i].generation_speed_array[resource_generation_index] = (resources[i].quantity - resource_last_turn[i]) * 10;
			resource_last_turn[i] = resources[i].quantity;
		}
		resource_generation_index = (resource_generation_index+1) %150;
	}
	
	if (count >= 10) {
		count -= 10;
	}
}, tick_length);



window.setInterval(function () {
	for (var i = 0; i < glob.length; i++) {
		game_state.save();
	}
}, 5000);
