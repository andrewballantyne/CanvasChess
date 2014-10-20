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
  _CanvasChess.bottomPlayer = _CanvasChess.PLAYER_WHITE;
  _CanvasChess.currentPlayerTurn = _CanvasChess.PLAYER_WHITE;

  _CanvasChess.isMobile = (/iPhone|iPod|iPad|Android|BlackBerry|Windows Phone/).test(navigator.userAgent);

  /**
   * @constructor
   *
   * @param containerId {string} - The id for the container in which to render the CanvasChess into
   * @param options {Object?} - Optional. List of options to configure the base operation
   */
  function CanvasChessConstructor(containerId, options) {
    _createCanvas.call(this, containerId);
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
  	delete this._moves;
    return this._model.reset();
  };

  _CanvasChess.prototype.clearBoard = function () {
  	delete this._moves;
    return this._model.clear();
  };

  _CanvasChess.prototype.history = function () {
    if (this._moves) {
      return this._moves;
    }
    var history = this._model.history();
    this._moves = [];
    for (var i = 0; i < history.length; i++) {
      if (i === history.length - 1) {
        // white move
        this._moves.push({white: history[i], black: ''});
      } else {
        // black move
        this._moves.push({white: history[i], black: history[i + 1]});
        i++;
      }
    }
    return this._moves;
  };

  _CanvasChess.prototype.randomMove = function () {
    var moveIndex = Math.floor(Math.random() * this._model.moves().length);
    var move = this._model.moves({verbose: true})[moveIndex];
    this.move({from: move.from, to: move.to});
  };

  _CanvasChess.prototype.move = function (move) {
    _flipPlayer.call(this);
    delete this._moves;
    return this._model.move(move);
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
      return this._model.load(newFen);
    } else {
      return this._model.fen();
    }
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  // Model
  _CanvasChess.prototype._model = new Chess();

  // Class Variables
  _CanvasChess.prototype._players = null;
  _CanvasChess.prototype._savedClientHeight = 0;

  // DOM
  _CanvasChess.prototype._canvasId = 'canvasChess';
  /** @type DOMElement **/
  _CanvasChess.prototype._canvasTag = null;
  /** @type DOMElement **/
  _CanvasChess.prototype._containerTag = null;
  _CanvasChess.prototype._containerHasFixedHeight = false;
  _CanvasChess.prototype._canvasBorderBuffer = 15;

  // Canvas
  /** @type createjs.Stage **/
  _CanvasChess.prototype._stage = null;
  /** @type ChessBoard **/
  _CanvasChess.prototype._board = null;

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
    if (this._savedClientHeight === document.documentElement.clientHeight) {
      // Let's not update if we are still dealing with the same viewport height (mobile scrolling will introduce new interesting things)
      return;
    }
    this._savedClientHeight = document.documentElement.clientHeight;

    var width = this._containerTag.offsetWidth;
    var height;
    if (this._containerHasFixedHeight) {
      // Container has a fixed height, let's use it
      height = this._containerTag.offsetHeight;
    } else {
      // No Fixed height, a common DOM situation, as the container does not have a set height and will expand as content fills it.
      // Since we need a height, let's do some quick calculations based on the window size and the location of the container from
      // the top
      height = this._savedClientHeight - (this._containerTag.getBoundingClientRect().top * 2);
      // (above) * 2: one for the top offset + one as a bottom buffer
    }
    this._canvasTag.width = width;
    this._canvasTag.height = height;
  }

  /**
   * @private
   * @param options {Object} - List of options to configure the base operation
   */
  function _parseOptions(options) {
    // Parse the options

    /* Add the players */
    this._players = {
      'w' : {
        'label' : 'White Player\'s Turn'
      },
      'b' : {
        'label' : 'Black Player\'s Turn'
      }
    };
  }

  function _setupListeners() {
    var _this = this;

    /* Page Resize / Orientation Change */
    window.addEventListener('resize', function (e) {
      setTimeout(function () {
        _calculateSize.call(_this, e);

        _this._board.updateSideLength(_getLength.call(_this));
        _this._activePlayerBanner.updateForNewCanvasSize(_getLength.call(_this));
      }, 0);
    });

    /* Touches/Clicks */
    var isDown = false;
    var inputDown = function (e) {
      var loc = _convertToXY(e);
      isDown = _this._board.inputDown(loc);
    };
    var inputMove = function (e) {
      if (!isDown) return; // we don't care about moves outside of drags

      var loc = _convertToXY(e);
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

      var loc = _convertToXY(e);
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
      x = 0;
      y = 0;
    } else {
      x = e.offsetX;
      y = e.offsetY;
    }

    return new createjs.Point(x, y);
  }

  function _loadAssets() {
    var _this = this;

    var pieces = new Image();
    pieces.src = 'assets/sprites/pieces/Chess_Pieces_Sprite.svg';
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
    // Create the Board
    var sideLength = _getLength.call(this);
    this._board = new ChessBoard(sideLength, ss, this);
    this._board.regX = sideLength / 2;
    this._board.regY = sideLength / 2;
    this._board.x = this._canvasBorderBuffer + sideLength / 2;
    this._board.y = (this._canvasBorderBuffer * 2) + sideLength / 2;
    this._stage.addChild(this._board);

    // Set the board to use the current fen
    this._board.useFen(this._model.fen());

    // Create the Player's Turn Banner
    this._activePlayerBanner = new ActivePlayerBanner(sideLength, this._players, CanvasChess.currentPlayerTurn);
    this._activePlayerBanner.x = this._canvasBorderBuffer;
    this._activePlayerBanner.y = this._canvasBorderBuffer;
    this._stage.addChild(this._activePlayerBanner);
  }

  function _flipPlayer() {
    CanvasChess.currentPlayerTurn =
      (CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE) ?
        CanvasChess.PLAYER_BLACK :
        CanvasChess.PLAYER_WHITE;
    this._activePlayerBanner.changePlayer(CanvasChess.currentPlayerTurn);
  }

  function _getLength() {
    return Math.min(this._canvasTag.height - this._canvasBorderBuffer * 2, this._canvasTag.width - this._canvasBorderBuffer * 2);
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
