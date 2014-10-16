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
	_ChessBoard.prototype.letters = ["a","b","c","d","e","f","g","h"];

	/* ----- Protected Variables ----- */

	/* ----- Public Methods ----- */
	_ChessBoard.prototype.updateSideLength = function (newLength) {
		_calculateLength.call(this, newLength);

		this.removeAllChildren();
		_renderLabels.call(this);
		_renderBoard.call(this);
	};

	/* ----- Protected Methods ----- */

	/* ----- Private Variables ----- */
	_ChessBoard.prototype._fullBoardSideLength = 0;
	_ChessBoard.prototype._gridCellSideLength = 0;

	/* ----- Private Methods ----- */
	function _getFontSize() {
		return this._gridCellSideLength / 2.5;
	}
	function _calculateLength(sideLength) {
		this._fullBoardSideLength = sideLength;
		this._gridCellSideLength = this._fullBoardSideLength / 10;
	}
	function _renderLabels() {
		var labelsPerSide = 8;
		var font = _getFontSize.call(this) + 'px Arial';
		var labelColor = 'black';
		for (var num = 0; num < labelsPerSide; num++) {
			var topText = new createjs.Text(this.letters[num], font, labelColor);
			topText.regX = topText.getMeasuredWidth() / 2;
			topText.regY = topText.getMeasuredLineHeight() / 2;
			topText.x = this._gridCellSideLength * (num+1) + (this._gridCellSideLength / 2);
			topText.y = this._gridCellSideLength / 2;
			this.addChild(topText);

			var bottomText = topText.clone();
			bottomText.y = (this._gridCellSideLength * 9) + this._gridCellSideLength / 2;
			this.addChild(bottomText);

			var leftText = new createjs.Text(labelsPerSide - num, font, labelColor);
			leftText.regX = leftText.getMeasuredWidth() / 2;
			leftText.regY = leftText.getMeasuredLineHeight() / 2;
			leftText.x = this._gridCellSideLength / 2;
			leftText.y = this._gridCellSideLength * (num+1) + (this._gridCellSideLength / 2);
			this.addChild(leftText);

			var rightText = leftText.clone();
			rightText.x = (this._gridCellSideLength * 9) + this._gridCellSideLength / 2;
			this.addChild(rightText);
		}
	}
	function _renderBoard() {
		var board = new ChessGrid(this._gridCellSideLength, '#55f', '#ccf');
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