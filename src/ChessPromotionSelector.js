/**
 * ChessPromotionSelector extends createjs.Container
 *  > A Chess Pawn Promotion Selector window that will allow you to pick a piece to take when a pawn reaches the other side.
 *
 * Created by Andrew on 22/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var ChessPromotionSelector = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessPromotionSelector, SuperClass, isAbstract);

  /**
   * @constructor
   *
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
  _ChessPromotionSelector.prototype.height = 0;
  _ChessPromotionSelector.prototype.width = 0;

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  _ChessPromotionSelector.prototype.isWithin = function (inputPoint) {
    var xy = this.$getXY();
    return this.$checkRect(inputPoint, xy.x, xy.y, this.width, this.height);
  };
  _ChessPromotionSelector.prototype.checkForSelection = function (inputPoint) {
    if (!SuperClass.prototype.inputDown.call(this, inputPoint)) return null;

    // Get local to the grid
    var localPoint = this.$convertToLocal.call(this, inputPoint);

    for (var i = 0; i < this._contents.children.length; i++) {
      var content = this._contents.children[i];
      if (content instanceof createjs.Text) continue; // we don't need the text, only the pieces

      var x = localPoint.x - content.x;
      var y = localPoint.y - content.y;
      if (content.hitTest(x, y)) {
        console.log("Hit " + content.type);
        return content.type;
      }
    }

    return null;
  };
  _ChessPromotionSelector.prototype.show = function () {
    _createOptions.call(this, CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE);
    this.visible = true;
  };
  _ChessPromotionSelector.prototype.hide = function () {
    this.visible = false;
  };
  _ChessPromotionSelector.prototype.isShowing = function () {
    return this.visible;
  };
  _ChessPromotionSelector.prototype.updateSize = function (squareSize) {
    this._squareSize = squareSize;
    this.width = squareSize * 4 * 1.5;
    this.height = squareSize * 2;

    _drawBackground.call(this);
    _createOptions.call(this, CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE);
  };

  /* ----- Protected Methods ----- */
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