/**
 * @abstract BoundingBoxContainer extends createjs.Container
 *  > An "interface" surrounding a createjs.Container that will help expose/implement common 'bounding box' features.
 *
 * Created by Andrew on 18/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var BoundingBoxContainer = (function (ParentClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_BoundingBoxContainer, ParentClass, isAbstract);

  /**
   * @constructor
   *
   */
  function BoundingBoxContainerConstructor() {
    ParentClass.call(this); // super call
  }

  /* ----- Public Variables ----- */
  /**
   * @abstract
   * To be overridden in a child class to implement their own flair of within a bounding box. Some may use rectangles, some may be more
   * complex.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {boolean} - True if within, false if not
   */
  _BoundingBoxContainer.prototype.isWithin = function (inputPoint) {
    throw new Error("'isWithin' is an abstract method, and cannot be called directly.");
  };
  /**
   * Very rough implementation to check the within function on this object.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {boolean} - The result of the isWithin function (true if inside, false if not)
   */
  _BoundingBoxContainer.prototype.inputDown = function (inputPoint) {
    return this.isWithin(inputPoint);
  };

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */

  /* ----- Protected Methods ----- */
  /**
   * @protected
   * For the base class, we simply just want to copy the points into a new object (so modifications don't affect the original).
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {createjs.Point} - The location passed in added to a new object
   */
  _BoundingBoxContainer.prototype.$convertToLocal = function (inputPoint) {
    return new createjs.Point(inputPoint.x, inputPoint.y);
  };
  /**
   * A simple bounding box check for a rectangle.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @param x {number} - The x location of the object
   * @param y {number} - The y location of the object
   * @param width {number} - The width of the object
   * @param height{number} - The height of the object
   * @returns {boolean} - True if within the rect, false if not
   */
  _BoundingBoxContainer.prototype.$checkRect = function (inputPoint, x, y, width, height) {
    return inputPoint.x > x &&
      inputPoint.x < x + width &&
      inputPoint.y > y &&
      inputPoint.y < y + height;
  };

  /* ----- Private Variables ----- */

  /* ----- Private Methods ----- */

  /**
   * Entry point into class. This method will only contain needed class-level checks (ie, isAbstract).
   */
  function _BoundingBoxContainer() {
    /* Check Abstract-ness */
    ClassVehicle.checkAbstract.call(this, _BoundingBoxContainer);

    /* Call constructor */
    BoundingBoxContainerConstructor.apply(this, arguments);
  }

  /* Return the class, ready for a new ...() */
  return _BoundingBoxContainer;
})(createjs.Container, true);