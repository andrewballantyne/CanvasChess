/**
 * CanvasChess
 *  > The Canvas Chess Launching Point
 *
 * Created by Andrew on 14/10/14.
 *
 * @requires ClassVehicle
 * @extends ChessListener
 */
var CanvasChess = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_CanvasChess, SuperClass, isAbstract);

  /* ----- Static Variables ----- */
  _CanvasChess.PLAYER_WHITE = "w";
  _CanvasChess.PLAYER_BLACK = "b";
  _CanvasChess.PLAYER_BOTH = "both";
  _CanvasChess.PLAYER_NONE = "none";
  _CanvasChess.bottomPlayer = _CanvasChess.PLAYER_WHITE;
  _CanvasChess.currentPlayerTurn = _CanvasChess.PLAYER_WHITE;

  _CanvasChess.colorScheme = {
    darkSquareColor: 'black',
    lightSquareColor: 'white',
    pieceHighlightColor: 'rgba(255, 127, 0, .9)',
    availableMoveSquareColor: 'rgba(51, 255, 51, .4)'
  };

  _CanvasChess.isMobile = (/iPhone|iPod|iPad|Android|BlackBerry|Windows Phone/).test(navigator.userAgent);

  /**
   * @constructor
   *
   * @param containerId {string} - The id for the container in which to render the CanvasChess into
   * @param options {Object?} - Optional. List of options to configure the base operation
   */
  function CanvasChessConstructor(containerId, options) {
    _createCanvas.call(this, containerId);
    this._startupOptions = options;
    _parseOptions.call(this, options);

    _setupListeners.call(this);

    _loadAssets.call(this);
  }

  /* ----- Public Variables ----- */

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  _CanvasChess.prototype.rotate = function () {
    CanvasChess.bottomPlayer =
      (CanvasChess.bottomPlayer === CanvasChess.PLAYER_WHITE) ?
        CanvasChess.PLAYER_BLACK :
        CanvasChess.PLAYER_WHITE;
    this._board.updateSideLength(_getLength.call(this));
  };
  _CanvasChess.prototype.resetBoard = function () {
    if (this._endingScreen !== null) {
      // Hide the game ending screen
      this._endingScreen.hide();
    }
    // Reset the options
    _parseOptions.call(this, this._startupOptions);
    // Update for a reset
    this._model.reset();
    // Update the PlayerText
    _updatePlayerTurnText.call(this);
    // Trigger the game start event, since we are resetting
    this.$triggerEvent('onGameStart', []);
  };

  _CanvasChess.prototype.clearBoard = function () {
    // Update for a clear
    this._model.clear();

    // Update the PlayerText
    _updatePlayerTurnText.call(this);
  };

  _CanvasChess.prototype.history = function () {
    return this._model.history();
  };

  _CanvasChess.prototype.randomMove = function () {
    var moveIndex = Math.floor(Math.random() * this._model.moves().length);
    var move = this._model.moves({verbose: true})[moveIndex];
    this.move({from: move.from, to: move.to});
  };

  _CanvasChess.prototype.move = function (move) {
    // Update the move
    var moveDetails = this._model.move(move);
    // Update the PlayerText
    _updatePlayerTurnText.call(this);
    // Trigger the move event
    this.$triggerEvent('onPlayerMove', [{move: moveDetails}]);
    // Check to see if we need to update the graveyard
    if (moveDetails !== null && moveDetails.captured !== undefined) {
      // TODO: add to graveyard
    }
    // Validate to see if this move ended the game
    if (this.isGameOver()) {
      // Show the game over text
      var causeOfGameEnd = _getGameOverCause.call(this);
      _showGameOverText.call(this, causeOfGameEnd);
      // Trigger the game ending event
      this.$triggerEvent('onGameEnd', [{cause: causeOfGameEnd}]);
    }
    return moveDetails;
  };

  _CanvasChess.prototype.getMoves = function (gridCoordinate) {
    return this._model.moves({square: gridCoordinate});
  };

  _CanvasChess.prototype.getFenString = function () {
    var fen = this._model.fen();
    if (this._board !== null) {
      this._board.useFen(fen);
    }
    return fen;
  };

  _CanvasChess.prototype.setFenString = function (newFen) {
    var validate = this._model.validate_fen(newFen);
    if (validate.valid) {
      if (this._board !== null) {
        this._board.useFen(newFen);
      }
      var successfulSet = this._model.load(newFen);
      _updatePlayerTurnText.call(this);
      return successfulSet;
    } else {
      return this._model.fen();
    }
  };

  _CanvasChess.prototype.isGameOver = function() {
    return this._model.game_over();
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  // Model
  _CanvasChess.prototype._model = new Chess();

  // Options
  _CanvasChess.prototype._startupOptions = null;
  _CanvasChess.prototype._demoMode = false;
  _CanvasChess.prototype._pieceURL = null;
  _CanvasChess.prototype._canPlay = _CanvasChess.PLAYER_BOTH; // by default they can move pieces from either colour

  // Class Variables
  _CanvasChess.prototype._players = {
    'w' : {
      'label' : 'White\'s Turn'
    },
    'b' : {
      'label' : 'Black\'s Turn'
    }
  };
  _CanvasChess.prototype._savedClientHeight = 0;
  _CanvasChess.prototype._savedClientWidth = 0;

  // DOM
  _CanvasChess.prototype._canvasId = 'canvasChess';
  /** @type DOMElement **/
  _CanvasChess.prototype._canvasTag = null;
  /** @type DOMElement **/
  _CanvasChess.prototype._containerTag = null;
  _CanvasChess.prototype._containerHasFixedHeight = false;
  _CanvasChess.prototype._canvasBorderBuffer = 15;
  _CanvasChess.prototype._playerTextYOffset = 20;

  // Canvas
  /** @type createjs.Stage **/
  _CanvasChess.prototype._stage = null;
  /** @type ChessBoard **/
  _CanvasChess.prototype._board = null;
  /** @type ActivePlayerBanner **/
  _CanvasChess.prototype._activePlayerBanner = null;
  /** @type ChessEndingScreen **/
  _CanvasChess.prototype._endingScreen = null;

  /* ----- Private Methods ----- */
  /**
   * @private
   * @param containerId {string} - The id for the container in which to render the CanvasChess into
   */
  function _createCanvas(containerId) {
    this._containerTag = document.getElementById(containerId);
    // If we have a fixed height (something in the style/css classes) we need to know that; if not, we have to do special calculations
    this._containerHasFixedHeight = this._containerTag.offsetHeight > 0;

    this._canvasTag = document.createElement('canvas');
    this._canvasTag.id = this._canvasId;

    _calculateSize.call(this);

    this._containerTag.appendChild(this._canvasTag);

    var stage = new createjs.Stage(this._canvasId);
    this._stage = stage;

    createjs.Ticker.on('tick', function () {
      stage.update();
    });
  }

  function _calculateSize() {
    var docHeight = document.documentElement.clientHeight;
    var docWidth = document.documentElement.clientWidth;
    if (this._savedClientHeight === docHeight && this._savedClientWidth === docWidth) {
      // Let's not update if we are still dealing with the same viewport size (mobile scrolling will introduce new interesting things)
      return;
    }
    this._savedClientHeight = docHeight;
    this._savedClientWidth = docWidth;

    var width = this._containerTag.offsetWidth;
    var height;
    if (this._containerHasFixedHeight) {
      // Container has a fixed height, let's use it
      height = this._containerTag.offsetHeight;
    } else {
      // No Fixed height, a common DOM situation, as the container does not have a set height and will expand as content fills it.
      // Since we need a height, let's do some quick calculations based on the window size and the location of the container from
      // the top
      height = this._savedClientHeight - (this._containerTag.getBoundingClientRect().top + window.scrollY) * 2;
      // (above) * 2: one for the top offset + one as a bottom buffer
    }
    if (window.devicePixelRatio !== 1) { // quality degrades if you apply an equal width/height to the style that is used in the attributes
      this._canvasTag.width = width * window.devicePixelRatio;
      this._canvasTag.height = height * window.devicePixelRatio;
      this._canvasTag.style.width = width + 'px';
      this._canvasTag.style.height = height + 'px';
    } else {
      this._canvasTag.width = width;
      this._canvasTag.height = height;
    }
  }

  /**
   * @private
   * @param options {Object} - List of options to configure the base operation
   */
  function _parseOptions(options) {
    /* Demo Mode Option */
    this._demoMode = false;
    if (typeof options.demoMode === 'boolean') {
      this._demoMode = options.demoMode;
    }

    /* Enforce which side of the board the player plays */
    this._canPlay = _CanvasChess.PLAYER_BOTH;
    if (typeof options.canPlay === 'string') {
      // we ignore options other than 'white' or 'black'
      switch (options.canPlay) {
        case 'white' :
          this._canPlay = CanvasChess.PLAYER_WHITE;
          break;

        case 'black' :
          this._canPlay = CanvasChess.PLAYER_BLACK;
          break;
      }
    }

    /* Theme Options */
    this._pieceURL = 'assets/sprites/pieces/Chess_Pieces_Sprite.svg';
    if (typeof options.theme === 'object') {
      if (typeof options.theme.piecesUrl === 'string') {
        this._pieceURL = options.theme.piecesUrl;
      }
      if (typeof options.theme.lightSquareColor === 'string') {
        CanvasChess.colorScheme.lightSquareColor = options.theme.lightSquareColor;
      }
      if (typeof options.theme.darkSquareColor === 'string') {
        CanvasChess.colorScheme.darkSquareColor = options.theme.darkSquareColor;
      }
      if (typeof options.theme.pieceHighlightColor === 'string') {
        CanvasChess.colorScheme.pieceHighlightColor = options.theme.pieceHighlightColor;
      }
      if (typeof options.theme.availableMovesColor === 'string') {
        CanvasChess.colorScheme.availableMoveSquareColor = options.theme.availableMovesColor;
      }
    }

    /* Game Options */
    if (typeof options.position === 'string') {
      this.setFenString(options.position);
      CanvasChess.currentPlayerTurn = this._model.turn();
    }

    /* Players Options */
    // TODO: Support player.name?

    /* Events */
    if (typeof options.events === 'object') {
      for (var eventName in options.events) {
        if (!options.events.hasOwnProperty(eventName)) continue;
        var eventCallback = options.events[eventName];
        if (typeof eventCallback !== 'function') continue; // we only want methods
        this.registerCallbackEvent(eventName, eventCallback);
      }
    }
  }

  function _setupListeners() {
    var _this = this;

    /* Page Resize / Orientation Change */
    window.addEventListener('resize', function (e) {
      setTimeout(function () {
        _calculateSize.call(_this, e);

        _updateLocations.call(_this);
      }, 0);
    });

    /* Touches/Clicks */
    var isDown = false;
    var inputDown = function (e) {
      _this._endingScreen.hide();
      if (CanvasChess.currentPlayerTurn !== _this._canPlay) return;

      var loc = _convertToXY.call(_this, e);
      isDown = _this._board.inputDown(loc);
    };
    var inputMove = function (e) {
      if (!isDown) return; // we don't care about moves outside of drags

      var loc = _convertToXY.call(_this, e);
      if (_this._board.isWithin(loc)) {
//        console.log("Moving around inside the board");
      }

      if (CanvasChess.isMobile) {
        // TODO: Only suppress page scrolling when we have an action to do
        e.preventDefault(); // prevents page scrolling (touch)
      }
    };
    var inputUp = function (e) {
      isDown = false;

      var loc = _convertToXY.call(_this, e);
      if (_this._board.isWithin(loc)) {
//        console.log("Lifting up inside the board");
      }
    };

    if (CanvasChess.isMobile) {
      this._canvasTag.addEventListener('touchstart', inputDown);
      this._canvasTag.addEventListener('touchmove', inputMove);
      this._canvasTag.addEventListener('touchend', inputUp);
    } else {
      this._canvasTag.addEventListener('mousedown', inputDown);
      this._canvasTag.addEventListener('mousemove', inputMove);
      this._canvasTag.addEventListener('mouseup', inputUp);
    }
  }

  /**
   * @private
   * @param e {Event} - The input event
   * @returns {createjs.Point} - The point of the input (parsed for mouse and touch)
   */
  function _convertToXY(e) {
    var x, y;
    if (CanvasChess.isMobile) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;

      // Adjust to a local touch x/y
      var offsetRect = this._containerTag.getBoundingClientRect();
      x -= offsetRect.left;
      y -= offsetRect.top;
    } else {
      x = e.offsetX;
      y = e.offsetY;
    }

    // Adjust for the device pixel ratio
    x *= window.devicePixelRatio;
    y *= window.devicePixelRatio;

    return new createjs.Point(x, y);
  }

  function _loadAssets() {
    var _this = this;

    var pieces = new Image();
    pieces.src = this._pieceURL;
    pieces.onload = function () {
      var data = {
        images: [this],
        frames: [
          [0, 0, 45, 45, 0, 22, 22],
          [45, 0, 45, 45, 0, 22, 22],
          [90, 0, 45, 45, 0, 22, 22],
          [135, 0, 45, 45, 0, 22, 22],
          [180, 0, 45, 45, 0, 22, 22],
          [225, 0, 45, 45, 0, 22, 22],

          [0, 45, 45, 45, 0, 22, 22],
          [45, 45, 45, 45, 0, 22, 22],
          [90, 45, 45, 45, 0, 22, 22],
          [135, 45, 45, 45, 0, 22, 22],
          [180, 45, 45, 45, 0, 22, 22],
          [225, 45, 45, 45, 0, 22, 22]
        ],
        animations: {
          // White
          "K": { frames: [0] },
          "Q": { frames: [1] },
          "B": { frames: [2] },
          "N": { frames: [3] },
          "R": { frames: [4] },
          "P": { frames: [5] },

          // Black
          "k": { frames: [6] },
          "q": { frames: [7] },
          "b": { frames: [8] },
          "n": { frames: [9] },
          "r": { frames: [10] },
          "p": { frames: [11] }
        }
      };
      var ss = new createjs.SpriteSheet(data);

      // Now that we have the image loaded, let's create the assets that use it
      _renderFunction.call(_this, ss);
    };
  }

  /**
   * @private
   * @param ss {createjs.SpriteSheet} - The SpriteSheet for the pieces
   */
  function _renderFunction(ss) {
    var sideLength = _getLength.call(this);

    // Create the Board
    this._board = new ChessBoard(sideLength, ss, this);
    this._stage.addChild(this._board);

    // Set the board to use the current fen
    this._board.useFen(this._model.fen());

    // Create the Player's Turn Banner
    this._activePlayerBanner = new ActivePlayerBanner(sideLength, this._players, CanvasChess.currentPlayerTurn);
    this._stage.addChild(this._activePlayerBanner);

    // Create the Ending Screen
    this._endingScreen = new ChessEndingScreen(sideLength - (sideLength / 10 * 2));
    this._endingScreen.hide();
    this._stage.addChild(this._endingScreen);

    _updateLocations.call(this, false);

    // Start Game
    this.$triggerEvent('onGameStart', []);
  }

  /**
   * @private
   * @param updateInternally {boolean?} - True to update each item internally based on the new location and size; false to just update
   *  the location
   */
  function _updateLocations(updateInternally) {
    if (updateInternally === undefined) updateInternally = true;
    var sideLength = _getLength.call(this);

    this._board.regX = sideLength / 2;
    this._board.regY = sideLength / 2;
    this._board.x = this._canvasBorderBuffer + sideLength / 2;
    this._board.y = (this._canvasBorderBuffer * 2) + sideLength / 2;
    if (updateInternally) this._board.updateSideLength(sideLength);

    this._activePlayerBanner.x = this._board.x;
    this._activePlayerBanner.y = this._playerTextYOffset;
    if (updateInternally) this._activePlayerBanner.updateForNewCanvasSize(sideLength);

    this._endingScreen.x = this._canvasBorderBuffer + sideLength / 10;
    this._endingScreen.y = this._canvasBorderBuffer * 2 + sideLength / 10;
    if (updateInternally) this._endingScreen.resize(sideLength - (sideLength / 10 * 2));
  }

  function _updatePlayerTurnText() {
    CanvasChess.currentPlayerTurn = this._model.turn();
    if (this._activePlayerBanner !== null) {
      this._activePlayerBanner.changePlayer(CanvasChess.currentPlayerTurn);
    }
  }

  function _getLength() {
    return Math.min(
      this._canvasTag.height - this._canvasBorderBuffer * 2 - this._playerTextYOffset,  // *2 = top/bottom
      this._canvasTag.width - this._canvasBorderBuffer * 2                              // *2 = top/bottom
    );
  }

  /**
   * @private
   * @param reasonForGameEnd {string} - The reason for game end (@see _getGameOverCause)
   */
  function _showGameOverText(reasonForGameEnd) {
    // Handle the auto switching of players (we want the last to play)
    var lastToPlay = (CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE) ? CanvasChess.PLAYER_BLACK : CanvasChess.PLAYER_WHITE;

    this._endingScreen.show(reasonForGameEnd, lastToPlay);
    this._canPlay = CanvasChess.PLAYER_NONE;
  }

  function _getGameOverCause() {
    var reason = null;
    if (this._model.in_checkmate()) {
      reason = ChessEndingScreen.ENDING_TYPES.CHECKMATE;
    } else if (this._model.in_stalemate()) {
      reason = ChessEndingScreen.ENDING_TYPES.STALEMATE;
    } else if (this._model.in_draw()) {
      reason = ChessEndingScreen.ENDING_TYPES.DRAW;
    }

    return reason;
  }

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _CanvasChess() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _CanvasChess);

    /* Call constructor */
    CanvasChessConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _CanvasChess;
})(ChessListener, false);
