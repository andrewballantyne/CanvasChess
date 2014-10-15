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

	/**
	 * @constructor
	 *
	 * @param sideLength {number} - All sides of the board have the same length
	 */
	function ChessBoardConstructor(sideLength) {
		ParentClass.call(this); // super call

		_calculateLength.call(this, sideLength);

		_renderLabels.call(this);
		_renderBoard.call(this);
	}

	/* ----- Public Variables ----- */
	_ChessBoard.prototype.updateSideLength = function (newLength) {
		_calculateLength.call(this, newLength);

		this.removeAllChildren();
		_renderLabels.call(this);
		_renderBoard.call(this);
	};

	/* ----- Protected Variables ----- */

	/* ----- Public Methods ----- */

	/* ----- Protected Methods ----- */

	/* ----- Private Variables ----- */
	_ChessBoard.prototype._fullBoardSideLength = 0;
	_ChessBoard.prototype._gridCellSideLength = 0;

	/* ----- Private Methods ----- */
	function _calculateLength(sideLength) {
		this._fullBoardSideLength = sideLength;
		this._gridCellSideLength = this._fullBoardSideLength / 10;
	}
	function _renderLabels() {
		var labels = new createjs.Shape();
		labels.graphics.beginFill('gray').drawRect(0, 0, this._fullBoardSideLength, this._fullBoardSideLength);
		this.addChild(labels);
	}
	function _renderBoard() {
		var board = new createjs.Shape();
		board.graphics.beginFill('black').drawRect(0, 0, this._gridCellSideLength*8, this._gridCellSideLength*8);
		board.x = this._gridCellSideLength;
		board.y = this._gridCellSideLength;

		this.addChild(board);
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