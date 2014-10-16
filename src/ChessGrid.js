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
		_drawPieces.call(this);
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
	function _drawPieces() {
		var _this = this;

		this.pieces = new Image();
		this.pieces.src = 'assets/sprites/pieces/Chess_Pieces_Sprite.svg';
		this.pieces.onload = function () {
			var data = {
				images: [_this.pieces],
				frames: [
					[0,0,45,45,0,22,22],
					[45,0,45,45,0,22,22],
					[90,0,45,45,0,22,22],
					[135,0,45,45,0,22,22],
					[180,0,45,45,0,22,22],
					[225,0,45,45,0,22,22],
					[0,45,45,45,0,22,22],
					[45,45,45,45,0,22,22],
					[90,45,45,45,0,22,22],
					[135,45,45,45,0,22,22],
					[180,45,45,45,0,22,22],
					[225,45,45,45,0,22,22]
				],
				animations: {
					"wki": { frames: [0] },
					"wq": { frames: [1] },
					"wb": { frames: [2] },
					"wkn": { frames: [3] },
					"wr": { frames: [4] },
					"wp": { frames: [5] },
					"bki": { frames: [6] },
					"bq": { frames: [7] },
					"bb": { frames: [8] },
					"bkn": { frames: [9] },
					"br": { frames: [10] },
					"bp": { frames: [11] }
				}
			};
			var ss = new createjs.SpriteSheet(data);
			var blackPawn = new ChessPiece(ss, "bp");
			blackPawn.x = _this._squareLength / 2;
			blackPawn.y = _this._squareLength + _this._squareLength / 2;
			blackPawn.scaleX = blackPawn.scaleY = _this._squareLength / 45;
			_this.addChild(blackPawn);
			var blackRook = new ChessPiece(ss, "br");
			blackRook.x = _this._squareLength / 2;
			blackRook.y = _this._squareLength / 2;
			blackRook.scaleX = blackRook.scaleY = _this._squareLength / 45;
			_this.addChild(blackRook);
			var blackKnight = new ChessPiece(ss, "bkn");
			blackKnight.x = _this._squareLength + _this._squareLength / 2;
			blackKnight.y = _this._squareLength / 2;
			blackKnight.scaleX = blackKnight.scaleY = _this._squareLength / 45;
			_this.addChild(blackKnight);
			var blackBishop = new ChessPiece(ss, "bb");
			blackBishop.x = _this._squareLength * 2 + _this._squareLength / 2;
			blackBishop.y = _this._squareLength / 2;
			blackBishop.scaleX = blackBishop.scaleY = _this._squareLength / 45;
			_this.addChild(blackBishop);
		};
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