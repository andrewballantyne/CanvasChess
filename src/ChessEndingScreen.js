/**
 * ChessEndingScreen extends createjs.Container
 *  > Ending Game Text
 *
 * Created by Andrew on 26/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var ChessEndingScreen = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ChessEndingScreen, SuperClass, isAbstract);

  _ChessEndingScreen.ENDING_TYPES = {
    'CHECKMATE' : 'inCheckmate',
    'DRAW' : 'inDraw',
    'STALEMATE' : 'inStalemate'
  };
  _ChessEndingScreen.GAME_OVER_TEXT = {
    'inCheckmate' : 'Checkmate\n\n%f wins!',
    'inDraw' : 'Draw\n\nNo winner.',
    'inStalemate' : '%f cannot move, Stalemate\n\nNo winner.'
  };

  /**
   * @constructor
   *
   * @param sideLength {number} - The length of a side of the board
   */
  function ChessEndingScreenConstructor(sideLength) {
    SuperClass.call(this); // super call

    this.width = this.height = sideLength;

    _renderCoverScreen.call(this);
  }

  /* ----- Public Variables ----- */
  /**
   * Resize the game ending screen to a new size.
   *
   * @param newSideLength {number} - The new length of one of the board's sides
   */
  _ChessEndingScreen.prototype.resize = function (newSideLength) {
    this.width = this.height = newSideLength;

    if (this.visible) {
      _renderCoverScreen.call(this);
      _renderGameOverText.call(this, null);
    }
  };
  /**
   * Show the game over text.
   *
   * Note, nothing happens if it's an unsupported reasonForWin.
   *
   * @param reasonForWin {string} - The reason to win (@see ChessEndingScreen.ENDING_TYPES for options)
   * @param lastMoveBy {string} - 'w' or 'b', the last play was made by?
   */
  _ChessEndingScreen.prototype.show = function (reasonForWin, lastMoveBy) {
    var winText = ChessEndingScreen.GAME_OVER_TEXT[reasonForWin];
    if (winText === undefined) return; // no win text

    // Convert short player name into long player name
    if (reasonForWin === ChessEndingScreen.ENDING_TYPES.STALEMATE) {
      // For our text, we want the opposite
      lastMoveBy = (lastMoveBy === ChessStatics.PLAYER_WHITE) ? 'Black' : 'White';
    } else {
      // Standard convert
      lastMoveBy = (lastMoveBy === ChessStatics.PLAYER_WHITE) ? 'White' : 'Black';
    }

    // Render everything
    _renderCoverScreen.call(this);
    _renderGameOverText.call(this, winText.replace('%f', lastMoveBy));

    this.visible = true;
  };
  _ChessEndingScreen.prototype.hide = function () {
    this._backdrop.graphics.clear();
    this.visible = false;
  };

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  /** @type createjs.Shape **/
  _ChessEndingScreen.prototype._backdrop = null;
  /** @type createjs.Text **/
  _ChessEndingScreen.prototype._gameOver = null;
  /** @type createjs.Text **/
  _ChessEndingScreen.prototype._text = null;

  /* ----- Private Methods ----- */
  function _renderCoverScreen() {
    if (this._backdrop === null) {
      this._backdrop = new createjs.Shape();
      this.addChild(this._backdrop);
    } else {
      this._backdrop.graphics.clear();
    }

    this._backdrop.graphics.beginFill('rgba(0,0,0,.9 )').drawRect(0, 0, this.width, this.height);
  }

  /**
   * @private
   * @param text {string} - The text that will be displayed; null will use the last set text
   */
  function _renderGameOverText(text) {
    var fontSize = this.width / 20;
    var font = 'bold ' + fontSize + 'px Arial';
    if (this._text === null) {
      var shadow = new createjs.Shadow('red', 0, 0, 10);
      this._gameOver = new createjs.Text('Game Over', font, 'white');
      this._gameOver.shadow = shadow;
      this._gameOver.textAlign = 'center';
      this.addChild(this._gameOver);

      this._text = new createjs.Text('', font, 'white');
      this._text.shadow = shadow;
      this._text.textAlign = 'center';
      this.addChild(this._text);
    }

    if (text !== null) {
      this._text.text = text;
    }

    // Position everything
    this._gameOver.x = this.width / 2;
    this._gameOver.y = fontSize * 2;
    this._gameOver.font = font;

    this._text.x = this.width / 2;
    this._text.y = fontSize * 5;
    this._text.font = font;
  }


  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ChessEndingScreen() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ChessEndingScreen);

    /* Call constructor */
    ChessEndingScreenConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ChessEndingScreen;
})(createjs.Container, false);