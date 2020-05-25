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
      "qx.ui.basic.Label": {
        "construct": true
      },
      "qx.ui.list.List": {},
      "qx.event.type.Event": {},
      "qx.locale.Manager": {},
      "qx.ui.toolbar.ToolBar": {},
      "qx.ui.toolbar.Button": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Container for the examples.
   *
   * @ignore(require)
   * @ignore(ace)
   * @asset(qxl/playground/*)
   * @asset(qx/icon/${qx.icontheme}/16/actions/document-save.png)
   * @asset(qx/icon/${qx.icontheme}/16/places/user-trash.png)
   * @asset(qx/icon/${qx.icontheme}/16/actions/document-save-as.png)
   * @asset(qx/icon/${qx.icontheme}/16/actions/format-text-direction-ltr.png)
   */
  qx.Class.define("qxl.playground.view.Samples", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
      qx.ui.container.Composite.constructor.call(this); // layout stuff

      var layout = new qx.ui.layout.VBox();
      this.setLayout(layout);
      this.setDecorator("main"); // caption

      var caption = new qx.ui.basic.Label(this.tr("Samples")).set({
        font: "bold",
        padding: 5,
        allowGrowX: true,
        allowGrowY: true
      });
      this.add(caption); // list

      this.add(this._createList(), {
        flex: 1
      }); // toolbar

      this.add(this._createToolbar()); // make sure we are on a white background

      this.setBackgroundColor("white");
    },
    events: {
      /** Change event which signals the change of an example.*/
      "selectSample": "qx.event.type.Data",

      /** Event triggered by the save button. */
      "save": "qx.event.type.Event",

      /** Event triggered by the save as button. */
      "saveAs": "qx.event.type.Event",

      /** Event triggered by the delete button. */
      "delete": "qx.event.type.Event",

      /** Event triggered by the rename button. */
      "rename": "qx.event.type.Event",

      /** Cancelable event fired before the selection changes. */
      "beforeSelectSample": "qx.event.type.Event"
    },
    properties: {
      /** Model property which contains the data for showing the examples. */
      model: {
        check: "qx.data.IListData",
        event: "changeModel",
        apply: "_applyModel"
      },

      /** Storage for the application mode. */
      mode: {
        check: "String",
        apply: "_applyMode",
        init: ""
      },

      /** Storage for the current selected sample, if any. */
      currentSample: {
        apply: "_applyCurrentSample",
        nullable: true
      }
    },
    members: {
      __P_430_0: null,
      __P_430_1: null,
      __P_430_2: null,

      /**
       * Selects the given example. If non is given, the selection will be
       * removed.
       * @param sample {qx.core.Obejct} The sample to select.
       */
      select: function select(sample) {
        this.__P_430_0.getSelection().setItem(0, sample);
      },

      /**
       * Selects a sample by the given code.
       * @param code {String} The code which the sample contains.
       */
      selectByCode: function selectByCode(code) {
        var model = this.__P_430_0.getModel();

        for (var i = 0; i < model.length; i++) {
          if (model.getItem(i).getCode() == code) {
            this.select(model.getItem(i));
            return;
          }
        }
      },

      /**
       * Creating helper which is responsible for creating the list.
       */
      _createList: function _createList() {
        // create and configure the list
        this.__P_430_0 = new qx.ui.list.List();

        this.__P_430_0.setAppearance("sample-list");

        this.__P_430_0.setLabelPath("name"); // CAREFUL: HACK TO GET THE SELECTION PREVENTED


        this.__P_430_0._manager.detatchPointerEvents(); // store the old pointer handler


        var oldHandler = this.__P_430_0._manager.handleTap;
        var self = this; // attach a new handler function

        this.__P_430_0._manager.handleTap = function (e) {
          // fire the cancelable event
          var changeOk = self.fireEvent("beforeSelectSample", qx.event.type.Event, [false, true]);

          if (changeOk) {
            // if not canceled, execute the original handler
            oldHandler.call(self.__P_430_0._manager, e);
          }
        };

        this.__P_430_0._manager.attachPointerEvents(); // ////////////////////////////////////////////
        // set the delegate


        this.__P_430_0.setDelegate({
          // filter: only show samples for the current mode
          filter: function filter(data) {
            return data.getMode() == self.getMode();
          },
          // group the samples by category
          group: function group(data) {
            if (data.getCategory() == "static") {
              return qx.locale.Manager.tr("Static");
            } else {
              return qx.locale.Manager.tr("User");
            }
          }
        }); // selection change handler


        this.__P_430_0.getSelection().addListener("change", function () {
          var sample = this.__P_430_0.getSelection().getItem(0);

          if (sample) {
            this.fireDataEvent("selectSample", sample);
          }
        }, this);

        return this.__P_430_0;
      },

      /**
       * Helper for creating the toolbar.
       */
      _createToolbar: function _createToolbar() {
        // crate and initialize the toolbar
        var toolbar = new qx.ui.toolbar.ToolBar();
        toolbar.setDecorator("separator-vertical");
        toolbar.setBackgroundColor("white"); // save button

        var saveButton = new qx.ui.toolbar.Button(null, "icon/16/actions/document-save.png");
        toolbar.add(saveButton);
        saveButton.setToolTipText(this.tr("Save"));
        saveButton.addListener("execute", function () {
          this.fireEvent("save");
        }, this); // save as button

        var saveAsButton = new qx.ui.toolbar.Button(null, "icon/16/actions/document-save-as.png");
        toolbar.add(saveAsButton);
        saveAsButton.setToolTipText(this.tr("Save As"));
        saveAsButton.addListener("execute", function () {
          this.fireEvent("saveAs");
        }, this); // delete button

        this.__P_430_1 = new qx.ui.toolbar.Button(null, "icon/16/places/user-trash.png");
        toolbar.add(this.__P_430_1);

        this.__P_430_1.setToolTipText(this.tr("Delete"));

        this.__P_430_1.addListener("execute", function () {
          this.fireEvent("delete");
        }, this); // rename button


        this.__P_430_2 = new qx.ui.toolbar.Button(null, "icon/16/actions/format-text-direction-ltr.png");
        toolbar.add(this.__P_430_2);

        this.__P_430_2.setToolTipText(this.tr("Rename"));

        this.__P_430_2.addListener("execute", function () {
          this.fireEvent("rename");
        }, this);

        return toolbar;
      },
      // property apply
      _applyCurrentSample: function _applyCurrentSample(value) {
        this.select(value); // only change the state of the buttons of they are available

        if (this.__P_430_1 && this.__P_430_2) {
          if (value && value.getCategory() != "static") {
            this.__P_430_1.setEnabled(true);

            this.__P_430_2.setEnabled(true);
          } else {
            this.__P_430_1.setEnabled(false);

            this.__P_430_2.setEnabled(false);
          }
        }
      },
      // property apply
      _applyModel: function _applyModel(value) {
        if (value) {
          this.__P_430_0.setModel(value);
        }
      },
      // property apply
      _applyMode: function _applyMode(value) {
        // refresh is needed because the filter has changed
        this.__P_430_0.refresh();
      }
    }
  });
  qxl.playground.view.Samples.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Samples.js.map?dt=1590412588105