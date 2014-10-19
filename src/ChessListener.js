/**
 * @abstract ChessListener
 *  > An abstract listener class that will be the reference point for any Chess actions (move/getHistory/etc)
 *
 * Created by Andrew on 19/10/14.
 *
 * @requires ClassVehicle
 */
var ChessListener = (function (isAbstract) {
  /* Setup Class Defaults */
  ClassVehicle.setupClass(_ChessListener, isAbstract);

  /**
   * @constructor
   *
   */
  function ChessListenerConstructor() {
  }

  /* ----- Public Variables ----- */
  _ChessListener.prototype.rotate = function () {
    throw new Error("rotate is an abstract method and cannot be called directly.");
  };
  _ChessListener.prototype.resetBoard = function () {
    throw new Error("resetBoard is an abstract method and cannot be called directly.");
  };

  _ChessListener.prototype.clearBoard = function () {
    throw new Error("clearBoard is an abstract method and cannot be called directly.");
  };

  _ChessListener.prototype.history = function () {
    throw new Error("history is an abstract method and cannot be called directly.");
  };

  _ChessListener.prototype.move = function (move) {
    throw new Error("move is an abstract method and cannot be called directly.");
  };

  _ChessListener.prototype.getMoves = function (gridCoordinate) {
    throw new Error("getMoves is an abstract method and cannot be called directly.");
  };

  _ChessListener.prototype.getFenString = function () {
    throw new Error("getFenString is an abstract method and cannot be called directly.");
  };

  _ChessListener.prototype.setFenString = function (newFen) {
    throw new Error("setFenString is an abstract method and cannot be called directly.");
  };

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */

  /* ----- Private Methods ----- */

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ChessListener() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ChessListener);

    /* Call constructor */
    ChessListenerConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ChessListener;
})(true);