(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qxl.versionlabel.VersionLabel": {
        "construct": true
      },
      "qx.ui.form.RadioButton": {
        "construct": true
      },
      "qx.ui.form.RadioGroup": {
        "construct": true
      },
      "qx.ui.basic.Label": {
        "construct": true
      },
      "qx.ui.core.Spacer": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Application header widget.
   */
  qx.Class.define("qxl.playground.view.Header", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
      qx.ui.container.Composite.constructor.call(this, new qx.ui.layout.HBox());
      this.setAppearance("app-header"); // EVIL HACK

      this.addListener("appear", function () {
        var el = this.getContentElement();
        el.setStyle("top", parseInt(el.getStyle("top")) + 1 + "px");
      }, this); // /////////

      var version = new qxl.versionlabel.VersionLabel(this.tr("qooxdoo"));
      version.setFont("default");
      var riaButton = new qx.ui.form.RadioButton(this.tr("Desktop"));
      riaButton.set({
        model: "ria",
        appearance: "modeButton",
        focusable: false
      });
      var mobileButton = new qx.ui.form.RadioButton(this.tr("Mobile"));
      mobileButton.set({
        model: "mobile",
        appearance: "modeButton",
        focusable: false
      });
      this.__P_428_0 = [riaButton, mobileButton];
      this.__P_428_1 = new qx.ui.form.RadioGroup(riaButton, mobileButton);

      this.__P_428_1.bind("modelSelection[0]", this, "mode");

      this.add(new qx.ui.basic.Label(this.tr("Playground")));
      this.add(new qx.ui.core.Spacer(30));
      this.add(riaButton);
      this.add(mobileButton);
      this.add(new qx.ui.core.Spacer(), {
        flex: 1
      });
      this.add(version);
    },
    properties: {
      /** The mode the header should be currently in. */
      mode: {
        event: "changeMode",
        check: "String",
        init: "RIA",
        apply: "_applyMode"
      }
    },
    members: {
      __P_428_0: null,
      __P_428_1: null,
      // property apply
      _applyMode: function _applyMode(value) {
        if (this.__P_428_1.getModelSelection().getItem(0) != value) {
          this.__P_428_1.setModelSelection([value]);
        }
      },

      /**
       * Enables or disabled the button for the given mode.
       * @param mode {String} the mode to change the enabled state.
       * @param value {boolean} <code>true</true> if the button should be enabled.
       */
      setEnabledMode: function setEnabledMode(mode, value) {
        for (var i = 0; i < this.__P_428_0.length; i++) {
          if (this.__P_428_0[i].getModel() == mode) {
            var button = this.__P_428_0[i];
            break;
          }
        }

        ;
        var label = value ? this.tr("Mobile") : this.tr("Mobile (Webkit only)");
        button.setEnabled(value);
        button.setLabel(label);
      }
    }
  });
  qxl.playground.view.Header.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Header.js.map?dt=1590412588011