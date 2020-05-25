(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Stack": {
        "construct": true,
        "require": true
      },
      "qxl.playground.view.RiaPlayArea": {
        "construct": true
      },
      "qxl.playground.view.MobilePlayArea": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Abstraction layer for all play areas which forwards the calls and offers a
   * common interface to the playground application.
   */
  qx.Class.define("qxl.playground.view.PlayArea", {
    extend: qx.ui.container.Stack,
    construct: function construct() {
      qx.ui.container.Stack.constructor.call(this);
      this.setDynamic(true);
      this.__P_432_0 = new qxl.playground.view.RiaPlayArea();
      this.__P_432_1 = new qxl.playground.view.MobilePlayArea();

      this.__P_432_0.addListener("toggleMaximize", this._onToggleMaximize, this);

      this.__P_432_1.addListener("toggleMaximize", this._onToggleMaximize, this);

      this.add(this.__P_432_0);
      this.add(this.__P_432_1);
      this.setBackgroundColor("white"); // minor fix for Chrome (caption bar was not visible)

      this.getContentElement().setStyle("-webkit-backface-visibility", "hidden");
    },
    properties: {
      /** The mode the play area is currently in. */
      mode: {
        check: "String",
        apply: "_applyMode"
      }
    },
    events: {
      /** Event to signal the the fields should be maximized / restored. */
      "toggleMaximize": "qx.event.type.Event"
    },
    members: {
      __P_432_0: null,
      __P_432_1: null,

      /**
       * Helper to forward the toggle maximize event.
       */
      _onToggleMaximize: function _onToggleMaximize() {
        this.fireEvent("toggleMaximize");
      },
      // property apply
      _applyMode: function _applyMode(value) {
        this.getSelection()[0].reset();

        if (value == "mobile") {
          this.setSelection([this.__P_432_1]);

          this.__P_432_1.init();
        } else {
          this.setSelection([this.__P_432_0]);

          this.__P_432_0.init();
        }
      },

      /**
       * Sets the caption of the playareas to the given text.
       * @param text {String} The new text of the caption.
       */
      updateCaption: function updateCaption(text) {
        this.__P_432_0.updateCaption(text);

        this.__P_432_1.updateCaption(text);
      },

      /**
       * Returns the application object of the current selected playarea.
       * @return {qx.ui.container.Composite} The current playarea.
       */
      getApp: function getApp() {
        return this.getSelection()[0].getApp();
      },

      /**
       * Used to reset the current selected playarea.
       * @param beforeReg {Object} A copy of the qx object registry before running
       *   the application.
       * @param afterReg {Object} A copy of the qx object registry after running
       *   the application
       * @param code {String} The code of the application as string.
       */
      reset: function reset(beforeReg, afterReg, code) {
        this.getSelection()[0].reset(beforeReg, afterReg, code);
      }
    }
  });
  qxl.playground.view.PlayArea.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=PlayArea.js.map?dt=1590412588209