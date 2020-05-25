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
      "qx.ui.layout.VBox": {
        "construct": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.basic.Label": {
        "construct": true
      },
      "qx.ui.form.Button": {
        "construct": true
      },
      "qx.ui.core.Spacer": {
        "construct": true
      },
      "qx.ui.container.Scroll": {
        "construct": true
      },
      "qx.ui.core.Widget": {
        "construct": true
      },
      "qx.ui.core.queue.Manager": {},
      "qx.ui.root.Inline": {},
      "qx.ui.layout.Canvas": {},
      "qx.application.Standalone": {},
      "qx.ui.core.queue.Dispose": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Widget responsible for hosting the run code.
   */
  qx.Class.define("qxl.playground.view.RiaPlayArea", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
      var layout = new qx.ui.layout.VBox();
      layout.setSeparator("separator-vertical");
      qx.ui.container.Composite.constructor.call(this, layout);
      this.setDecorator("main"); // caption

      this._caption = new qx.ui.container.Composite();

      this._caption.setBackgroundColor("white");

      this._caption.setLayout(new qx.ui.layout.HBox()); // caption label


      this.__P_434_0 = new qx.ui.basic.Label().set({
        font: "bold",
        padding: 7,
        allowGrowX: true,
        allowGrowY: true
      }); // button for max / min the play area

      var maxIcon = "decoration/window/maximize.gif";
      var restoreIcon = "decoration/window/restore.gif";
      var maxButton = new qx.ui.form.Button(null, maxIcon);
      maxButton.setAppearance("toolbar-button");
      maxButton.setMargin(6);
      maxButton.setMinHeight(21);
      maxButton.setToolTipText(this.tr("Maximize"));
      maxButton.addListener("execute", function () {
        // toggle the icons
        if (maxButton.getIcon() == maxIcon) {
          maxButton.setIcon(restoreIcon);
          maxButton.setToolTipText(this.tr("Restore"));
        } else {
          maxButton.setIcon(maxIcon);
          maxButton.setToolTipText(this.tr("Maximize"));
        }

        this.fireEvent("toggleMaximize");
      }, this); // combine all parts for the caption

      this._caption.add(this.__P_434_0);

      this._caption.add(new qx.ui.core.Spacer(), {
        flex: 1
      });

      this._caption.add(maxButton);

      this.add(this._caption);

      this._caption.set({
        minHeight: 32,
        maxHeight: 32
      }); // playfield


      this.__P_434_1 = new qx.ui.container.Scroll();

      this.__P_434_1.getChildControl("scrollbar-x");

      this.__P_434_1.getChildControl("scrollbar-y");

      this.__P_434_1.getChildControl("corner");

      this._dummy = new qx.ui.core.Widget();

      this.__P_434_1.add(this._dummy);

      this.add(this.__P_434_1, {
        flex: 1
      });
    },
    events: {
      /** Event to signal the the fields should be maximized / restored. */
      "toggleMaximize": "qx.event.type.Event"
    },
    members: {
      _caption: null,
      __P_434_0: null,
      _dummy: null,
      _playRoot: null,
      __P_434_1: null,
      _playApp: null,
      _initialized: false,

      /**
       * Initializes the playarea.
       */
      init: function init() {
        if (this._initialized) {
          return;
        }

        qx.ui.core.queue.Manager.flush();

        var playRootEl = this._dummy.getContentElement().getDomElement();

        var innerRoot = document.createElement("div");
        playRootEl.appendChild(innerRoot);
        this._playRoot = new qx.ui.root.Inline(innerRoot);

        this._playRoot._setLayout(new qx.ui.layout.Canvas());

        var self = this;

        this._playRoot.getLayoutParent = function () {
          return self.__P_434_1;
        };

        this.__P_434_1.getChildren = this.__P_434_1._getChildren = function () {
          return [self._playRoot];
        }; // copy the initial size which is availbale due to the flush at the beginning


        this._playRoot.setMinWidth(this.__P_434_1.getBounds().width);

        this._playRoot.setMinHeight(this.__P_434_1.getBounds().height);

        this.__P_434_1.addListener("resize", function (e) {
          var data = e.getData();

          this._playRoot.setMinWidth(data.width);

          this._playRoot.setMinHeight(data.height);
        }, this);

        this._playApp = new qx.application.Standalone();

        this._playApp.getRoot = function () {
          return self._playRoot;
        };

        this._playRoot.addListener("resize", function (e) {
          var data = e.getData();

          this._dummy.setMinWidth(data.width);

          this._dummy.setMinHeight(data.height);
        }, this);

        this._initialized = true;
      },

      /**
       * Sets the caption of the playarea to the given text.
       * @param text {String} The new text of the caption.
       */
      updateCaption: function updateCaption(text) {
        this.__P_434_0.setValue(text);
      },

      /**
       * Disposes the objects added in the playarea.
       * Therefore, it uses a two step process, which could fail ins some
       * scenarios.
       *
       * First step takes all widgets added to the playarea's root and destroys
       * them.
       *
       * The second step uses the given dumps of the qx registry and compares the
       * additionally available classes with the sourcecode. If the classname of
       * the new objects are in the code, the objects will be disposed.
       *
       * @param beforeReg {Object} A copy of the qx object registry before running
       *   the application.
       * @param afterReg {Object} A copy of the qx object registry after running
       *   the application
       * @param code {String} The code of the application as string.
       */
      reset: function reset(beforeReg, afterReg, code) {
        if (!this._initialized) {
          return;
        }

        var ch = this._playRoot.getChildren();

        var i = ch.length;

        while (i--) {
          if (ch[i]) {
            ch[i].destroy();
          }
        }

        var layout = this._playRoot.getLayout();

        this._playRoot.setLayout(new qx.ui.layout.Canvas());

        layout.dispose();

        if (!beforeReg) {
          return;
        } // flush the dispose queue to get the ui controlls disposed


        qx.ui.core.queue.Dispose.flush(); // clean up the registry. Only really new objects should be in

        for (var hash in afterReg) {
          if (!beforeReg[hash] && !afterReg[hash].isDisposed()) {
            // check if the object could be created by the code
            if (code.indexOf(afterReg[hash].classname) != -1) {
              // if yes, dispose it
              var item = afterReg[hash]; // skip singletons

              if (item.constructor.$$instance === item) {
                continue;
              }

              item.destroy ? item.destroy() : item.dispose();
            }
          }
        }
      },

      /**
       * Returns the used application.
       * @return {qx.application.Standalone} A clone of the playground app.
       */
      getApp: function getApp() {
        return this._playApp;
      }
    },

    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */
    destruct: function destruct() {
      this._disposeObjects("__P_434_0", "__P_434_1", "_dummy", "_playRoot", "_playApp");
    }
  });
  qxl.playground.view.RiaPlayArea.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=RiaPlayArea.js.map?dt=1590412588382