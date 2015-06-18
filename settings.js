//Settings

var debug = false;
var tick_length = 100;


// Global variables

var game_state = {};			// In-game values

var glob = [];					// List of all classes/objects
var resources = [];				// List of all resources
var buildings = [];
var fabricators = [];
var furnaces = [];
var procons = [];		// Contains all items that produce/consume stuff per tick
var fabricables = [];			// List of fabricable objects

var resource_generation_index = 0;

// Global Namespace
var SpaceMiner = SpaceMiner || {};
