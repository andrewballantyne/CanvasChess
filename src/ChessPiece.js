/**
 * ChessPiece extends createjs.Sprite
 *  > This represents a single piece on the chess board.
 *
 * Created by Andrew on 15/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Sprite
 */
var ChessPiece = (function (ParentClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessPiece, ParentClass, isAbstract);

  /**
   * @constructor
   *
   * @param ss {createjs.SpriteSheet} - The SpriteSheet that is to be used to fetch the piece
   * @param piece {string} - The piece name (that will correspond to the sprite name
   * @param location {{id: string, x: number, y: number}} - The location identification object
   */
  function ChessPieceConstructor(ss, piece, location) {
    ParentClass.call(this, ss, piece); // super call

    this.type = piece;
    this.x = location.x;
    this.y = location.y;

    this.gridLocation = location.id;
  }

  /* ----- Public Variables ----- */
  _ChessPiece.prototype.type = '?'; // the 'name' and 'color' of the piece (K = white king, k = black king, etc)
  _ChessPiece.prototype.gridLocation = ''; // the grid coordinate (ie e2)

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  /**
   * Update the location of this piece.
   *
   * @param newBoardLocation {{id: string, x: number, y: number}} - The location identification object
   */
  _ChessPiece.prototype.updateLocation = function (newBoardLocation) {
    this.x = newBoardLocation.x;
    this.y = newBoardLocation.y;
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */

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