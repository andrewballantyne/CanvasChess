/**
 * ClassVehicle (Singleton)
 * > Used as a Utility Singleton to help setup classes for extending and any other class-based functionality.
 *
 * Created by Andrew on 12/10/14.
 */
var ClassVehicle = (function () {
	/**
	 * @constructor
	 *
	 */
	function ClassVehicleConstructor() {
		/* Stats on usage */
		this.baseCount = 0;
		this.extendCount = 0;
	}

	/* ----- Public Variables ----- */

	/* ----- Protected Variables ----- */

	/* ----- Public Methods ----- */
	/**
	 * Sets up a 'base' class. This is a class that does not extend anything. This method will cover any default functionality that
	 * belongs to 'base classes'.
	 *
	 * @param BaseClass {*} - The 'Base' Class (that has no parents)
	 * @param isAbstract {boolean} - Is this class able to be instantiated?
	 */
	_ClassVehicle.prototype.setupClass = function (BaseClass, isAbstract) {
		_setupAbstract(BaseClass, isAbstract);

		this.baseCount++;
	};
	/**
	 * Sets up a class that extends another class. This method will cover any default functionality that is needed to extend another
	 * class.
	 *
	 * @param ThisClass {*} - The class we are creating
	 * @param ParentClass {*} - The class that we are extending
	 * @param isAbstract {boolean} - Is this class able to be instantiated?
	 */
	_ClassVehicle.prototype.setupClassExtend = function (ThisClass, ParentClass, isAbstract) {
		/* Copy all the static parent properties over */
		for (var prop in ParentClass) if (ParentClass.hasOwnProperty(prop)) ThisClass[prop] = ParentClass[prop];

		/* Create a shell object that will simply call this object, but allows/is needed for full extension */
		function __() { this.constructor = ThisClass; }
		__.prototype = ParentClass.prototype;
		ThisClass.prototype = new __();

		/* Setup Abstract-ness */
		_setupAbstract(ThisClass, isAbstract);

		this.extendCount++;
	};
	/**
	 * Checks the class to see if it can be instantiated. Should be called at the start of every instantiable constructor.
	 *
	 * @param ThisClass {*} - The class that we are instantiating
	 */
	_ClassVehicle.prototype.checkAbstract = function (ThisClass) {
		if (ThisClass.isAbstract && this.isAbstract) {
			// Trim out the underscore as it's our personal way of writing enclosure classes
			var name = (ThisClass.name.charAt(0) == '_') ? ThisClass.name.substr(1, ThisClass.name.length) : ThisClass.name;

			// Throw Error
			throw new Error(name + " is abstract and cannot be created directly.");
		}
	};

	/* ----- Protected Methods ----- */

	/* ----- Private Variables ----- */

	/* ----- Private Methods ----- */
	function _setupAbstract(BaseClass, isAbstract) {
		/* Sets the abstract-ness; used in this.checkAbstract() */
		BaseClass.isAbstract = isAbstract;
		BaseClass.prototype.isAbstract = isAbstract;
	}


	/**
	 * Entry point into class. This method will only contain needed class-level checks.
	 */
	function _ClassVehicle() {
		ClassVehicleConstructor.apply(this, arguments);
	}

	/* Executes a new and returns the, now singleton, object */
	return new _ClassVehicle();
})();