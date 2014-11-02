/**
 * ChessStatics (Singleton)
 *  > Static variables that control the global state or constant.
 *
 * Created by Andrew on 02/11/14.
 */
var ChessStatics = (function () {

  /**
   * @constructor
   *
   */
  function ChessStaticsConstructor() {
  }

  /* ----- Public Variables ----- */
  // Constants
  _ChessStatics.prototype.LABEL_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
  _ChessStatics.prototype.PLAYER_WHITE = "w";
  _ChessStatics.prototype.PLAYER_BLACK = "b";
  _ChessStatics.prototype.PLAYER_BOTH = "both";
  _ChessStatics.prototype.PLAYER_NONE = "none";
  _ChessStatics.prototype.IS_MOBILE = (/iPhone|iPod|iPad|Android|BlackBerry|Windows Phone/).test(navigator.userAgent);

  // Player Variables
  _ChessStatics.prototype.bottomPlayer = _ChessStatics.prototype.PLAYER_WHITE;
  _ChessStatics.prototype.currentPlayerTurn = _ChessStatics.prototype.PLAYER_WHITE;

  // Color Variables
  _ChessStatics.prototype.colorScheme = {
    darkSquareColor: 'black',
    lightSquareColor: 'white',
    pieceHighlightColor: 'rgba(255, 127, 0, .9)',
    availableMoveSquareColor: 'rgba(51, 255, 51, .4)'
  };

  /* ----- Public Methods ----- */

  /* ----- Private Variables ----- */

  /* ----- Private Methods ----- */

  /**
   * Entry point into class. This method will only contain needed class-level checks.
   */
  function _ChessStatics() {
    /* Call constructor */
    ChessStaticsConstructor.apply(this, arguments);
  }

  /* Executes a new and returns the, now singleton, object */
  return new _ChessStatics();
})();