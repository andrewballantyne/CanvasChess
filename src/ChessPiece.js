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
   * @param ss - The SpriteSheet that is to be used to fetch the piece
   * @param piece - The piece name (that will correspond to the sprite name
   * @param location - The location object {id:'e2', x:45, y:45}
   */
  function ChessPieceConstructor(ss, piece, location) {
    ParentClass.call(this, ss, piece); // super call

    this.x = location.x;
    this.y = location.y;

    this.gridLocation = location.id;
  }

  /* ----- Public Variables ----- */
  _ChessPiece.prototype.gridLocation = '';

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  /**
   * Update the location of this piece.
   *
   * @param newBoardLocation - The new location object {id:'e2', x:45, y:45}
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