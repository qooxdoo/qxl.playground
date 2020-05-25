(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.VBox": {
        "construct": true
      },
      "qx.ui.basic.Label": {
        "construct": true
      },
      "qx.ui.toolbar.ToolBar": {
        "construct": true
      },
      "qx.ui.toolbar.Button": {
        "construct": true
      },
      "qx.ui.embed.Html": {
        "construct": true
      },
      "qx.bom.client.Device": {
        "construct": true
      },
      "qx.log.appender.Element": {
        "construct": true
      },
      "qx.log.Logger": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.ui.toolbar.MenuButton": {},
      "qx.ui.menu.Button": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "device.type": {
          "construct": true,
          "className": "qx.bom.client.Device"
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
  
  ************************************************************************ */

  /* ************************************************************************
  
  
  ************************************************************************ */

  /**
   *
   * @asset(qx/icon/Tango/16/actions/edit-clear.png)
   * @asset(qx/icon/Tango/16/categories/system.png)
   * @asset(qx/icon/Tango/16/status/dialog-information.png)
   * @asset(qx/icon/Tango/16/status/dialog-warning.png)
   * @asset(qx/icon/Tango/16/status/dialog-error.png)
   */
  qx.Class.define("qxl.logpane.LogPane", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
      this.__P_433_0 = [["debug", "Debug", "icon/16/categories/system.png"], ["info", "Info", "icon/16/status/dialog-information.png"], ["warn", "Warning", "icon/16/status/dialog-warning.png"], ["error", "Error", "icon/16/status/dialog-error.png"]];
      var layout = new qx.ui.layout.VBox();
      layout.setSeparator("separator-vertical");
      qx.ui.container.Composite.constructor.call(this, layout);
      this.setDecorator("main"); // caption of the log pane

      var caption = new qx.ui.basic.Label(this.tr("Log")).set({
        font: "bold",
        padding: 10,
        alignY: "middle",
        allowGrowX: true,
        allowGrowY: true
      }); //this.add(caption);
      //toolbar of the log pane

      this.__P_433_1 = new qx.ui.toolbar.ToolBar();

      this.__P_433_1.add(caption);

      this.__P_433_1.addSpacer();

      this.__P_433_1.setBackgroundColor("white");

      var clearButton = new qx.ui.toolbar.Button(this.tr("Clear"), "icon/16/actions/edit-clear.png");
      clearButton.addListener("execute", function (e) {
        this.clear();
      }, this);

      this.__P_433_1.add(clearButton);

      this.add(this.__P_433_1); // log pane

      var logArea = new qx.ui.embed.Html('');
      logArea.set({
        backgroundColor: "white",
        overflowY: "scroll",
        overflowX: "auto",
        font: "monospace",
        padding: 3
      });

      if (qx.core.Environment.get("device.type") !== "desktop") {
        logArea.getContentElement().setStyle("WebkitOverflowScrolling", "touch");
        logArea.getContentElement().setStyle("touchAction", "auto");
      }

      this.add(logArea, {
        flex: 1
      }); // log appender

      this.__P_433_2 = new qx.log.appender.Element();
      qx.log.Logger.unregister(this.__P_433_2); // Directly create DOM element to use

      this.__P_433_3 = document.createElement("DIV");

      this.__P_433_2.setElement(this.__P_433_3);

      logArea.addListenerOnce("appear", function () {
        logArea.getContentElement().getDomElement().appendChild(this.__P_433_3);
      }, this);
    },
    properties: {
      /** Shows the toolbar */

      /** Shows the log level button */
      showToolBar: {
        check: "Boolean",
        apply: "_applyShowToolBar",
        init: true
      },

      /** Current set log level.*/
      logLevel: {
        check: ["debug", "info", "warn", "error"],
        init: "debug",
        event: "changeLogLevel"
      }
    },
    members: {
      __P_433_3: null,
      __P_433_2: null,
      __P_433_0: null,
      __P_433_4: null,
      __P_433_1: null,

      /**
       * Clears the log.
       */
      clear: function clear() {
        this.__P_433_2.clear();
      },

      /**
       * Fetches all logged data from the qx logging system and puts in into the
       * log widget.
       *
       * @param Class {Logger?null} The logger class.
       */
      fetch: function fetch(Logger) {
        if (!Logger) {
          Logger = qx.log.Logger;
        } // Register to flush the log queue into the appender.


        Logger.register(this.__P_433_2); // Clear buffer

        Logger.clear();
      },

      /**
       * Returns the div use as log appender element.
       * @return {DIV} The appender element.
       */
      getAppenderElement: function getAppenderElement() {
        return this.__P_433_3;
      },
      _applyShowToolBar: function _applyShowToolBar(value, old) {
        if (value) {
          this.__P_433_1.show();
        } else {
          this.__P_433_1.exclude();
        }
      },
      // property apply
      _applyShowLogLevel: function _applyShowLogLevel(value, old) {
        if (!this.__P_433_4) {
          this.__P_433_4 = this.__P_433_5();

          this.__P_433_1.add(this.__P_433_4);
        }

        if (value) {
          this.__P_433_4.show();
        } else {
          this.__P_433_4.exclude();
        }
      },

      /**
       * Returns the menu button used to select the AUT's log level
       *
       * @return {qx.ui.toolbar.MenuButton}
       */
      __P_433_5: function __P_433_5() {
        var logLevelMenu = new qx.ui.menu.Menu();
        var logLevelMenuButton = new qx.ui.toolbar.MenuButton("Log Level", "icon/16/categories/system.png");
        logLevelMenuButton.setMenu(logLevelMenu);

        for (var i = 0, l = this.__P_433_0.length; i < l; i++) {
          var data = this.__P_433_0[i];
          var button = new qx.ui.menu.Button(data[1], data[2]);
          button.setUserData("model", data[0]);
          button.addListener("execute", function (ev) {
            var pressedButton = ev.getTarget();
            this.setLogLevel(pressedButton.getUserData("model"));
            logLevelMenuButton.setIcon(pressedButton.getIcon());
          }, this);
          logLevelMenu.add(button);
        }

        return logLevelMenuButton;
      }
    },

    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */
    destruct: function destruct() {
      this._disposeObjects("__P_433_2");

      this.__P_433_3 = null;
    }
  });
  qxl.logpane.LogPane.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=LogPane.js.map?dt=1590412588251