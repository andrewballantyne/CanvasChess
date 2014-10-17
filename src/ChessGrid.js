/**
 * ChessGrid extends createjs.Container
 *  > A Grid that is used for Chess (8x8)
 *
 * Created by Andrew on 15/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var ChessGrid = (function (ParentClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessGrid, ParentClass, isAbstract);

  /**
   * @constructor
   *
   */
  function ChessGridConstructor(squareSideLength, darkColor, lightColor, ss) {
    ParentClass.call(this); // super call

    this._ss = ss;
    this._squareLength = squareSideLength;
    this._darkColor = darkColor;
    this._lightColor = lightColor;

    _drawLightBackdrop.call(this);
    _drawDarkSquares.call(this);
    this.updatePiecesWithFen(null); // TODO: call this from outside the ChessGrid
  }

  /* ----- Public Variables ----- */
  /**
   * Update the Grid Size.
   *
   * @param squareSideLength {number} - The new side length
   */
  _ChessGrid.prototype.updateSize = function (squareSideLength) {
    // Save the length
    this._squareLength = squareSideLength;

    // Update all children
    _drawLightBackdrop.call(this);
    _drawDarkSquares.call(this);
    _updatePieceSize.call(this);
  };
  /**
   * Update entire grid with a fen string; This will clear the existing pieces.
   *
   * @param fenString {string} - A fenString to set the board to
   */
  _ChessGrid.prototype.updatePiecesWithFen = function (fenString) {
    var piece = null;

    piece = new ChessPiece(this._ss, 'K', _getPlacementPosition.call(this, 'a1'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'R', _getPlacementPosition.call(this, 'b1'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'P', _getPlacementPosition.call(this, 'a2'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'P', _getPlacementPosition.call(this, 'b2'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'R', _getPlacementPosition.call(this, 'f1'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'p', _getPlacementPosition.call(this, 'e2'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'k', _getPlacementPosition.call(this, 'f6'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'b', _getPlacementPosition.call(this, 'f5'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
    piece = new ChessPiece(this._ss, 'q', _getPlacementPosition.call(this, 'c5'));
    piece.scaleX = piece.scaleY = this._squareLength / 45;
    this._activePieces.push(piece);
    this.addChild(piece);
  };

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  /** @type createjs.SpriteSheet **/
  _ChessGrid.prototype._ss = null;
  _ChessGrid.prototype._squareLength = 0;
  _ChessGrid.prototype._gridSize = 8; // 8x8
  _ChessGrid.prototype._lightColor = 'white';
  _ChessGrid.prototype._darkColor = 'black';

  /** @type createjs.Shape **/
  _ChessGrid.prototype._lightBackdrop = null;
  /** @type createjs.Shape **/
  _ChessGrid.prototype._darkSquares = null;
  /** @type ChessPiece[] **/
  _ChessGrid.prototype._activePieces = [];

  /* ----- Private Methods ----- */
  function _drawLightBackdrop() {
    if (this._lightBackdrop == null) {
      this._lightBackdrop = new createjs.Shape();
      this.addChild(this._lightBackdrop);
    } else {
      this._lightBackdrop.graphics.clear();
    }

    this._lightBackdrop.graphics
      .beginFill(this._lightColor)
      .drawRect(0, 0, this._squareLength * this._gridSize, this._squareLength * this._gridSize);
  }

  function _drawDarkSquares() {
    if (this._darkSquares == null) {
      this._darkSquares = new createjs.Shape();
      this.addChild(this._darkSquares);
    } else {
      this._darkSquares.graphics.clear();
    }

    var x = 0;
    var y = 0;
    var drawDark = false;
    for (var r = 0; r < this._gridSize; r++) {
      for (var c = 0; c < this._gridSize; c++) {
        if (drawDark) {
          this._darkSquares.graphics
            .beginFill(this._darkColor)
            .drawRect(x, y, this._squareLength, this._squareLength);
        }
        drawDark = !drawDark;
        x += this._squareLength;
      }
      y += this._squareLength;
      x = 0; // new row, start over from the left side
      drawDark = !drawDark; // new row, flip colors
    }
  }

  /**
   * @param boardCoordinate - The board coordinate; MUST be two characters and be of the format [a-hA-H][1-8]
   * @returns {Object} - An object with:
   *    'id' (the boardCoordinate),
   *    'x' (the x pixel location of the center of the square),
   *    'y' (the y pixel location of the center of the square)
   * @private
   */
  function _getPlacementPosition(boardCoordinate) {
    if (boardCoordinate == null || boardCoordinate.length != 2) {
      console.warn("Cannot get position of an invalid board coordinate (" + boardCoordinate + ")");
      return null;
    } else if (boardCoordinate.match(/[a-hA-H][1-8]/) == null) {
      console.warn("Cannot get position of an invalid board coordinate (" + boardCoordinate + "), must be letter & number in a-h & 1-8");
      return null;
    }

    var theLetter = boardCoordinate.charAt(0);
    var theNumber = parseInt(boardCoordinate.charAt(1));

    var letterPos = ChessBoard.letters.indexOf(theLetter.toLowerCase());

    var centerOffset = this._squareLength / 2;

    var boardSideLength = this._squareLength * this._gridSize;
    if (CanvasChess.bottomPlayer == CanvasChess.PLAYER_WHITE) {
      return {
        id: boardCoordinate,
        x: this._squareLength * letterPos + centerOffset,
        y: boardSideLength - this._squareLength * (theNumber - 1) - centerOffset
      }
    } else {
      return {
        x: boardSideLength - this._squareLength * letterPos - centerOffset,
        y: this._squareLength * (theNumber - 1) + centerOffset
      };
    }
  }

  function _updatePieceSize() {
    for (var i = 0; i < this._activePieces.length; i++) {
      var piece = this._activePieces[i];
      piece.updateLocation(_getPlacementPosition.call(this, piece.gridLocation));
      piece.scaleX = piece.scaleY = this._squareLength / 45;
    }
  }

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ChessGrid() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ChessGrid);

    /* Call constructor */
    ChessGridConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ChessGrid;
})(createjs.Container, false);