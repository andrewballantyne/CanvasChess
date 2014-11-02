/**
 * ChessPromotionSelector extends createjs.Container
 *  > A Chess Pawn Promotion Selector window that will allow you to pick a piece to take when a pawn reaches the other side.
 *
 * Created by Andrew on 22/10/14.
 *
 * @requires ClassVehicle
 * @extends BoundingBoxContainer
 */
var ChessPromotionSelector = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessPromotionSelector, SuperClass, isAbstract);

  /**
   * @constructor
   *
   * @param ss {createjs.SpriteSheet} - The piece SpriteSheet
   * @param squareSize {number} - The size of a side on a single square of the chess grid
   * @param pieceScale {number} - The scale in which to size a piece to
   */
  function ChessPromotionSelectorConstructor(ss, squareSize, pieceScale) {
    SuperClass.call(this); // super call

    this._PIECE_SCALE = pieceScale;
    this._ss = ss;
    this._squareSize = squareSize;
    this.width = squareSize * 4 * 1.5;
    this.height = squareSize * 2;

    _drawBackground.call(this);
  }

  /* ----- Public Variables ----- */

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  /**
   * @override
   * Checks if within the ChessGrid.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {boolean} - True if within, false if not
   */
  _ChessPromotionSelector.prototype.isWithin = function (inputPoint) {
    var xy = this.$getXY();
    return this.$checkRect(inputPoint, xy.x, xy.y, this.width, this.height);
  };
  /**
   * @override
   * Check for an option selection within the Chess Promotion Window.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {string} - The
   */
  _ChessPromotionSelector.prototype.checkForSelection = function (inputPoint) {
    if (!SuperClass.prototype.inputDown.call(this, inputPoint)) return null;

    // Get local to the grid
    var localPoint = this.$convertToLocal.call(this, inputPoint);

    // Loop the contents of the Promotion Selection Window to see if any piece was selected
    for (var i = 0; i < this._contents.children.length; i++) {
      var content = this._contents.children[i];
      if (!(content instanceof ChessPiece)) continue; // we don't need anything but the pieces

      // Get the local x/y to the piece
      var x = localPoint.x - content.x;
      var y = localPoint.y - content.y;
      if (content.hitTest(x, y)) { // are we within this piece?
        return content.type; // return the symbol of the piece
      }
    }

    return null;
  };
  /**
   * Show the Promotion Selector for the current player.
   */
  _ChessPromotionSelector.prototype.show = function () {
    _createOptions.call(this, CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE);
    this.visible = true;
  };
  /**
   * Hide the Promotion Selector
   */
  _ChessPromotionSelector.prototype.hide = function () {
    this.visible = false;
  };
  /**
   * Is the Promotion Selector visible?
   *
   * @returns {boolean} - True if the Promotion Selector is visible; False if hidden
   */
  _ChessPromotionSelector.prototype.isShowing = function () {
    return this.visible;
  };
  /**
   * Update the Promotion Window to a new size
   *
   * @param squareSize {number} - The size of a single square on the grid
   */
  _ChessPromotionSelector.prototype.updateSize = function (squareSize) {
    this._squareSize = squareSize;
    this.width = squareSize * 4 * 1.5;
    this.height = squareSize * 2;

    _drawBackground.call(this);
    _createOptions.call(this, CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE);
  };

  /* ----- Protected Methods ----- */
  /**
   * Convert the passed input point into a local point.
   *
   * @param inputPoint {createjs.Point} - The input point
   * @returns {createjs.Point} - The local point
   */
  _ChessPromotionSelector.prototype.$convertToLocal = function (inputPoint) {
    var newInputPoint = SuperClass.prototype.$convertToLocal.call(this, inputPoint);

    var xy = this.$getXY(); // corrects for regX/regY
    newInputPoint.x -= xy.x;
    newInputPoint.y -= xy.y;

    return newInputPoint;
  };

  /* ----- Private Variables ----- */
  /** @type createjs.Shape **/
  _ChessPromotionSelector.prototype._background = null;
  /** @type createjs.Container **/
  _ChessPromotionSelector.prototype._contents = null;

  /* ----- Private Methods ----- */
  function _drawBackground() {
    if (this._background === null) {
      this._background = new createjs.Shape();
      this.addChild(this._background);
      this._background.shadow = new createjs.Shadow('black', 0, 0, 20);
    } else {
      this._background.graphics.clear();
    }
    this._background.graphics.beginFill('white').drawRoundRect(0, 0, this.width, this.height, 15);
  }

  /**
   * @private
   * Create options for white or black depending on what is passed in.
   *
   * @param displayWhite {boolean} - True if we are to display white pieces; false to display black
   */
  function _createOptions(displayWhite) {
    if (this._contents === null) {
      this._contents = new createjs.Container();
      this.addChild(this._contents);
    } else {
      this._contents.removeAllChildren();
    }

    var hSpacing = this.width / 5;
    var vSpacing = this.height / 3 * 2;

    var letters = (displayWhite) ? ['N', 'B', 'R', 'Q'] : ['n', 'b', 'r', 'q'];

    var knightOption = new ChessPiece(this._ss, letters[0], {});
    knightOption.x = hSpacing;
    knightOption.y = vSpacing;
    knightOption.scaleX = knightOption.scaleY = this._squareSize / this._PIECE_SCALE;
    this._contents.addChild(knightOption);

    var bishopOption = new ChessPiece(this._ss, letters[1], {});
    bishopOption.x = hSpacing * 2;
    bishopOption.y = vSpacing;
    bishopOption.scaleX = bishopOption.scaleY = this._squareSize / this._PIECE_SCALE;
    this._contents.addChild(bishopOption);

    var rookOption = new ChessPiece(this._ss, letters[2], {});
    rookOption.x = hSpacing * 3;
    rookOption.y = vSpacing;
    rookOption.scaleX = rookOption.scaleY = this._squareSize / this._PIECE_SCALE;
    this._contents.addChild(rookOption);

    var queenOption = new ChessPiece(this._ss, letters[3], {});
    queenOption.x = hSpacing * 4;
    queenOption.y = vSpacing;
    queenOption.scaleX = queenOption.scaleY = this._squareSize / this._PIECE_SCALE;
    this._contents.addChild(queenOption);

    var text = new createjs.Text('Promotion', 'bold ' + (this._squareSize / 2.5) + 'px Arial', 'black');
    text.regX = text.getMeasuredWidth() / 2;
    text.regY = text.getMeasuredLineHeight() / 2;
    text.x = this.width / 2;
    text.y = vSpacing / 3;
    this._contents.addChild(text);
  }

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ChessPromotionSelector() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ChessPromotionSelector);

    /* Call constructor */
    ChessPromotionSelectorConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ChessPromotionSelector;
})(BoundingBoxContainer, false);