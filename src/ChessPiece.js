/**
 * ChessPiece extends createjs.Sprite
 *  > This represents a single piece on the chess board.
 *
 * Created by Andrew on 15/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Sprite
 */
var ChessPiece = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessPiece, SuperClass, isAbstract);

  /**
   * @constructor
   *
   * @param ss {createjs.SpriteSheet} - The SpriteSheet that is to be used to fetch the piece
   * @param piece {string} - The piece name (that will correspond to the sprite name
   * @param location {{id: string, x: number, y: number}} - The location identification object
   */
  function ChessPieceConstructor(ss, piece, location) {
    SuperClass.call(this, ss, piece); // super call

    this.type = piece;
    this.x = location.x;
    this.y = location.y;

    this.gridLocation = location.id;
  }

  /* ----- Public Variables ----- */
  _ChessPiece.prototype.type = '?'; // the 'name' and 'color' of the piece (K = white king, k = black king, etc)
  _ChessPiece.prototype.gridLocation = ''; // the grid coordinate (ie e2)
  _ChessPiece.prototype.hasPromotion = false;

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  /**
   * Highlight the piece.
   */
  _ChessPiece.prototype.highlight = function () {
    if (this.shadow !== null) return;

    this.shadow = new createjs.Shadow(CanvasChess.colorScheme.pieceHighlightColor, 0, 0, 15);
  };
  /**
   * UnHighlight this piece.
   */
  _ChessPiece.prototype.unHighlight = function () {
    this.shadow = null;
  };
  /**
   * Update the location of this piece.
   *
   * @param newBoardLocation {{id: string, x: number, y: number}} - The location identification object
   */
  _ChessPiece.prototype.updateLocation = function (newBoardLocation) {
    this.gridLocation = newBoardLocation.id;
    this.x = newBoardLocation.x;
    this.y = newBoardLocation.y;
  };
  /**
   * Determine if in the passed moves, is there a promotion available here?
   *
   * @param possibleMoves {string[]} - The list of possible moves
   */
  _ChessPiece.prototype.validateForPromote = function (possibleMoves) {
    for (var i = 0; i < possibleMoves.length; i++) {
      if (this._PROMOTION_REG_EX.test(possibleMoves[i])) {
        this.hasPromotion = true;
        break;
      }
    }
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  _ChessPiece.prototype._PROMOTION_REG_EX = /=[Qq|Rr|Bb|Nn]/;

  /* ----- Private Methods ----- */

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ChessPiece() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ChessPiece);

    /* Call constructor */
    ChessPieceConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ChessPiece;
})(createjs.Sprite, false);