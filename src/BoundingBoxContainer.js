/**
 * @abstract BoundingBoxContainer extends createjs.Container
 *  > An "interface" surrounding a createjs.Container that will help expose/implement common 'bounding box' features.
 *
 * Created by Andrew on 18/10/14.
 *
 * @requires ClassVehicle
 * @extends createjs.Container
 */
var BoundingBoxContainer = (function (SuperClass, isAbstract) {
  /* Setup Extend Link and Setup Class Defaults */
  ClassVehicle.setupClassExtend(_BoundingBoxContainer, SuperClass, isAbstract);

  /**
   * @constructor
   *
   * @param width {number?} - Optional. Width of the container
   * @param height {number?} - Optional. Height of the container
   */
  function BoundingBoxContainerConstructor(width, height) {
    SuperClass.call(this); // super call

    if (width !== undefined) {
      this.width = width;
    }
    if (height !== undefined) {
      this.height = height;
    }
  }

  /* ----- Public Variables ----- */
  _BoundingBoxContainer.prototype.height = 0;
  _BoundingBoxContainer.prototype.width = 0;

  /* ----- Protected Variables ----- */

  /* ----- Public Methods ----- */
  /**
   * @abstract
   * To be overridden in a child class to implement their own flair of within a bounding box. Some may use rectangles, some may be more
   * complex.
   *
   * @param inputPoint {createjs.Point} - An x/y location of the input
   * @returns {boolean} - True if within, false if not
   */
  _BoundingBoxContainer.prototype.isWithin = function (inputPoint) {
    var xy = this.$getXY();
    return this.$checkRect(inputPoint, xy.x, xy.y, this.width, this.height);
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

  /* ----- Protected Methods ----- */
  /**
   * Gets the x/y point (corrected for any registration offsets (regX and regY)).
   *
   * @returns {createjs.Point} - The x/y point of this object, corrected for regX/regY
   */
  _BoundingBoxContainer.prototype.$getXY = function () {
    return new createjs.Point(this.x - this.regX, this.y - this.regY);
  };
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