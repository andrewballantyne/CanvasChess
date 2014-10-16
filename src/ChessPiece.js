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
	 */
	function ChessPieceConstructor(ss, piece) {
		ParentClass.call(this, ss, piece); // super call
	}

	/* ----- Public Variables ----- */

	/* ----- Protected Variables ----- */

	/* ----- Public Methods ----- */

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