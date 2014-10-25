/**
 * ChessGrid extends createjs.Container
 *  > A Grid that is used for Chess (8x8)
 *
 * Created by Andrew on 15/10/14.
 *
 * @requires ClassVehicle
 * @extends BoundingBoxContainer
 */
var ChessGrid = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessGrid, SuperClass, isAbstract);

  /**
   * @constructor
   *
   * @param squareSideLength {number} - The length of a side for a single square
   * @param ss {createjs.SpriteSheet} - The SpriteSheet for the pieces
   * @param chessListener {ChessListener} - The chess listener that will be on the receiving end of any model/notify user action
   */
  function ChessGridConstructor(squareSideLength, ss, chessListener) {
    SuperClass.call(this); // super call

    this._ss = ss;
    this._squareLength = squareSideLength;
    this._lightColor = CanvasChess.colorScheme.lightSquareColor;
    this._darkColor = CanvasChess.colorScheme.darkSquareColor;
    this._availableMovesColor = CanvasChess.colorScheme.availableMoveSquareColor;
    this._chessListener = chessListener;

    _drawLightBackdrop.call(this);
    _drawDarkSquares.call(this);
    _createPromotionSelector.call(this);
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
    if (!SuperClass.prototype.inputDown.call(this, inputPoint)) return false;

    // Get local to the grid
    var localPoint = this.$convertToLocal.call(this, inputPoint);

    var gotSomething = false;
    if (this._promotionSelector.isShowing()) {
      // The Promotion Selector is showing, we only care about a click inside it
      gotSomething = _promotionClick.call(this, localPoint);
    } else {
      // Standard game click
      gotSomething = _boardClick.call(this, localPoint);
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
    _updatePromotionSelector.call(this);
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

    if (this._pieceContainer === null) {
      this._pieceContainer = new createjs.Container();
      this.addChildAt(this._pieceContainer, this.getChildIndex(this._promotionSelector));
    } else {
      _clearSelection.call(this);
      // TODO: Diff the fen
      this._pieceContainer.removeAllChildren();

      // Since we are refreshing locations of everyone, we need to reset the promotion select visibility
      this._promotionSelector.visible = false;
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
          piece.scaleX = piece.scaleY = this._squareLength / this._PIECE_SCALE;
          this._pieceContainer.addChild(piece);
          _addPiece.call(this, loc, piece);
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
    var newInputPoint = SuperClass.prototype.$convertToLocal.call(this, inputPoint);

    newInputPoint.x -= this.x;
    newInputPoint.y -= this.y;

    return newInputPoint;
  };

  /* ----- Private Variables ----- */
  // Constants
  _ChessGrid.prototype._GRID_SIZE = 8; // 8x8 grid
  _ChessGrid.prototype._PIECE_SCALE = 45; // square / *this* -- roughly equals a decent sized scale within the square
  _ChessGrid.prototype._PIECE_REG_EX = /[a-hA-H][1-8]/;
  _ChessGrid.prototype._CASTLE_KS_REG_EX = /^O-O$/;
  _ChessGrid.prototype._CASTLE_QS_REG_EX = /^O-O-O$/;

  // Variables
  _ChessGrid.prototype._squareLength = 0;
  _ChessGrid.prototype._lightColor = 'white';
  _ChessGrid.prototype._darkColor = 'black';
  _ChessGrid.prototype._possibleSelectedMoves = null; // null == no selected piece; [] == no moves; [...,'e2','e3',...] all possible moves
  _ChessGrid.prototype._possiblePromotions = null;

  // Object references
  /** @type createjs.SpriteSheet **/
  _ChessGrid.prototype._ss = null;
  /** @type ChessListener **/
  _ChessGrid.prototype._chessListener = null;
  /** @type ChessPiece **/
  _ChessGrid.prototype._selectedPiece = null;
  /** @type Object (key[location]:string to value[piece]:createjs.Sprite) **/
  _ChessGrid.prototype._pieceMap = {};

  // Board Drawn Shapes
  /** @type createjs.Shape **/
  _ChessGrid.prototype._lightBackdrop = null;
  /** @type createjs.Shape **/
  _ChessGrid.prototype._darkSquares = null;
  /** @type createjs.Container **/
  _ChessGrid.prototype._pieceContainer = null;
  /** @type createjs.Shape **/
  _ChessGrid.prototype._highlightedMoves = null;
  /** @type ChessPromotionSelector **/
  _ChessGrid.prototype._promotionSelector = null;

  /* ----- Private Methods ----- */
  function _drawLightBackdrop() {
    if (this._lightBackdrop === null) {
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
    if (this._darkSquares === null) {
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
   * @param inputPoint {createjs.Point} - The input location
   * @returns {string} - The grid coordinate
   */
  function _getBoardCoordinatesFromInput(inputPoint) {
    var letterIndex = 0;
    var x = inputPoint.x;
    do {
      x -= this._squareLength;
      letterIndex++;
    } while(x > 0);
    var letter =
      (CanvasChess.bottomPlayer === CanvasChess.PLAYER_WHITE) ?
        ChessBoard.letters[--letterIndex] :
        ChessBoard.letters[this._GRID_SIZE - letterIndex];

    var number = 0;
    var y = inputPoint.y;
    do {
      y -= this._squareLength;
      number++;
    } while(y > 0);
    number = (CanvasChess.bottomPlayer === CanvasChess.PLAYER_WHITE) ? (this._GRID_SIZE - number + 1) : number;

    return letter + number.toString();
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
    if (boundingBox === null) return null;

    var centerOffset = this._squareLength / 2;
    return {
      id: boardCoordinate.match(this._PIECE_REG_EX)[0],
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
    var isKingCastle = this._CASTLE_KS_REG_EX.test(boardCoordinate);
    var isQueenCastle = this._CASTLE_QS_REG_EX.test(boardCoordinate);

    if (!(isKingCastle || isQueenCastle)) {
      // Not castling, a regular move, parse it into a piece
      var matches = boardCoordinate.match(this._PIECE_REG_EX);
      if (matches === null) {
        console.warn("Cannot get position of an invalid board coordinate (" + boardCoordinate + ")");
      } else {
        boardCoordinate = matches[0];
      }
    }

    var theLetter;
    var theNumber;
    if (isKingCastle || isQueenCastle) {
      theNumber = (CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE) ? 1 : 8;
      theLetter = (isQueenCastle) ? 'c' : 'g';
    } else {
      theLetter = boardCoordinate.charAt(0);
      theNumber = parseInt(boardCoordinate.charAt(1));
    }

    var boardSideLength = this._squareLength * this._GRID_SIZE;
    var letterPos = ChessBoard.letters.indexOf(theLetter.toLowerCase());
    var x = 0;
    var y = 0;
    if (CanvasChess.bottomPlayer === CanvasChess.PLAYER_WHITE) {
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
      piece.scaleX = piece.scaleY = this._squareLength / this._PIECE_SCALE;
    }
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
    if (this._highlightedMoves === null) {
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
    if (this._selectedPiece !== null) {
      this._selectedPiece.unHighlight();
    }
    this._possibleSelectedMoves = null;
    this._selectedPiece = null;
    _highlightMoveSquares.call(this, null);
  }

  /**
   * @private
   * @param from {string} - The SAN location for where the piece is moving from
   * @param to {string} - The SAN location for where the piece is to go to
   * @param silentMove {boolean} - Do we want to report this move? False does not report the move to the chess listener
   */
  function _movePiece(from, to, silentMove) {
    var fromLoc = from.match(this._PIECE_REG_EX)[0];
    var toLoc = to.match(this._PIECE_REG_EX)[0];

    var fromObj = this._pieceMap[fromLoc];
    if (fromObj === undefined) return; // no piece at this location

    fromObj.updateLocation(_getPlacementPosition.call(this, to));
    if (!silentMove) {
      var flag = this._chessListener.move({from: fromLoc, to: toLoc}).flags;
      /* Flags:
       'n' - a non-capture
       'b' - a pawn push of two squares
       'e' - an en passant capture
       'c' - a standard capture
       'p' - a promotion
       'k' - kingside castling
       'q' - queenside castling
       */
      var removeLoc = null;
      if (flag === 'e') {
        // en passant, our move will not land on the guy we are removing, we need to adjust to where he is before we can remove him
        var horizontalRow = parseInt(removeLoc.charAt(1));
        if (horizontalRow === 6) {
          horizontalRow--; // 'top-down'
        } else if (horizontalRow === 3) {
          horizontalRow++; // 'bottom-up'
        }
        removeLoc = removeLoc.charAt(0) + horizontalRow;
      }

      if (removeLoc !== null) {
        _removePiece.call(this, removeLoc);
      }
    }

    this._pieceMap[toLoc] = this._pieceMap[fromLoc];
    delete this._pieceMap[fromLoc];
  }

  /**
   * @private
   * @param on {string} - The grid coordinate of where to place the piece
   * @param piece {ChessPiece} - The piece to be placed
   */
  function _addPiece(on, piece) {
    var onLoc = on.match(this._PIECE_REG_EX)[0];
    this._pieceMap[onLoc] = piece;
    this._pieceContainer.addChild(piece);
  }

  /**
   * @private
   * @param on {string} - The grid coordinate of where to place the piece
   */
  function _removePiece(on) {
    var onLoc = on.match(this._PIECE_REG_EX)[0];
    var piece = this._pieceMap[onLoc];
    if (piece !== undefined) {
      this._pieceContainer.removeChild(piece);
      delete this._pieceMap[onLoc];
    }
  }

  function _createPromotionSelector() {
    this._promotionSelector = new ChessPromotionSelector(this._ss, this._squareLength, this._PIECE_SCALE);
    this.addChild(this._promotionSelector);
    this._promotionSelector.visible = false;
    _updatePromotionSelector.call(this);
  }

  function _updatePromotionSelector() {
    // Size Update
    this._promotionSelector.updateSize(this._squareLength);

    // Location Update
    var boardSize = this._squareLength * this._GRID_SIZE;
    this._promotionSelector.regX = this._promotionSelector.width / 2;
    this._promotionSelector.regY = this._promotionSelector.height / 2;
    this._promotionSelector.x = boardSize / 2;
    this._promotionSelector.y = boardSize / 2;
  }

  /**
   * @private
   * @param localPoint {createjs.Point} - An x/y point local to the grid
   * @returns {boolean} - True if we selected something; false if the click didn't hit anything
   */
  function _boardClick(localPoint) {
    var gotSomething = false;
    var gridInputLocation = _getBoardCoordinatesFromInput.call(this, localPoint);

    if (this._possibleSelectedMoves !== null) {
      // We have possible moves, this means we have a selection; check to see if we are selecting on of those possible move squares
      gotSomething = _checkPossibleMoves.call(this, gridInputLocation);
    }

    if (!gotSomething) {
      // We haven't got something, see if we are clicking on another piece
      gotSomething = _selectPiece.call(this, gridInputLocation);
    }

    if (!gotSomething) {
      // We still haven't got something, time to clear the selection; we have entirely missed clicking on something
      _clearSelection.call(this);
    }

    return gotSomething;
  }

  /**
   * @private
   * @param gridInputLocation {string} - The grid location that clicked (ie e4, f3, etc)
   * @returns {boolean} - True if we selected something; false if the click didn't hit anything
   */
  function _checkPossibleMoves(gridInputLocation) {
    var gotSomething = false;
    var theMove = null;
    var isCastle = false;
    var i;

    // Loop the possible moves, check to see if any of them were selected
    for (i = 0; i < this._possibleSelectedMoves.length; i++) {
      var possibleMove = null;
      var thisMove = this._possibleSelectedMoves[i];

      // Check if it's a castling move
      var isKingCastle = this._CASTLE_KS_REG_EX.test(thisMove);
      var isQueenCastle = this._CASTLE_QS_REG_EX.test(thisMove);
      if (isKingCastle || isQueenCastle) {
        // This move is a castling move, check if it matches the square clicked
        var theNumber = (CanvasChess.currentPlayerTurn === CanvasChess.PLAYER_WHITE) ? 1 : 8;
        var theLetter = (isQueenCastle) ? 'c' : 'g';
        possibleMove = theLetter + theNumber.toString();
        if (possibleMove === gridInputLocation) {
          // This is the square we clicked, we are castling
          theMove = theLetter + theNumber.toString();
          isCastle = true;
          break;
        }
      } else {
        // Not castling, check to see if thisMove is the grid location we clicked
        var matches = thisMove.match(this._PIECE_REG_EX);
        possibleMove = (matches !== null) ? matches[0] : null; // only 1 location to come out of a SAN notation
        if (possibleMove === gridInputLocation) {
          theMove = thisMove;
          break;
        }
      }
    }

    if (theMove !== null) {
      // We have selected one of the possible move locations, act on it
      if (this._selectedPiece.hasPromotion) {
        // This piece has promotion, soft move the piece and prompt the promotion window
        _movePiece.call(this, this._selectedPiece.gridLocation, theMove, true);
        this._possiblePromotions = [];
        var regEx = new RegExp(this._selectedPiece.gridLocation);
        for (i = 0; i < this._possibleSelectedMoves.length; i++) {
          if (regEx.test(this._possibleSelectedMoves[i])) {
            this._possiblePromotions.push(this._possibleSelectedMoves[i]);
          }
        }
        this._promotionSelector.show();
      } else {
        // We are moving a piece normally
        _movePiece.call(this, this._selectedPiece.gridLocation, theMove); // *this* move

        if (isCastle) {
          // We are castling, make sure we move the rook as well
          if (theMove.charAt(0) === 'c') { // Queen Castle
            _movePiece.call(this, 'a' + theMove.charAt(1), 'd' + theMove.charAt(1), true); // rook move
          } else { // King Castle
            _movePiece.call(this, 'h' + theMove.charAt(1), 'f' + theMove.charAt(1), true); // rook move
          }
        }
      }

      // We have completed our task, lets clear any selection we currently have as there is nothing else to do
      _clearSelection.call(this);

      // Flag that we got something
      gotSomething = true;
    }

    return gotSomething;
  }

  /**
   * @private
   * @param gridInputLocation {string} - The grid location that clicked (ie e4, f3, etc)
   * @returns {boolean} - True if we selected something; false if the click didn't hit anything
   */
  function _selectPiece(gridInputLocation) {
    // Check if we are selecting a piece
    var piece = this._pieceMap[gridInputLocation];
    if (piece !== undefined) { // there is a piece at the click location
      if (this._selectedPiece !== null) {
        this._selectedPiece.unHighlight();
        this._selectedPiece = null;
      }

      // Highlight all possible moves
      var possibleMoves = this._chessListener.getMoves(piece.gridLocation);
      this._possibleSelectedMoves = possibleMoves;
      piece.validateForPromote(possibleMoves);
      _highlightMoveSquares.call(this, possibleMoves);

      if (possibleMoves.length > 0) {
        // Highlight *this* square
        piece.highlight();
      } else {
        // Un-highlight the selected square, no moves for this guy
        piece.unHighlight();
      }

      this._selectedPiece = piece;

      return true;
    }
    return false;
  }

  /**
   * @private
   * @param localPoint {createjs.Point} - An x/y point local to the grid
   * @returns {boolean} - True if we selected something; false if the click didn't hit anything
   */
  function _promotionClick(localPoint) {
    var gotSomething = false;

    // Check for the selection of one of the options
    var pieceSelection = this._promotionSelector.checkForSelection(localPoint);

    if (pieceSelection !== null) {
      gotSomething = true;

      // Hide the promotion selector, since we have what we want
      this._promotionSelector.hide();

      // Compile a regEx that will find us our promotion move
      var lowCase = pieceSelection.toLowerCase();
      var upCase = pieceSelection.toUpperCase();
      var regEx = new RegExp("=[" + lowCase + upCase + "]");

      // Loop the possible promotions that met our move criteria, look for our promotion move
      for (var i = 0; i < this._possiblePromotions.length; i++) {
        var move = this._possiblePromotions[i];
        if (regEx.test(move)) { // does this move match our promotion move
          _removePiece.call(this, move); // remove the pawn

          // Create the piece we need and add it
          var piece = new ChessPiece(this._ss, pieceSelection, _getPlacementPosition.call(this, move));
          piece.scaleX = piece.scaleY = this._squareLength / this._PIECE_SCALE;
          _addPiece.call(this, move, piece);

          // Finalize the 'move'
          this._chessListener.move(move);
          break;
        }
      }
    }

    return gotSomething;
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