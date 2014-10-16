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
	function ChessGridConstructor(squareSideLength, darkColor, lightColor) {
		ParentClass.call(this); // super call

		this._squareLength = squareSideLength;
		this._darkColor = darkColor;
		this._lightColor = lightColor;

		_drawLightBackdrop.call(this);
		_drawDarkSquares.call(this);
	}

	/* ----- Public Variables ----- */

	/* ----- Protected Variables ----- */

	/* ----- Public Methods ----- */

	/* ----- Protected Methods ----- */

	/* ----- Private Variables ----- */
	_ChessGrid.prototype._squareLength = 0;
	_ChessGrid.prototype._gridSize = 8; // 8x8
	_ChessGrid.prototype._lightColor = 'white';
	_ChessGrid.prototype._darkColor = 'black';

	/* ----- Private Methods ----- */
	function _drawLightBackdrop() {
		var bg = new createjs.Shape();
		bg.graphics.beginFill(this._lightColor).drawRect(0, 0, this._squareLength * this._gridSize, this._squareLength * this._gridSize);
		this.addChild(bg);
	}
	function _drawDarkSquares() {
		var darkSquares = new createjs.Shape();

		var x = 0;
		var y = 0;
		var drawDark = false;
		for (var r = 0; r < this._gridSize; r++) {
			for (var c = 0; c < this._gridSize; c++) {
				if (drawDark) {
					darkSquares.graphics.beginFill(this._darkColor).drawRect(x, y, this._squareLength, this._squareLength);
				}
				drawDark = !drawDark;
				x += this._squareLength;
			}
			y += this._squareLength;
			x = 0; // new row, start over from the left side
			drawDark = !drawDark; // new row, flip colors
		}
		this.addChild(darkSquares);
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