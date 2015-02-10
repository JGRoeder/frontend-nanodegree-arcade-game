/**
 * Object which instantiates and holds all ( actualy most )
 * @constructor
 * game objects.
 * (game = this) variable to provide easier interoperability.
 * @param {number} canvasWidth - the width of the canvas
 * @param {number} canvasHeight - the height of the canvas
 * @param {number} gridWidth - horizontal steps across the map
 * @param {number} gridHeight - vertical steps on the map
 * @param {object} tileSet - the game map data
 *
 * TODO Find a better way than referencing an
 * instance e.g. ( game = this ) to access properties.
 * I opted not to inherit where it didn't solid semantic sense.
 * e.g. ( GameState does not inherit from Game);
 * But in hindsight that might have been better.
 */
var Game = function (canvasWidth, canvasHeight, gridWidth, gridHeight, tileSet) {
  game = this;
  this.grid = { width: gridWidth, height: gridHeight};
  this.gameWidth = canvasWidth;
  this.gameHeight = canvasHeight;
  this.HUDoffset = 166;
  this.tileSet = tileSet;
  this.reset(this.tileSet);

};

/**
 * Reset ( by redefinition ) all variables associate with gameplay
 * Takes the tileset ( map definition ) that was provided on startup
 */
Game.prototype.reset = function(tileSet) {
  this.map = new GameMap(this.gameWidth, this.gameHeight, this.grid, this.HUDoffset, tileSet);
  this.player = new Player(this.map.startPoint.x,this.map.startPoint.y);
  this.state = new GameState(this.tileSet);
  this.allEnemies = this.createEnemies();
  this.items = this.createItems();
  this.entityHash = new EntityHash(250);
};

/**
 * Access the spatial hash to return a list of
 * entities which are in reasonble proximity of the player.
 * @returns {array} an array of enemies
 * @param {object} player - a player character
 */
Game.prototype.checkProximity = function(player) {
  var enemies = this.entityHash.query(player.x, player.y);
  return enemies;
};

/**
 * Determine whether or not there is a collission between
 * the player and interactive entities.
 * @param {object} player - a player character
 * @param {object} entity - an interactive non-player entity
 */
Game.prototype.detectCollision = function(player, entity) {
  if (player.hitBoxLeft() < entity.hitBoxLeft() + entity.width &&
  player.hitBoxLeft() + player.width > entity.hitBoxLeft() &&
  player.hitBoxTop() < entity.hitBoxTop() + entity.height  &&
  player.height + player.hitBoxTop() > entity.hitBoxTop()) {
    entity.collide(player);
  }
};

/**
 * Adds an item to the games track array of item entities
 * @param {object} item - an interactive non-enemy entity
 */
Game.prototype.addItem = function (item) {
  this.items.push(item);
};

/**
 * Return player and items to their starting locations
 * in items case, this is random.
 */
Game.prototype.resetStage = function ( ){
  this.player.reset(this.map.startPoint);
  this.resetItems();
};

/**
 * Removes an item from the games tracked array of item entities
 * @param {object} item - an interactive non-enemy entity
 */
Game.prototype.removeItem = function (item) {
  var index = this.items.indexOf(item);
  if (index > -1){
    game.items.splice(index, 1);
  }
};

/**
 * Resets items - by rerunning the method which creates them
 */
Game.prototype.resetItems = function () {
  this.items = this.createItems();
};


/**
 * Instantiate our items and return them in an array
 * @returns {array} an array of item object intances
 * TODO This should be modularized but for now static is fine
 */
Game.prototype.createItems = function () {
  var allItems = [];
  //var item1 = new Coffee();

  allItems.push(
    new Coffee()
  );
  return allItems;
};


/**
 * Instantiate our enemies and return them in an array
 * @returns {array} an array of enemy object instances
 * TODO This should be modularized but for now static is fine
 */
Game.prototype.createEnemies = function () {
  var allEnemies = [];

  var enemy1 = new Hatch(7,11),
      enemy2 = new Hatch(4,11),
      enemy3 = new Hatch(1,11),
      enemy4 = new Hatch(-2,11),
      enemy5 = new Sedan(4.33,10,-2),
      enemy6 = new Sedan(8.66,10,-2),
      enemy7 = new Sedan(12.99,10,-2),
      enemy8 = new Coupe(8,9,4),
      enemy9 = new Coupe(2,9,4),
      enemy10 = new Van(2 , 8, -4),
      enemy11 = new Van(5.55, 8, -4),
      enemy12 = new Van(9.1, 8, -4),
      enemy13 = new Van(12.65, 8, -4),
      enemy14 = new Semi(2,6,3),
      enemy15 = new Semi(-1,6,3),
      enemy16 = new Semi(-4,6,3),
      enemy17 = new SemiReverse(8,5,-3),
      enemy18 = new SemiReverse(3,5,-3),
      enemy19 = new SemiReverse(0,5,-3),
      enemy20 = new Semi(8,4,1),
      enemy21 = new Semi(3,4,1),
      enemy22 = new Semi(0,4,1),
      enemy23 = new SemiReverse(8,3,-4),
      enemy24 = new SemiReverse(3,3,-4),
      enemy25 = new SemiReverse(0,3,-4);


  allEnemies.push(
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5,
    enemy6,
    enemy7,
    enemy8,
    enemy9,
    enemy10,
    enemy11,
    enemy12,
    enemy13,
    enemy14,
    enemy15,
    enemy16,
    enemy17,
    enemy18,
    enemy19,
    enemy20,
    enemy21,
    enemy22,
    enemy23,
    enemy24,
    enemy25
  );
  return allEnemies;
};


Game.prototype.loopAudio = function(url) {
  var Audio = AudioResources.get(url);
  if (typeof Audio.loop == 'boolean')
    {
        Audio.loop = true;
    }
    else
    {
        Audio.addEventListener('ended', function() {
            this.currentTime = 1;
            this.play();
        }, false);
    }
    Audio.volume = 0.03;
    Audio.play();
};

Game.prototype.playAudio = function(url) {
  var Audio = AudioResources.get(url);
  Audio.volume = 0.2;
  Audio.play();
};



/**
 * Keeps track of state related game data such as
 * Level, mode ( screen ), various win conditions, buttons
 * @param {object} tileSet - the tileset ( mapdata to use for resetting )
 */
var GameState = function (tileSet) {
  this.currentMode = 'new';
  this.level = 1;
  this.player = game.player;
  this.coffeeCount = 2;
  this.speedMultiplier = 1;
  this.currentScore = 0;
  this.restartButton = this.makeResetButton(tileSet);
  this.buttonState = 0;
  this.resetScreenTimer();
  this.resetCoffeeTimer();
};

/**
 * Controls countdown timer which runs only when the player
 * has collected the coffee. If time runs out, the method
 * which kills the player is envoked.
 */
GameState.prototype.updateCoffeeTimer = function () {
  if ( this.player.hasCoffee ) {
    this.coffeeTimer--;
  }
  if ( this.coffeeTimer <= 0 ) {
    this.player.die();
    this.player.hasCoffee = 0;
  }
};
/**
 * Resets the timer for screens ( Day )
 * approx. 2 seconds.
 */
GameState.prototype.resetScreenTimer = function() {
    this.screenTimer = 2 * 60;
};

/**
 * Resets the timer for coffee collection
 * approx. 15 seconds.
 */
GameState.prototype.resetCoffeeTimer = function() {
    this.coffeeTimer = 15 * 60;
};

/**
 * Helps render player lives to the HUD
 */
GameState.prototype.renderLives = function () {
  var pos = 25;
  for ( i = 0, lives = game.player.lives; i < game.player.lives; i++ ){
    ctx.drawImage(Resources.get('images/life-indicator.png'), pos, 145 - 40 );
    pos += 45;
  }
};

/**
 * Keeps track of state related game data such as
 * @param {string} mode - a short string refrencing a game screen
 * @returns {string} a string matching a method name responsible
 * for rendering the appropriate screen.
 */
GameState.prototype.getScreen = function (mode) {
  var screens = {
    'new': 'startScreen',
    'over': 'overScreen',
    'day':  'dayScreen'
  };
  return screens[mode];
};

/**
 * Increments the current games score by value
 * @param {number} value - an items associated score value
 */
GameState.prototype.updateScore = function (value) {
  this.currentScore += value;
};


/**
 * Returns the games current mode setting
 * @returns {string} the current mode of the GameState instance
 */
GameState.prototype.checkMode = function () {
  return this.currentMode;
};


/**
 * Sets the games current mode
 * @param {string} the current mode of the GameState instance
 */
GameState.prototype.setMode = function (mode) {
  this.currentMode = mode;
};


/**
 * Toggles a buttons visability by switching css classes
 * Change the buttons state as tracked by GameState
 * @param {string} buttonClass - the css class shared by buttons
 * @param {string} buttonID - the html ID property of the button we're targeting
 */
GameState.prototype.showButton = function(buttonClass, buttonID){
  var button = document.getElementById(buttonID);
  button.className = "";
  button.className = buttonClass;
  this.buttonState = 1;
};

/**
 * Removes a button from the DOM
 * @param {object} button - the button we're trying to remove
 */
GameState.prototype.removeButton = function (button) {
  button.parentNode.removeChild(button);
};

/**
 * Creates the start button with specific html/css properties
 * Binds the event listener which makes the button function
 * TODO probably split this into a couple methods
 * @returns {object} an button object
 */
GameState.prototype.makeStartButton = function() {
  var button = document.createElement('div');
  button.innerHTML = 'Start';
  button.id = 'start';
  button.className ='btn';

  // retrieve canvas element by ID
  // map bounds to its bounding values
  // set the buttons position relative to the canvas
  // TODO probably it's own method
  var canvas = document.getElementById('canvas');
  var bounds = canvas.getBoundingClientRect();
  button.style.top = (bounds.top + ((bounds.height - 40) / 1.75)) + 'px';

  document.body.insertBefore(button, document.body.firstChild);
  button.addEventListener("click", function(){
    game.state.setMode('day');
    game.state.removeButton(button);
    game.loopAudio('sounds/traffic.mp3');
  });
  return button;
};


/**
 * Creates the reset button with specific html/css properties
 * Binds the event listener which makes the button function
 * @param {object} the tileSet object defining map data
 * @returns {object} an button object
 *
 * TODO probably split this into a couple methods || largely redundant with above
 */
GameState.prototype.makeResetButton = function(tileSet) {
  var button = document.createElement('div');
  button.innerHTML = 'retry';
  button.id = 'restart';
  button.className='btn hidden';

  // retrieve canvas element by ID
  // map bounds to its bounding values
  // set the buttons position relative to the canvas
  // TODO probably it's own method
  var canvas = document.getElementById('canvas');
  var bounds = canvas.getBoundingClientRect();
  button.style.top = (bounds.top + ((bounds.height - 40) / 1.75)) + 'px';

  document.body.insertBefore(button, document.body.firstChild);
  button.addEventListener("click", function(){
    game.reset(tileSet); // pass in tileset because we're resetting
    game.state.setMode('day');
    game.state.removeButton(button);
  });
  return button;
};

/**
 *
 * TODO All three of the game screens can/should probably be
 * part of a "screen" class.
 *
 */

/**
 * Draws the game over screen to the canvas
 * makes the button visible if it is current hidden
 */
GameState.prototype.overScreen = function () {
  if (this.buttonState === 0 ){
    this.showButton('btn', 'restart');
  }
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0,0,1111,1500);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('BAD LUCK CHAMP',  555.5, 500);
  ctx.font="Bold 120px Arial Black";
  ctx.fillText('YOU\'RE FIRED',  555.5, 650);
  ctx.font="Bold 40px Arial Black";
  ctx.fillText('YOU LASTED ' + ( this.level - 1 ) + ' DAYS',  555.5, 875);
  ctx.fillText('YOU SCORED ' + this.currentScore + ' POINTS',  555.5, 950);
};


/**
 * Draws the day screen to the canvas
 * runs for approx 2 sec ( based on screenTimer )
 * then switches the mode to play, and resets the screen timer.
 */
GameState.prototype.dayScreen = function () {
  this.screenTimer--;
  if ( this.screenTimer >= 0 ) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0,0,1111,1500);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font="Bold 30px Arial Black";
      ctx.fillText( this.coffeeCount + ' COWORKERS WANT A COFFEE',  555.5, 500);
      ctx.font="Bold 120px Arial Black";
      ctx.fillText('DAY ' + this.level,  555.5, 650);
  } else if ( this.screenTimer <= 0) {
    game.state.setMode('play');
    this.resetScreenTimer();
  }
};

/**
 * Draws the title screen.
 */
GameState.prototype.startScreen = function () {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0,0,1111,1500);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText('IT\'S TIME TO START YOUR',  555.5, 500);
  ctx.font = 'Bold 120px Arial Black';
  ctx.fillText('INTERNSHIP!',  555.5, 650);
  ctx.font = 'Normal 24px Arial';
  ctx.fillText('Each day more of your co-workers will realize there is a new intern.',  555.5, 875);
  ctx.fillText('Use the arrow keys to walk across the street, grab a coffee, and then',  555.5, 875 + 31);
  ctx.fillText('bring it back before its cold.',  555.5, 875 + 31 + 31);

};

/**
 * Draws the HUD at the top of the canvas
 * displays various pices of game data.
 */
GameState.prototype.renderHud = function () {
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,1222,1222);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = "Bold 30px Verdana";
  ctx.fillText("Day: " + this.level, 175, 145);
  ctx.fillText("Get " + ( this.coffeeCount - game.player.gotCoffees ) + ' Coffees', 335, 145);
  ctx.fillText("Score: " + this.currentScore, 625, 145);
  ctx.fillText("Time: " + Math.floor(( this.coffeeTimer / 60 )), 945, 145);
  this.renderLives();
};

/**
* Generic class for map tiles
* @constructor
*/
var MapTile = function () {
  this.width = 101;
  this.height = 83;
  this.pos = [0,0];
  this.sprite = 'images/default-block.png';
};

/**
* Sets the position of the map tile
* @param {number} x - an x coordinate
* @param {number} y - a y coordinate
*/
MapTile.prototype.setPos = function (x, y) {
  this.pos = [x, y];
};

/**
* Dras map tiles to the canvas
*/
MapTile.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
};

/**
* A Building maptile subclass
* @constructor
* @extends MapTile
*/
var Building = function () {
  MapTile.call(this);
  this.width = 202;
  this.height = 83;
  this.sprite = 'images/building1.png';
};
Building.prototype = Object.create(MapTile.prototype);
Building.prototype.constructor = Building;

/**
* A Road maptile subclass
* @constructor
* @extends MapTile
*/
var Road = function () {
  MapTile.call(this);
  this.width = 202;
  this.height = 83;
  this.sprite = 'images/road.png';
};

Road.prototype = Object.create(MapTile.prototype);
Road.prototype.constructor = Road;

/**
* A Shoulder maptile subclass
* @constructor
* @extends MapTile
*/
var Shoulder = function () {
  MapTile.call(this);
  this.width = 202;
  this.height = 83;
  this.sprite = 'images/shoulder.png';
};

Shoulder.prototype = Object.create(MapTile.prototype);
Shoulder.prototype.constructor = Shoulder;

/**
* A Sidewalk maptile subclass
* @constructor
* @extends MapTile
*/
var Sidewalk = function () {
  MapTile.call(this);
  this.width = 202;
  this.height = 83;
  this.sprite = 'images/sidewalk-top.png';
};
Sidewalk.prototype = Object.create(MapTile.prototype);
Sidewalk.prototype.constructor = Sidewalk;


/**
* A Sidewalk maptile subclass
* intended for use at the bottom of the map
* @constructor
* @extends MapTile
*/
var SidewalkBottom = function () {
  MapTile.call(this);
  this.width = 202;
  this.height = 83;
  this.sprite = 'images/sidewalk-bottom.png';
};
SidewalkBottom.prototype = Object.create(MapTile.prototype);
SidewalkBottom.prototype.constructor = SidewalkBottom;

/**
* Defines the game map
* @param {number} mapWidth - the width of the map
* @param {number} mapHeight - the height of the map
* @param {object} grid - total grid width and height units [width,height]
* @param {number} HUDoffset - the height of the hud, how much to offset the map
* @param {object} tileSet - the map data
* @constructor
*
*
* TODO simplify, createTileSet current has to be called last, not awesome.
*/
var GameMap = function (mapWidth, mapHeight, grid, HUDoffset, tileSet) {
  this.width        = mapWidth;
  this.height       = mapHeight - HUDoffset + 83; //TODO derive 83 another way
  this.grid         = grid;
  this.HUDoffset    = HUDoffset;
  this.xUnit        = this.width / grid.width; // gives us a step in pixels
  this.yUnit        = ( this.height - HUDoffset  ) / grid.height;
  this.bounds       = { x: [0,11], y: [0,12] };
  this.startPoint   = {x: 505, y: 980};
  this.tileSet      = this.createTileSet(tileSet);
};


/**
* Renders prepared tiles to the game map
*/
GameMap.prototype.render = function () {
  for ( var i = 0, l = this.tileSet.length; i < l; i++ ) {
    this.tileSet[i].render();
  }
};


/**
* Returns the prepared tileSet
*/
GameMap.prototype.getTileSet = function () {
  return this.tileSet;
};


/**
* Returns looks up appropriate tile based on map data
* returns a tile instance of the referenced object
* @params {number} tileID - the numeric ID assocated with a tile
* @returns {object} an instance of a tile object
*/
GameMap.prototype.getTile = function (tileID) {
  this.types = {
    '0': MapTile,
    '1': Building,
    '2': Shoulder,
    '3': Road,
    '4': Sidewalk,
    '5': SidewalkBottom
  };
  var tileType = this.types[tileID];
  return new tileType();
};


/**
* Takes in the map data and outputs an array of tileObjects ready for rendering
* @param {array} tileSet - map data provided on initialization of the game
* @returns {array} tileArray - an array of tile objects prepared for renderingr
*
* TODO simplify this lol. Probably a lot of seperate methods in here
*/
GameMap.prototype.createTileSet = function (tileSet) {
  var tileArray = [];
  var rowNumber = 0;

  // as long as there are rows
  for ( var rowCount = 0, rows = tileSet.length; rowCount < rows; rowCount++) {
    var rowHeight = 0;
    var colNumber = 0;

    // if the row does not have repeat parameter set
    if ( tileSet[rowCount].repeat === 0 ) {

      // while there are tiles in the row
      for ( var tileCount = 0, rowLength = tileSet[rowCount].tiles.length; tileCount < rowLength; tileCount++) {

        // create tile objects based on the number value of that index
        var tileObject = this.getTile(tileSet[rowCount].tiles[tileCount]);
        if (tileObject.height > rowHeight ) {
          rowHeight = tileObject.height;
        }

        //set the tile's position
        tileObject.setPos(colNumber * this.xUnit, ( rowNumber * this.yUnit ) + this.HUDoffset);
        tileArray.push(tileObject); // push it
        colNumber++;
      }
    // if the row DOES have repeat parameter set
    } else if ( tileSet[rowCount].repeat == 1 ) {

      // while there is still roomk on the map
      for ( var rTileCount = 0, rRowLength = this.width ; rTileCount < rRowLength ;) {

        // create tile objects based on the number provided
        var rTileObject= this.getTile(tileSet[rowCount].tiles[0]);
        rTileCount+=rTileObject.width;

        //set the tile's position
        rTileObject.setPos(colNumber * rTileObject.width, ( rowNumber * this.yUnit ) + this.HUDoffset );
        tileArray.push(rTileObject); // push it
        colNumber++;
      }
    }
    rowNumber++;
  }
  return tileArray; // real good
};

/**
* A generic interactive game element
* @constructor
*/
var Entity = function () {
  this.width      =  60;
  this.height     =  75;
  this.step       = { x: 101, y: 83};
  this.hitOffset  = {x: 0, y: 57}; // how far to offset the hitbox
  this.sprite     = 'images/char-boy.png';
};


/**
* render entities to the screen
*/
Entity.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y + game.HUDoffset);
  //these draw hitboxes for debugging.
  //ctx.fillRect(this.hitBoxLeft(), this.hitBoxTop() + game.HUDoffset, this.width, this.height);
  //ctx.fillStyle = "rgba(255,255,255,0.5)";
};

/**
* get the left edge of the hitbox
*/
Entity.prototype.hitBoxLeft = function () {
  return this.x + this.hitOffset.x;
};


/**
* get the top edge of the hitbox
*/
Entity.prototype.hitBoxTop = function () {
  return this.y + this.hitOffset.y;
};


/**
* not currently used on superclass but returning prevents problems
*/
Entity.prototype.collide = function () {
  return;
};


/**
* Generic Item
* @constructor
* @extends Entity
*/
var Coffee = function() {
  Entity.call(this);
  this.sprite = 'images/coffee.png';
  this.x = Math.floor(Math.random()*(10-1+1)+1) * this.step.x; // special bounds no outside edge
  this.y = 1 * this.step.y; // only in top most row
  this.width = 70;
  this.height = 55;
  this.value = 100; // the score value
};
Coffee.prototype = Object.create(Entity.prototype);
Coffee.prototype.contructor = Coffee;

/**
* Determines what to do when the player collides with the object
* Set the player.hasCoffee value, indicating he has picked up the coffee
* remove the item, and update the score.
* add a new home office object to the list of items
* @param {object} player - the player who ran into the item
*/
Coffee.prototype.collide = function (player) {
  game.playAudio('sounds/bell.mp3');
  player.hasCoffee = 1;
  game.removeItem(this);
  game.state.updateScore(this.value);
  game.addItem(new HomeOffice());
};

/**
* Generic Item ( kinda )
* @constructor
* @extends Entity
*/
var HomeOffice = function() {
  Entity.call(this);
  this.sprite = 'images/target.png';
  this.x = Math.floor(Math.random()*(10-1+1)+1) * this.step.x; // special bounds, no outside edge
  this.y = 12 * this.step.y; // only in bttom most row
  this.width = 83;
  this.height = 101;
  this.value = 1000;
};

HomeOffice.prototype = Object.create(Entity.prototype);
HomeOffice.prototype.constructor = HomeOffice;

/**
* Takes away players coffee, resets coffe timer.
* Removes itself, updates score and spawns a new coffee object instance.
* if the player has not yet collected all the coffees, increment
* otherwise, reset gotCoffees, increment the level, increment coffee count
* and draw the day screen ( level up )
* @param {object} player - the player who collided with the object
*/
HomeOffice.prototype.collide = function(player) {
  player.hasCoffee = 0;
  game.state.resetCoffeeTimer();
  game.removeItem(this);
  game.state.updateScore(this.value);
  game.addItem(new Coffee());
  if ( player.gotCoffees < game.state.coffeeCount ) {
    player.gotCoffees += 1;
  }
  if ( player.gotCoffees == game.state.coffeeCount ) {
    player.gotCoffees = 0;
    game.state.level += 1;
    game.state.coffeeCount += 1;
    game.state.setMode('day');
  }
};


/**
* Generic Enemy
* @constructor
* @extends Entity
*/
var Enemy = function (x, y) {
  Entity.call(this);
  this.start = -1 * this.step.x;
  this.sprite = 'images/enemy-bug.png';
  this.x = x * this.step.x;
  this.y = y * this.step.y;
  this.width = 96;
  this.height = 57;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;


/**
* If the player collides with the object, trigger his death.
*/
Enemy.prototype.collide = function (player) {
  game.playAudio('sounds/crash.mp3');
  game.playAudio('sounds/hit.mp3');
  player.die();
};


/**
* Updates the enemies x position. If he goes out of bounds, restart him at
* the appropriate position
* @param {number} - a time delta to smooth animatino across devices
* @param {object} bounds - x and y boundaries for the enemy ( in grid units)
*/
Enemy.prototype.update = function(dt, bounds) {
  if (this.x > (this.step.x * bounds.x[1])) {
    this.x = this.start;
  } else {
    this.x = this.x + ( this.speed * dt );
  }
};


/**
* A Hatchback type enemy
* @constructor
* @extends enemy
* @param {number} x - starting x position in grid units
* @param {number} y - starting y position in grid units
* @param {number} speed - speed in grid units
*/
var Hatch = function (x, y, speed) {
  Enemy.call(this, x, y, speed);
  speed = typeof speed !== 'undefined' ? speed : 1;
  this.speed = speed * this.step.x;
  this.sprite = 'images/hatch.png';
};
Hatch.prototype = Object.create(Enemy.prototype);
Hatch.prototype.constructor = Hatch;


/**
* A Sedan type enemy
* @constructor
* @extends enemy
* @param {number} x - starting x position in grid units
* @param {number} y - starting y position in grid units
* @param {number} speed - speed in grid units
*/
var Sedan = function (x, y, speed) {
  Enemy.call(this, x, y, speed);
  this.speed = speed * this.step.x;
  this.sprite = 'images/hatch-left.png';
};
Sedan.prototype = Object.create(Enemy.prototype);
Sedan.prototype.constructor = Sedan;

/**
* Update the sedans x position, sedans travel right ot left
* if the sedan goes out of bounds, reset it to the appropriate position
* @param {number} - a time delta to smooth animatino across devices
* @param {object} bounds - x and y boundaries for the enemy ( in grid units)
*/
Sedan.prototype.update = function(dt, bounds) {
  this.start = ( bounds.x[1] + 1 ) * this.step.x;
  if (this.x < bounds.x[0] - this.step.x) {
    this.x = this.start;
  } else {
    this.x = this.x + ( this.speed * dt );
  }
};


/**
* A Coupe type enemy
* @constructor
* @extends enemy
* @param {number} x - starting x position in grid units
* @param {number} y - starting y position in grid units
* @param {number} speed - speed in grid units
*/
var Coupe = function ( x, y, speed ){
  Enemy.call(this, x, y, speed);
  this.sprite = 'images/coupe.png';
  this.speed = speed * this.step.x;
  this.width = 126;
};
Coupe.prototype = Object.create(Enemy.prototype);
Coupe.prototype.constructor = Coupe;


/**
* A Van type enemy
* @constructor
* @extends enemy
* @param {number} x - starting x position in grid units
* @param {number} y - starting y position in grid units
* @param {number} speed - speed in grid units
*/
var Van = function ( x, y, speed ){
  Enemy.call(this, x, y, speed);
  this.sprite = 'images/van.png';
  this.speed = speed * this.step.x;
  this.width = 126;
};
Van.prototype = Object.create(Enemy.prototype);
Van.prototype.constructor = Van;

/**
* Update the vans x position, vans travel right ot left
* if the van goes out of bounds, reset it to the appropriate position
* @param {number} - a time delta to smooth animatino across devices
* @param {object} bounds - x and y boundaries for the enemy ( in grid units)
*/
Van.prototype.update = function(dt, bounds) {
  this.start = ( bounds.x[1] ) * this.step.x;
  if (this.x < bounds.x[0] - ( this.width + 202 )) {
    this.x = this.start;
  } else {
    this.x = this.x + ( this.speed * dt );
  }
};

/**
* A Semi type enemy
* @constructor
* @extends enemy
* @param {number} x - starting x position in grid units
* @param {number} y - starting y position in grid units
* @param {number} speed - speed in grid units
*/
var Semi = function ( x, y, speed ){
  Enemy.call(this, x, y, speed);
  this.sprite = this.randomColor('semi');
  this.speed = speed * this.step.x;
  this.width = 238;
  this.hitOffset.x = 5;
};
Semi.prototype = Object.create(Enemy.prototype);
Semi.prototype.constructor = Semi;

/**
* Update the semi's x position.
* if the semi goes out of bounds, reset it to the appropriate position
*
* @param {number} - a time delta to smooth animatino across devices
* @param {object} bounds - x and y boundaries for the enemy ( in grid units)
*/
Semi.prototype.update = function(dt, bounds) {
  if (this.x > (this.step.x * bounds.x[1])) {
    this.x = this.start - this.width;
  } else {
    this.x = this.x + ( this.speed * dt );
  }
};

/**
* Randomly choose a differently color sprite
* @param {string} - the base name for the associated sprite e.g. 'semi'
* @returns {string} - A string referencing a one of the semi sprites
*/
Semi.prototype.randomColor = function (baseName) {
  var pick = Math.floor((Math.random() * 3) + 1);
  var output = 'images/' + baseName + pick.toString() + '.png'
  return output;
};


/**
* A reverse semi type enemy
* @constructor
* @extends Semi
* @param {number} x - starting x position in grid units
* @param {number} y - starting y position in grid units
* @param {number} speed - speed in grid units
*/
var SemiReverse = function ( x, y, speed ){
  Semi.call(this, x, y, speed);
  this.sprite = this.randomColor('semi-reverse');
  this.hitOffset.x = 58;
};
SemiReverse.prototype = Object.create(Semi.prototype);
SemiReverse.prototype.constructor = SemiReverse;

/**
* Update the semi's x position.
* if the semi goes out of bounds, reset it to the appropriate position
*
* @param {number} - a time delta to smooth animatino across devices
* @param {object} bounds - x and y boundaries for the enemy ( in grid units)
*/
SemiReverse.prototype.update = function(dt, bounds) {
  this.start = ( bounds.x[1] ) * this.step.x;
  if (this.x < bounds.x[0] - ( this.width + 202 )) {
    this.x = this.start;
  } else {
    this.x = this.x + ( this.speed * dt );
  }
};

/**
* Player character object
* @constructor
* @extends Entity
* @param {number} x - starting x position ( in grid units )
* @param {number} y - starting y position ( in grid units )
*/
var Player = function (x,y) {
    Entity.call(this);
    this.lives = 3;
    this.x = x;
    this.y = y;
    this.hitOffset = {x: 21, y: 51};
    this.hasCoffee = 0; // does the player have a coffee?
    this.gotCoffees = 0; // how many has he collected this day?
    this.sprite = 'images/man.png';
    this.bounds = game.map.bounds;
    this.actions = {
      'up':  function() {
        this.y = this.checkBounds(this.y - this.step.y, this.bounds.y, this.step.y, this.y);
      },
      'right': function() {
        this.x = this.checkBounds(this.x + this.step.x, this.bounds.x, this.step.x, this.x);
      },
      'down': function() {
        this.y = this.checkBounds(this.y + this.step.y, this.bounds.y, this.step.y, this.y);
      },
      'left': function() {
        this.x = this.checkBounds(this.x - this.step.x, this.bounds.x, this.step.x, this.x);
      }
    };
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;


/**
* Not currently used.
* @param {number} - a time delta to smooth animatino across devices
*/
Player.prototype.update = function(dt) {
  this.x = this.x;
};


/**
* Determine whether or not the player is allowed to move to a given square
* @param {number} action - the position to check again
* @param {object} bounds - the players defined boundaries
* @param { number } step - how much to move ( in pixels )
* @param { number } axis - the current position on an axis
*/
Player.prototype.checkBounds = function (action, bound, step, axis) {
  if ( action >= bound[0] * step && action < bound[1] * step  ) {
    return action;
  } else {
    return axis;
  }
};


/**
* Converts key presses into movements
* @param {string} key - the string representing the key which was pressed
*/
Player.prototype.handleInput = function (key) {
  if (game.state.checkMode() == 'play') {
    this.actions[key].call(this);
  }
};


/**
* Kills the player, removes his coffees, resets the coffee timer, and resets the
* stage.
* If the player is out of lives, we also triggers game over.
*/
Player.prototype.die = function() {
  if ( this.lives > 1 ) {
    this.lives = this.lives -1;
    game.resetStage();
    this.hasCoffee = 0;
    game.state.resetCoffeeTimer();
    //this.reset(game.map.startPoint);
  } else {
    this.lives = this.lives -1;
    game.resetStage();
    //this.reset(game.map.startPoint);
    game.state.setMode('over');
    game.playAudio('sounds/trombone.mp3');
    game.playAudio('sounds/boo.mp3');
    this.hasCoffee = 0;
    game.state.resetCoffeeTimer();
  }
};


/**
* Reset the player to their starting position
* param {object} startPoint - an object containing x and y cordinates (px) representing the maps staring point
*/
Player.prototype.reset = function(startPoint) {
  this.x = startPoint.x;
  this.y = startPoint.y;
};


/**
* A Spatial Hash Object
* @constructor
*
* A spatial hash containing list of entities and their position within
* the spatial grid.
*
* @param {number} cellSize - how large each grid unit should be (px)
*/
var EntityHash = function (cellSize) {
  this.idx = {}; // an index for our cells
  this.cellSize = cellSize;
};


/**
* If a cell exists, inserts key into that cell, else create cell then insert
* @param {number} x - entities x coordinate (px)
* @param {number} y - entities y coordinate (px)
* @param {object} obj the entity you are inserting
*/
EntityHash.prototype.insert = function ( x, y, obj) {
  var cell = [];
  var keys = this.keys(x,y);
  for( var i in keys ) {
    var key = keys[i];
    if(key in this.idx) {
      cell = this.idx[key];
    } else {
      this.idx[key] = cell;
    }
    if(cell.indexOf(obj) == -1) {
      cell.push(obj);
    }
  }
};


/**
* Empty the index, remove all buckets and thus all keys
*/
EntityHash.prototype.clear = function() {
  this.idx = {};
};


/**
* Creates a key from coords and searches the index for it.
* @returns {array} an array of objects within the cell
* @returns {array} an empty array.
* @param {number} x - x coords in px
* @param {number} y - y coords in px
*/
EntityHash.prototype.query = function(x,y) {
  var key = this.key(x,y);
  if(this.idx[key] !== undefined) {
    return this.idx[key];
  }
  return [];
};


/**
* Generates keys based on coords which determine the cell an object
* gets place into.
* @param {number} x - x coords in px
* @param {number} y - y coords in px
* @return {array} an array of keys
*/
EntityHash.prototype.keys = function(x,y) {
  var o = this.cellSize / 2;
  return [
  this.key(x-o, y+0),
  this.key(x-0, y+0),
  this.key(x+o, y+0),
  this.key(x-o, y+o),
  this.key(x-0, y+o),
  this.key(x+o, y+o),
  this.key(x-o, y-o),
  this.key(x-0, y-o),
  this.key(x+o, y-o)
  ];
};

/**
* Generates keys based on coords which determine the cell an object
* gets place into.
* @param {number} x - x coords in px
* @param {number} y - y coords in px
* @return {string} x : y
*/
EntityHash.prototype.key = function(x,y) {
  var cellSize = this.cellSize;
  x = Math.floor(x/cellSize)*cellSize;
  y = Math.floor(y/cellSize)*cellSize;
  return x.toString() + ':' + y.toString();
};


/**
* Debounce as taken from underscore
* http://snippetrepo.com/snippets/basic-vanilla-javascript-throttlingdebounce
* rate limits a repeating event.
*/
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}


/**
* Moves buttons into position based on the width & height of the canvas element.
* Also set the canvas height to window.innerHeight here, so its always as large as
* it can be viewed.
*/
var buttonPosition = debounce(function(){
  var canvas = document.getElementById('canvas');
  canvas.style.height = window.innerHeight + 'px';
  var bounds = canvas.getBoundingClientRect();
  var btns = document.getElementsByClassName('btn');
  for( i = 0, l = btns.length; i < l; i++) {
    btns[i].style.left = (bounds.left + ((bounds.width - 150) / 2)) + 'px';
    btns[i].style.top = (bounds.top + ((bounds.height - 40) / 1.75)) + 'px';
  }
});

/**
* Binds the button position function to resize
*/
window.addEventListener('resize', buttonPosition, true);


/**
* You made this, not me, but it listens for keyup events and then sends
* an associated string to the game.player.handleInput() function.
* I think originally this referenced a player instance directly.
*/
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  game.player.handleInput(allowedKeys[e.keyCode]);
});
