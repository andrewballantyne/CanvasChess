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

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
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

  /* ----- Protected Methods ----- */
  /**
   * Trigger an event that has been registered.
   *
   * @param eventName {string} - The Event to trigger (will trigger all callbacks registered with this event)
   * @param args {*[]} - The args to pass to the callback function
   */
  _ChessListener.prototype.$triggerEvent = function (eventName, args) {
    if (this._eventListenerMap[eventName] !== undefined) {
      for (var i = 0; i < this._eventListenerMap[eventName].length; i++) {
        var thisEvent = this._eventListenerMap[eventName][i];
        if (thisEvent !== null || thisEvent !== undefined) {
          thisEvent.apply(window, args);
        }
      }
    }
  };

  /**
   * Registers a callback event.
   *
   * @param eventName {string} - The Event to bind the callback to (when $triggerEvent is called, all events bound will be called)
   * @param callback {Function} - The method to call on trigger
   */
  _ChessListener.prototype.$registerCallbackEvent = function (eventName, callback) {
    if (this._eventListenerMap[eventName] === undefined) {
      this._eventListenerMap[eventName] = [];
    }
    this._eventListenerMap[eventName].push(callback);
  };

  /* ----- Private Variables ----- */
  _ChessListener.prototype._eventListenerMap = {};

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