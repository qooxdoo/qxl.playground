(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qxl.playground.view.RiaPlayArea": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.SelectBox": {
        "construct": true
      },
      "qx.ui.form.ListItem": {
        "construct": true
      },
      "qx.html.Element": {},
      "qx.bom.client.Browser": {},
      "qx.ui.mobile.core.Root": {},
      "qx.ui.mobile.dialog.Popup": {},
      "qx.ui.mobile.core.Blocker": {},
      "qx.ui.mobile.basic.Image": {},
      "qx.application.Mobile": {},
      "qx.ui.mobile.page.Manager": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "browser.name": {
          "className": "qx.bom.client.Browser"
        }
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
       * Christopher Zuendorf (czuendorf)
  
  ************************************************************************ */

  /**
   * Widget responsible for hosting the run code for mobile apps.
   */
  qx.Class.define("qxl.playground.view.MobilePlayArea", {
    extend: qxl.playground.view.RiaPlayArea,
    construct: function construct() {
      qxl.playground.view.RiaPlayArea.constructor.call(this);
      this.setBackgroundColor("#d4d4d4");
      var sizeSelect = new qx.ui.form.SelectBox();
      sizeSelect.setMaxHeight(21);
      sizeSelect.setMarginTop(6);
      sizeSelect.setPaddingTop(-1);
      sizeSelect.setPaddingBottom(0);
      sizeSelect.setWidth(130);
      sizeSelect.add(new qx.ui.form.ListItem("Fit to viewport"));
      var resolutions = [[320, 480, "iPhone 3+4, Android"], [480, 320, "iPhone 3+4, Android"], [320, 568, "iPhone 5"], [568, 320, "iPhone 5"], [480, 800, "Android"], [800, 480, "Android"], [380, 685, "Android"], [685, 320, "Android"]];

      for (var i = 0; i < resolutions.length; i++) {
        var res = resolutions[i];
        var listItemText = "[" + res[0] + " x " + res[1] + "] " + res[2];
        var item = new qx.ui.form.ListItem(listItemText);
        item.setModel(res);
        sizeSelect.add(item);
      }

      sizeSelect.addListener("changeSelection", function (e) {
        var newRes = e.getData()[0].getModel();

        if (newRes) {
          this.__P_435_0(newRes[0], newRes[1]);
        } else {
          this.__P_435_0(null, null);
        }
      }, this);

      this._caption.addAt(sizeSelect, 2);
    },
    members: {
      // Page manager
      __P_435_1: null,

      /**
       * Sets the dimensions to the given values.
       * @param width {Number} The width to set.
       * @param height {Number} The height to set.
       */
      __P_435_0: function __P_435_0(width, height) {
        this._dummy.setMinWidth(width);

        this._dummy.setMinHeight(height);

        this._dummy.setMaxWidth(width);

        this._dummy.setMaxHeight(height);

        this.setMinWidth(width ? width + 2 : null);
        this.setMinHeight(height ? height + 2 : null);
      },
      // overridden
      init: function init() {
        if (this._initialized) {
          return;
        }

        qx.html.Element.flush();

        var playRootEl = this._dummy.getContentElement().getDomElement(); // hotfix for chrome bug


        if (qx.core.Environment.get("browser.name") == "chrome") {
          playRootEl.style["background"] = "none";
        }

        this._playRoot = new qx.ui.mobile.core.Root(playRootEl);
        qx.ui.mobile.dialog.Popup.ROOT = this._playRoot;
        qx.ui.mobile.core.Blocker.ROOT = this._playRoot;
        qx.ui.mobile.basic.Image.ROOT = this._playRoot;
        var self = this;
        this._playApp = new qx.application.Mobile();

        this._playApp.getManager = function () {
          return self.__P_435_1;
        };

        this._initialized = true;
      },
      // overridden
      reset: function reset(beforeReg, afterReg, code) {
        this._playRoot.removeAll();

        if (this.__P_435_1) {
          this.__P_435_1.dispose();

          this.__P_435_1 = null;
        }

        this.__P_435_1 = new qx.ui.mobile.page.Manager(false, this._playRoot);
      }
    }
  });
  qxl.playground.view.MobilePlayArea.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MobilePlayArea.js.map?dt=1590412588407