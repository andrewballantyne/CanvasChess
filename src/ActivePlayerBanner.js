/**
 * ActivePlayerBanner extends createjs.Container
 *  > This is a simple banner that will indicate who the current player is.
 *
 * Created by Andrew on 19/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var ActivePlayerBanner = (function (ParentClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_ActivePlayerBanner, ParentClass, isAbstract);

  /**
   * @constructor
   *
   * @param players {{playerId:{label:string}}} - The list of players, keyed on their id
   * @param startingPlayerId {string} - The id of the player to set at creation
   */
  function ActivePlayerBannerConstructor(players, startingPlayerId) {
    ParentClass.call(this); // super call

    this._players = players;
    this._currentPlayer = players[startingPlayerId];

    _render.call(this);
  }

  /* ----- Public Variables ----- */

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  /**
   * Changes the player to the passed playerId (which will map to the list of players passed at creation).
   *
   * @param playerId {string} - The id of the player to change the text to
   */
  _ActivePlayerBanner.prototype.changePlayer = function (playerId) {
    this._currentPlayerText.text = this._players[playerId].label;
  };

  /* ----- Protected Methods ----- */

  /* ----- Private Variables ----- */
  _ActivePlayerBanner.prototype._players = null;
  _ActivePlayerBanner.prototype._currentPlayer = null;

  /** @type createjs.Text **/
  _ActivePlayerBanner.prototype._currentPlayerText = null;

  /* ----- Private Methods ----- */
  function _render() {
    this._currentPlayerText = new createjs.Text(this._currentPlayer.label, 'Bold 24px Arial', 'black');
    this.addChild(this._currentPlayerText);
  }

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _ActivePlayerBanner() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _ActivePlayerBanner);

    /* Call constructor */
    ActivePlayerBannerConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _ActivePlayerBanner;
})(createjs.Container, false);