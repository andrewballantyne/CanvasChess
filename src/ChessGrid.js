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
    /* Fen String Cheat Sheet
      Take the starting position:
        rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
                            1                       2   3  4 5 6

      lower case letters are black
      upper case letters are white

      (1) Piece Position:
        rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR

        / = new line
        # = empty spaces (8 = eight empty spaces or whole line)

      (2) Player's Turn:
        w

        w = white
        b = black

      (3) Castling Possibilities:
        KQkq

        KQ - white K and Q castle possibilities
        kq - black k and q castle possibilities
        '-' will denote no castling available left

      (4) En Passant:
        -

        e3 : En Passant is available for 1 turn attacking e3 (due to a pawn move from e2 to e4)
        '-' denotes no current en passant

      (5) Halfmove clock:
        0

        This is the number of halfmoves since the last capture or pawn advance. This is used to determine if a draw can be claimed under
        the fifty-move rule.

      (6) Fullmove number:
        1

        The number of the full move. It starts at 1, and is incremented after Black's move.
     */

    if (this._pieceContainer == null) {
      this._pieceContainer = new createjs.Container();
      this.addChild(this._pieceContainer);
    } else {
      this._pieceContainer.removeAllChildren();
    }

    var fenStringSections = fenString.split(' ');
    var lines = fenStringSections[0].split('/');

    for (var i = 0; i < lines.length; i++) {
      var thisLine = lines[i];

      var xPos = 0;
      for (var j = 0; j < thisLine.length; j++, xPos++) {
        var thisPiece = thisLine[j];
        if (!isNaN(parseInt(thisPiece))) {
          // Oh, not a piece, a spacer
          xPos += parseInt(thisPiece) - 1;
        } else {
          // We have a piece, let's place it
          var loc = ChessBoard.letters[xPos] + (8 - i).toString();

          var piece = null;
          piece = new ChessPiece(this._ss, thisPiece, _getPlacementPosition.call(this, loc));
          piece.scaleX = piece.scaleY = this._squareLength / 45;
          this._pieceContainer.addChild(piece);
        }
      }
    }
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
  /** @type createjs.Container **/
  _ChessGrid.prototype._pieceContainer = null;

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
    var x = 0;
    var y = 0;
    if (CanvasChess.bottomPlayer == CanvasChess.PLAYER_WHITE) {
      x = this._squareLength * letterPos + centerOffset,
      y = boardSideLength - this._squareLength * (theNumber - 1) - centerOffset
    } else {
      x = boardSideLength - this._squareLength * letterPos - centerOffset;
      y = this._squareLength * (theNumber - 1) + centerOffset;
    }
    
    return {
      id: boardCoordinate,
      x: x,
      y: y
    }
  }

  function _updatePieceSize() {
    for (var i = 0; i < this._pieceContainer.children.length; i++) {
      var piece = this._pieceContainer.children[i];
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