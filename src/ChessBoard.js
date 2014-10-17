/**
 * ChessBoard extends createjs.Container
 *  > The play area and labels for the Chess Board
 *
 * Created by Andrew on 14/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var ChessBoard = (function (ParentClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessBoard, ParentClass, isAbstract);

  /* ----- Static Variables ----- */
  _ChessBoard.letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  /**
   * @constructor
   *
   * @param sideLength {number} - All sides of the board have the same length
   * @param ss {createjs.SpriteSheet} - The SpriteSheet for the pieces
   */
  function ChessBoardConstructor(sideLength, ss) {
    ParentClass.call(this); // super call

    _calculateLength.call(this, sideLength);

    _renderLabels.call(this);
    _renderBoard.call(this, ss);
  }

  /* ----- Public Variables ----- */

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  _ChessBoard.prototype.updateSideLength = function (newLength) {
    _calculateLength.call(this, newLength);

    _renderLabels.call(this);
    _updateBoardLocation.call(this);
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  _ChessBoard.prototype._fullBoardSideLength = 0;
  _ChessBoard.prototype._gridCellSideLength = 0;

  /** @type createjs.Container **/
  _ChessBoard.prototype._labelContainer = null;
  /** @type ChessGrid **/
  _ChessBoard.prototype._boardGrid = null;

  /* ----- Private Methods ----- */
  function _getFontSize() {
    return this._gridCellSideLength / 2.5;
  }

  function _calculateLength(sideLength) {
    this._fullBoardSideLength = sideLength;
    this._gridCellSideLength = this._fullBoardSideLength / 10;
  }

  function _renderLabels() {
    if (this._labelContainer == null) {
      this._labelContainer = new createjs.Container();
      this.addChild(this._labelContainer);
    } else {
      // TODO: Perhaps it would be better to just update, rather than recreate...
      this._labelContainer.removeAllChildren();
    }

    var letters = ChessBoard.letters;
    var labelsPerSide = 8;
    var font = _getFontSize.call(this) + 'px Arial';
    var labelColor = 'black';
    // Loop the bisects (intersecting x and y)
    for (var num = 0; num < labelsPerSide; num++) {
      // Determine the letter and number for this bisect
      var letter = (CanvasChess.bottomPlayer == CanvasChess.PLAYER_WHITE) ? letters[num] : letters[letters.length - num - 1];
      var number = (CanvasChess.bottomPlayer == CanvasChess.PLAYER_WHITE) ? labelsPerSide - num : num + 1;

      /* Print Letters */
      var topText = new createjs.Text(letter, font, labelColor);
      topText.regX = topText.getMeasuredWidth() / 2;
      topText.regY = topText.getMeasuredLineHeight() / 2;
      topText.x = this._gridCellSideLength * (num + 1) + (this._gridCellSideLength / 2);
      topText.y = this._gridCellSideLength / 2;
      this._labelContainer.addChild(topText);

      var bottomText = topText.clone();
      bottomText.y = (this._gridCellSideLength * 9) + this._gridCellSideLength / 2;
      this._labelContainer.addChild(bottomText);

      /* Print Numbers */
      var leftText = new createjs.Text(number, font, labelColor);
      leftText.regX = leftText.getMeasuredWidth() / 2;
      leftText.regY = leftText.getMeasuredLineHeight() / 2;
      leftText.x = this._gridCellSideLength / 2;
      leftText.y = this._gridCellSideLength * (num + 1) + (this._gridCellSideLength / 2);
      this._labelContainer.addChild(leftText);

      var rightText = leftText.clone();
      rightText.x = (this._gridCellSideLength * 9) + this._gridCellSideLength / 2;
      this._labelContainer.addChild(rightText);
    }
  }

  /**
   * @param ss {createjs.SpriteSheet} - The SpriteSheet for the pieces
   * @private
   */
  function _renderBoard(ss) {
    this._boardGrid = new ChessGrid(this._gridCellSideLength, '#55f', '#ccf', ss);
    this._boardGrid.x = this._gridCellSideLength;
    this._boardGrid.y = this._gridCellSideLength;
    this.addChild(this._boardGrid);
  }

  function _updateBoardLocation() {
    this._boardGrid.updateSize(this._gridCellSideLength);
    this._boardGrid.x = this._gridCellSideLength;
    this._boardGrid.y = this._gridCellSideLength;
  }

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ChessBoard() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ChessBoard);

    /* Call constructor */
    ChessBoardConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ChessBoard;
})(createjs.Container, false);