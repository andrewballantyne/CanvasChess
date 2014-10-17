/**
 * CanvasChess
 *  > The Canvas Chess Launching Point
 *
 * Created by Andrew on 14/10/14.
 *
 * @requires ClassVehicle
 */
var CanvasChess = (function (isAbstract) {
  /* Setup Class Defaults */
  ClassVehicle.setupClass(_CanvasChess, isAbstract);

  /* ----- Static Variables ----- */
  _CanvasChess.PLAYER_WHITE = "w";
  _CanvasChess.PLAYER_BLACK = "b";
  _CanvasChess.bottomPlayer = _CanvasChess.PLAYER_WHITE;

  /**
   * @constructor
   *
   * @param containerId {string} - The id for the container in which to render the CanvasChess into
   * @param options {Object?} - Optional. List of options to configure the base operation
   */
  function CanvasChessConstructor(containerId, options) {
    _createCanvas.call(this, containerId);
    _parseOptions.call(this, options);

    _setupResizeListener.call(this);

    _loadAssets.call(this);
  }

  /* ----- Public Variables ----- */

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  _CanvasChess.prototype.resetBoard = function () {
    return this._model.reset();
  };

  _CanvasChess.prototype.clearBoard = function () {
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
        this._moves.push({white: history[i], black: ''});
      } else {
        this._moves.push({white: history[i], black: history[i + 1]});
        i++;
      }
    }
    return this._moves;
  };

  _CanvasChess.prototype.randomMove = function () {
    var moveIndex = Math.floor(Math.random() * this._model.moves().length);
    this.move(this._model.moves()[moveIndex]);
  };

  _CanvasChess.prototype.move = function (move) {
    delete this._moves;
    return this._model.move(move);
  };

  _CanvasChess.prototype.getFenString = function () {
    return this._model.fen();
  };

  _CanvasChess.prototype.setFenString = function (newFen) {
    var validate = this._model.validate_fen(newFen);
    console.log(validate);
    if (validate.valid) {
      return this._model.load(newFen);
    } else {
      return null;
    }
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  // Model
  _CanvasChess.prototype._model = new Chess();

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
   * @param containerId {string} - The id for the container in which to render the CanvasChess into
   * @private
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
    var width = this._containerTag.offsetWidth;
    var height;
    if (this._containerHasFixedHeight) {
      // Container has a fixed height, let's use it
      height = this._containerTag.offsetHeight;
    } else {
      // No Fixed height, a common DOM situation, as the container does not have a set height and will expand as content fills it.
      // Since we need a height, let's do some quick calculations based on the window size and the location of the container from
      // the top
      height = window.innerHeight - (this._containerTag.getBoundingClientRect().top * 2); // *2: for the top offset + a bottom buffer
    }
    this._canvasTag.width = width;
    this._canvasTag.height = height;
  }

  /**
   * @param options {Object} - List of options to configure the base operation
   * @private
   */
  function _parseOptions(options) {
    // Parse the options
  }

  function _setupResizeListener() {
    var _this = this;
    window.addEventListener('resize', function (e) {
      setTimeout(function () {
        _calculateSize.call(_this, e);

        _this._board.updateSideLength(_getLength.call(_this));
      }, 0);
    });
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
   * @param ss {createjs.SpriteSheet} - The SpriteSheet for the pieces
   * @private
   */
  function _renderFunction(ss) {
    this._board = new ChessBoard(_getLength.call(this), ss);
    this._board.regX = _getLength.call(this);
    this._board.x = this._canvasBorderBuffer + _getLength.call(this);
    this._board.y = this._canvasBorderBuffer;
    this._stage.addChild(this._board);
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
})(false);
