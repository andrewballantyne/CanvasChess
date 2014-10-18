/**
 * ChessGrid extends createjs.Container
 *  > A Grid that is used for Chess (8x8)
 *
 * Created by Andrew on 15/10/14.
 *
 * @requires ClassVehicle
 * @extends BoundingBoxContainer
 */
var ChessGrid = (function (ParentClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessGrid, ParentClass, isAbstract);

  /**
   * @constructor
   *
   * @param squareSideLength {number} - The length of a side for a single square
   * @param darkColor {string} - The colour for the 'light squares'
   * @param lightColor {string} - The colour for the 'dark squares'
   * @param ss {createjs.SpriteSheet} - The SpriteSheet for the pieces
   * @param model {Chess} - The Chess model
   */
  function ChessGridConstructor(squareSideLength, darkColor, lightColor, ss, model) {
    ParentClass.call(this); // super call

    this._ss = ss;
    this._squareLength = squareSideLength;
    this._darkColor = darkColor;
    this._lightColor = lightColor;
    this._highlightColor = 'rgba(255, 127, 0, .9)';
    this._availableMovesColor = 'rgba(51, 255, 51, .4)';
    this._chessModel = model;

    _drawLightBackdrop.call(this);
    _drawDarkSquares.call(this);
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
  _ChessGrid.prototype.isWithin = function (inputPoint) {
    return this.$checkRect(inputPoint, this.x, this.y, this._squareLength * this._GRID_SIZE, this._squareLength * this._GRID_SIZE);
  };
  /**
   * @override
   * Down on the ChessGrid; first we want to check if that's true, and then we can manage the input as a local point inside the grid.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {boolean} - True if we made contact with something, false if we did nothing with the point
   */
  _ChessGrid.prototype.inputDown = function (inputPoint) {
    if (!ParentClass.prototype.inputDown.call(this, inputPoint)) return false;

    // Get local to the grid
    var localPoint = this.$convertToLocal.call(this, inputPoint);

    // Check if we hit any pieces
    var gotSomething = false;
    for (var i = 0; i < this._pieceContainer.children.length; i++) {
      var piece = this._pieceContainer.children[i];
      var squareBox = _gridSquareBoundingBox.call(this, piece.gridLocation);
      if (this.$checkRect(localPoint, squareBox.x, squareBox.y, squareBox.width, squareBox.height)) {
        if (this._selectedPiece != null) {
          this._selectedPiece.shadow = null;
          this._selectedPiece = null;
        }

        // Highlight all possible moves
        var possibleMoves = this._chessModel.moves({square: piece.gridLocation});
        this._possibleSelectedMoves = possibleMoves;
        _highlightMoveSquares.call(this, possibleMoves);

        if (possibleMoves.length > 0) {
          // Highlight *this* square
          if (piece.shadow == null)
            piece.shadow = new createjs.Shadow(this._highlightColor, 0, 0, 15);
        } else {
          // Un-highlight the selected square, no moves for this guy
          piece.shadow = null;
        }

        this._selectedPiece = piece;

        gotSomething = true;
        break;
      }
    }

    if (!gotSomething) {
      _clearSelection.call(this);
    }

    return gotSomething;
  };
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
      _clearSelection.call(this);
      // TODO: Diff the fen
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

  /* ----- Protected Methods ----- */
  /**
   * @override
   * @protected
   * The local point for the ChessGrid inside it's parent.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {createjs.Point} - The location passed in added to a new object
   */
  _ChessGrid.prototype.$convertToLocal = function (inputPoint) {
    var newInputPoint = ParentClass.prototype.$convertToLocal.call(this, inputPoint);

    newInputPoint.x -= this.x;
    newInputPoint.y -= this.y;

    return newInputPoint;
  };

  /* ----- Private Variables ----- */
  // Constants
  _ChessGrid.prototype._GRID_SIZE = 8; // 8x8

  // Variables
  _ChessGrid.prototype._squareLength = 0;
  _ChessGrid.prototype._lightColor = 'white';
  _ChessGrid.prototype._darkColor = 'black';
  _ChessGrid.prototype._possibleSelectedMoves = null; // null == no selected piece; [] == no moves; [...,'e2','e3',...] all possible moves

  // Object references
  /** @type createjs.SpriteSheet **/
  _ChessGrid.prototype._ss = null;
  /** @type Chess - The Chess Model **/
  _ChessGrid.prototype._chessModel = null;
  /** @type ChessPiece **/
  _ChessGrid.prototype._selectedPiece = null;

  // Board Drawn Shapes
  /** @type createjs.Shape **/
  _ChessGrid.prototype._lightBackdrop = null;
  /** @type createjs.Shape **/
  _ChessGrid.prototype._darkSquares = null;
  /** @type createjs.Container **/
  _ChessGrid.prototype._pieceContainer = null;
  /** @type createjs.Shape **/
  _ChessGrid.prototype._selectedSquare = null;
  /** @type createjs.Shape **/
  _ChessGrid.prototype._highlightedMoves = null;

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
      .drawRect(0, 0, this._squareLength * this._GRID_SIZE, this._squareLength * this._GRID_SIZE);
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
    for (var r = 0; r < this._GRID_SIZE; r++) {
      for (var c = 0; c < this._GRID_SIZE; c++) {
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
   * @private
   * @param boardCoordinate {string} - The board coordinate; MUST be two characters and be of the format [a-hA-H][1-8]
   * @returns {{id: string, x: number, y: number}} - An object with:
   *    'id' (the boardCoordinate),
   *    'x' (the x pixel location of the center of the square),
   *    'y' (the y pixel location of the center of the square)
   */
  function _getPlacementPosition(boardCoordinate) {
    var boundingBox = _gridSquareBoundingBox.call(this, boardCoordinate);
    if (boundingBox == null) return null;

    var centerOffset = this._squareLength / 2;
    return {
      id: boardCoordinate,
      x: boundingBox.x + centerOffset,
      y: boundingBox.y + centerOffset
    }
  }

  /**
   * @private
   * @param boardCoordinate {string} - The board coordinate; MUST be two characters and be of the format [a-hA-H][1-8]
   * @returns {createjs.Rectangle} - An object with:
   *    'x' (the x pixel location of the center of the square),
   *    'y' (the y pixel location of the center of the square),
   *    'width' (the width of the square),
   *    'height' (the height of the square)
   */
  function _gridSquareBoundingBox(boardCoordinate) {
    var matches = boardCoordinate.match(/[a-hA-H][1-8]/);
    if (matches == null) {
      console.warn("Cannot get position of an invalid board coordinate (" + boardCoordinate + ")");
    } else {
      boardCoordinate = matches[0];
    }

    var theLetter = boardCoordinate.charAt(0);
    var theNumber = parseInt(boardCoordinate.charAt(1));

    var boardSideLength = this._squareLength * this._GRID_SIZE;
    var letterPos = ChessBoard.letters.indexOf(theLetter.toLowerCase());
    var x = 0;
    var y = 0;
    if (CanvasChess.bottomPlayer == CanvasChess.PLAYER_WHITE) {
      x = this._squareLength * letterPos;
      y = this._squareLength * (this._GRID_SIZE - theNumber);
    } else {
      x = boardSideLength - this._squareLength * (letterPos + 1);
      y = boardSideLength - this._squareLength * (this._GRID_SIZE - theNumber + 1);
    }

    return new createjs.Rectangle(x, y, this._squareLength, this._squareLength);
  }
  function _updatePieceSize() {
    for (var i = 0; i < this._pieceContainer.children.length; i++) {
      var piece = this._pieceContainer.children[i];
      piece.updateLocation(_getPlacementPosition.call(this, piece.gridLocation));
      piece.scaleX = piece.scaleY = this._squareLength / 45;
    }
  }

  /**
   * @private
   * @param gridLocation {string} - The board coordinate; MUST be two characters and be of the format [a-hA-H][1-8]; set to null to clear
   * @param locationRect {createjs.Rectangle?} - Optional. The rectangle for the gridLocation (if not provided it will be fetched within)
   */
  function _highlightPiece(gridLocation, locationRect) {
    if (this._selectedSquare == null) {
      this._selectedSquare = new createjs.Shape();
      this.addChildAt(this._selectedSquare, this.getChildIndex(this._darkSquares) + 1);
    } else {
      this._selectedSquare.graphics.clear();
    }

    if (gridLocation === null) return; // we just came to clear the square

    this._selectedSquare.graphics.beginFill(this._highlightColor);

    _highlightSquare.call(this, this._selectedSquare, gridLocation, locationRect);
  }

  /**
   * @private
   * @param highlightShape {createjs.Shape} - The shape object to draw the highlight (define .graphics.beginFill(...) before calling)
   * @param gridLocation {string} - The board coordinate; MUST be two characters and be of the format [a-hA-H][1-8]
   * @param locationRect {createjs.Rectangle?} - Optional. The rectangle for the gridLocation (if not provided it will be fetched within)
   */
  function _highlightSquare(highlightShape, gridLocation, locationRect) {
    if (locationRect === undefined) { // no location? no worries, we'll get it
      locationRect = _gridSquareBoundingBox.call(this, gridLocation);
    }

    highlightShape.graphics.drawRect(locationRect.x, locationRect.y, locationRect.width, locationRect.height);
  }

  /**
   * @private
   * @param moves {string[]} - The list of moves to highlight
   */
  function _highlightMoveSquares(moves) {
    if (this._highlightedMoves == null) {
      this._highlightedMoves = new createjs.Shape();
      this.addChildAt(this._highlightedMoves, this.getChildIndex(this._darkSquares) + 1);
    } else {
      this._highlightedMoves.graphics.clear();
    }

    if (moves === null) return; // we just came to clear the squares

    this._highlightedMoves.graphics.beginFill(this._availableMovesColor);

    for (var i = 0; i < moves.length; i++) {
      _highlightSquare.call(this, this._highlightedMoves, moves[i]);
    }
  }
  function _clearSelection() {
    if (this._selectedPiece != null)
      this._selectedPiece.shadow = null;
    this._selectedPiece = null;
    this._possibleSelectedMoves = null;
    _highlightMoveSquares.call(this, null);
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
})(BoundingBoxContainer, false);