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
      "qx.application.Standalone": {
        "require": true
      },
      "qx.locale.Manager": {
        "require": true
      },
      "qx.event.GlobalError": {},
      "qx.ui.layout.VBox": {},
      "qx.ui.container.Composite": {},
      "qxl.playground.view.Header": {},
      "qxl.playground.view.Toolbar": {},
      "qx.ui.splitpane.Pane": {},
      "qxl.playground.view.Samples": {},
      "qx.data.store.Offline": {},
      "qxl.playground.Samples": {},
      "qxl.playground.view.Editor": {},
      "qxl.playground.view.PlayArea": {},
      "qxl.logpane.LogPane": {},
      "qx.bom.Cookie": {},
      "qxl.playground.view.WebsiteContent": {},
      "qx.bom.client.Engine": {},
      "qx.bom.client.Browser": {},
      "qx.data.marshal.Json": {},
      "qx.bom.History": {},
      "qx.lang.Json": {},
      "qx.ui.core.queue.Manager": {},
      "qx.lang.Object": {},
      "qx.core.ObjectRegistry": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        },
        "qx.serve.appspath": {},
        "qx.serve.docspath": {}
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2008-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Andreas Ecker (ecker)
       * Yuecel Beser (ybeser)
       * Jonathan Weiß (jonathan_rass)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Playground application, which allows for source code editing and live
   * previews of a simple custom application.
   *
   * @ignore(location.*)
   * @asset(qx/icon/Tango/22/*)
   * 
   */
  qx.Class.define("qxl.playground.Application", {
    extend: qx.application.Standalone,
    properties: {
      /** The name of the current application.*/
      name: {
        check: "String",
        apply: "_applyName",
        init: ""
      },

      /** Code to check agains as unchanged source of the loaded code.*/
      originCode: {
        check: "String",
        apply: "_applyOriginCode",
        init: ""
      },

      /** The current selected sample model. */
      currentSample: {
        apply: "_applyCurrentSample",
        event: "changeCurrentSample",
        nullable: true
      }
    },

    /*
     *****************************************************************************
        MEMBERS
     *****************************************************************************
    */
    members: {
      // UI Components
      __P_426_0: null,
      __P_426_1: null,
      __P_426_2: null,
      __P_426_3: null,
      __P_426_4: null,
      __P_426_5: null,
      __P_426_6: null,
      __P_426_7: null,
      __P_426_8: null,
      // storages
      __P_426_9: null,
      __P_426_10: null,
      __P_426_11: null,
      __P_426_12: null,
      __P_426_13: null,
      // flag used for the warning for IE
      __P_426_14: false,
      __P_426_15: false,
      // used for removing the created objects in the run code
      __P_426_16: null,
      __P_426_17: null,
      __P_426_18: null,
      __P_426_19: qx.locale.Manager.tr("Unfortunately, an unrecoverable internal error was caused by your code. This may prevent the playground application to run properly.||"),
      __P_426_20: null,
      __P_426_21: null,

      /**
       * This method contains the initial application code and gets called
       * during startup of the application.
       */
      main: function main() {
        // Call super class
        qxl.playground.Application.prototype.main.base.call(this); // register error handler

        qx.event.GlobalError.setErrorHandler(this.__P_426_22, this); // container layout

        var layout = new qx.ui.layout.VBox(); // main container

        var mainContainer = new qx.ui.container.Composite(layout);
        this.getRoot().add(mainContainer, {
          edge: 0
        }); // qooxdoo header

        this.__P_426_0 = new qxl.playground.view.Header();
        mainContainer.add(this.__P_426_0, {
          flex: 0
        });

        this.__P_426_0.addListener("changeMode", this._onChangeMode, this); // toolbar


        this.__P_426_2 = new qxl.playground.view.Toolbar();
        mainContainer.add(this.__P_426_2, {
          flex: 0
        }); // toolbar listener

        this.__P_426_2.addListener("run", this.run, this);

        this.__P_426_2.addListener("changeSample", this.__P_426_23, this);

        this.__P_426_2.addListener("changeHighlight", this.__P_426_24, this);

        this.__P_426_2.addListener("changeLog", this.__P_426_25, this);

        this.__P_426_2.addListener("shortenUrl", this.__P_426_26, this);

        this.__P_426_2.addListener("openApi", this.__P_426_27, this);

        this.__P_426_2.addListener("openManual", this.__P_426_28, this);

        this.__P_426_2.addListener("openDemoBrowser", this.__P_426_29, this); // mainsplit, contains the editor splitpane and the info splitpane


        this.__P_426_1 = new qx.ui.splitpane.Pane("horizontal");
        mainContainer.add(this.__P_426_1, {
          flex: 1
        });

        this.__P_426_1.setAppearance("app-splitpane"); // editor split (left side of main split)


        this.__P_426_7 = new qx.ui.splitpane.Pane("horizontal");

        this.__P_426_7.setDecorator(null); // get rid of the 3px broder
        // info split (right side of the main split)


        var infosplit = new qx.ui.splitpane.Pane("vertical");
        infosplit.setDecorator(null); // examples pane

        this.__P_426_6 = new qxl.playground.view.Samples();

        this.__P_426_6.addListener("save", this.__P_426_30, this);

        this.__P_426_6.addListener("saveAs", this.__P_426_31, this);

        this.__P_426_6.addListener("delete", this.__P_426_32, this);

        this.__P_426_6.addListener("rename", this.__P_426_33, this);

        this.bind("currentSample", this.__P_426_6, "currentSample");

        this.__P_426_6.addListener("beforeSelectSample", function (e) {
          if (this.__P_426_34()) {
            e.stop();
          }
        }, this);

        this.__P_426_6.addListener("selectSample", function (e) {
          this.setCurrentSample(e.getData());
        }, this); // initialize custom samples


        this.__P_426_10 = new qx.data.store.Offline("qooxdoo-playground-samples"); // if the local storage is not empty

        if (this.__P_426_10.getModel() != null) {
          // use the stored array to initialize the built in samples
          this.__P_426_9 = new qxl.playground.Samples(this.__P_426_10.getModel());
        } else {
          // init the samples and store in the local storage
          this.__P_426_9 = new qxl.playground.Samples();

          this.__P_426_10.setModel(this.__P_426_9.getModel());
        }

        this.__P_426_10.bind("model", this.__P_426_6, "model"); // need to split up the creation process


        this.__P_426_4 = new qxl.playground.view.Editor();

        this.__P_426_4.addListener("disableHighlighting", function () {
          this.__P_426_2.enableHighlighting(false);
        }, this);

        qxl.playground.view.Editor.loadAce(function () {
          this.init();
        }, this);

        this.__P_426_7.add(this.__P_426_6, 1);

        this.__P_426_7.add(this.__P_426_4, 4);

        this.__P_426_1.add(this.__P_426_7, 6);

        this.__P_426_1.add(infosplit, 3);

        this.__P_426_5 = new qxl.playground.view.PlayArea();

        this.__P_426_5.addListener("toggleMaximize", this._onToggleMaximize, this);

        infosplit.add(this.__P_426_5, 2);

        this.__P_426_1.getChildControl("splitter").addListener("pointerdown", function () {
          this.__P_426_4.block();
        }, this);

        this.__P_426_1.addListener("losecapture", function () {
          this.__P_426_4.unblock();
        }, this);

        this.__P_426_3 = new qxl.logpane.LogPane();
        infosplit.add(this.__P_426_3, 1);

        this.__P_426_3.exclude();
      },

      /**
       * Initialization after the external editor has been loaded.
       */
      init: function init() {
        this.__P_426_4.init(); // check if mobile chould be used


        if (this.__P_426_35("mobile")) {
          // check for the mode cookie
          if (qx.bom.Cookie.get("playgroundMode") === "mobile") {
            this.setMode("mobile");
          } else {
            this.setMode("ria");
          }
        } else {
          this.setMode("ria");

          this.__P_426_0.setEnabledMode("mobile", false);
        } // Back button and bookmark support


        this.__P_426_36(); // check for the highlight and examples cookie


        if (qx.bom.Cookie.get("playgroundHighlight") === "false") {
          this.__P_426_4.useHighlight(false);
        }

        if (qx.bom.Cookie.get("playgroundShowExamples") === "false") {
          this.__P_426_2.showExamples(false);
        }
      },
      // ***************************************************
      // PROPERTY APPLY
      // ***************************************************
      // property apply
      _applyName: function _applyName(value, old) {
        if (!this.__P_426_5) {
          return;
        }

        this.__P_426_5.updateCaption(value);

        this.__P_426_37(value);
      },
      // property apply
      _applyOriginCode: function _applyOriginCode(value, old) {
        this.__P_426_15 = false;
      },
      // property apply
      _applyCurrentSample: function _applyCurrentSample(newSample, old) {
        // ignore when the sample is set to null
        if (!newSample) {
          return;
        }

        this.setMode(newSample.getMode()); // need to get the code from the editor in case he changes something
        // in the code

        this.__P_426_4.setCode(newSample.getCode());

        this.setOriginCode(this.__P_426_4.getCode()); // only add static samples to the url as name

        if (newSample.getCategory() == "static") {
          this.__P_426_11.addToHistory(newSample.getName() + "-" + newSample.getMode());
        } else {
          this.__P_426_38(newSample.getCode());
        }

        this.setName(newSample.getName()); // run the new sample

        this.run();
      },
      // ***************************************************
      // MODE HANDLING
      // ***************************************************
      __P_426_39: function __P_426_39(enabled) {
        if (enabled) {
          this.__P_426_2.exclude();

          this.__P_426_1.exclude();
        } else {
          this.__P_426_2.show();

          this.__P_426_1.show();
        } // on demand creation


        if (!this.__P_426_8 && enabled) {
          this.__P_426_8 = new qxl.playground.view.WebsiteContent();
          this.getRoot().getChildren()[0].add(this.__P_426_8, {
            flex: 1
          });
        }

        if (this.__P_426_8) {
          if (!enabled) {
            this.__P_426_8.exclude();
          } else {
            this.__P_426_8.show();
          }
        }
      },

      /**
       * Event handler for changing the mode of the palyground.
       * @param e {qx.event.type.Data} The data event containing the mode.
       */
      _onChangeMode: function _onChangeMode(e) {
        var mode = e.getData(); // ignore setting the same mode

        if (mode == this.__P_426_20) {
          return;
        }

        if (!this.setMode(mode)) {
          this.__P_426_0.setMode(e.getOldData());
        } else {
          // select the first sample
          this.setCurrentSample(this.__P_426_9.getFirstSample(mode));
        }
      },

      /**
       * Helper to determinate if the mode is currently supported e.g. mobile
       * in the current runtime.
       * @param mode {String} The name of the mode.
       * @return {boolean} <code>true</code>, if the given mode can be used.
       */
      __P_426_35: function __P_426_35(mode) {
        if (mode == "mobile") {
          var engine = qx.core.Environment.get("engine.name"); // all webkits are ok

          if (engine == "webkit") {
            return true;
          } // ie > 10 is ok


          if (engine == "mshtml" && parseInt(qx.core.Environment.get("browser.documentmode")) >= 10) {
            return true;
          } // ff > 10 is ok


          if (engine == "gecko" && parseInt(qx.core.Environment.get("engine.version")) >= 10) {
            return true;
          }
        } else if (mode == "ria" || mode == "website") {
          return true;
        }

        return false;
      },

      /**
       * Setter and dispatcher for the current mode the playground is in.
       * @param mode {String} The mode to use.
       */
      setMode: function setMode(mode) {
        // check if the mode is supported
        if (!this.__P_426_35(mode)) {
          throw new Error("Mode '" + mode + "' not supported");
        } // only set new mode if not already set


        if (this.__P_426_20 == mode) {
          return true;
        } // only change the mode if no code gets lost


        if (this.__P_426_34()) {
          return false;
        } // store the mode


        qx.bom.Cookie.set("playgroundMode", mode, 100);
        this.__P_426_20 = mode;

        this.__P_426_39(mode == "website"); // update the views (changes the play application)


        this.__P_426_5.setMode(mode);

        this.__P_426_0.setMode(mode);

        this.__P_426_6.setMode(mode); // erase the code


        this.__P_426_4.setCode("");

        return true;
      },
      // ***************************************************
      // SAMPEL SAVE / DELETE
      // ***************************************************

      /**
       * Helper to write the current code to the model and with that to the
       * offline store.
       */
      __P_426_30: function __P_426_30() {
        var current = this.getCurrentSample(); // if we don't have a current sample and the sample is a static one

        if (!current || current.getCategory() == "static") {
          this.__P_426_31(); // if its a user sample which is selected, we just store the new code

        } else {
          // store in curent sample
          current.setCode(this.__P_426_4.getCode());
          this.setOriginCode(current.getCode()); // set the name to make sure no "changed" state is displayed

          this.setName(current.getName());
        }
      },

      /**
       * Helper to write the current code to the model and with that to the
       * offline store.
       * @lint ignoreDeprecated(confirm)
       */
      __P_426_31: function __P_426_31() {
        // ask the user for a new name for the property
        var name = window.prompt(this.tr("Please enter a name"), ""); // empty value string of IE

        if (!name) {
          return;
        } // check for overriding sample names


        var samples = this.__P_426_10.getModel();

        for (var i = 0; i < samples.length; i++) {
          if (samples.getItem(i).getName() == name) {
            if (window.confirm(this.tr("Sample already exists. Do you want to overwrite?"))) {
              this.__P_426_30();
            }

            return;
          }
        }

        ; // create new sample

        var data = {
          name: name,
          code: this.__P_426_4.getCode(),
          mode: this.__P_426_20,
          category: "user"
        };
        var sample = qx.data.marshal.Json.createModel(data, true); // push the data to the model (storest automatically)

        this.__P_426_10.getModel().push(sample); // store the origin code and select the new sample


        this.setOriginCode(sample.getCode());

        this.__P_426_6.select(sample);
      },

      /**
       * Helper to delete the selected sample.
       */
      __P_426_32: function __P_426_32() {
        var current = this.getCurrentSample(); // if we have a sample selected and its not a static one

        if (current || current.getCategory() != "static") {
          // remove the selection
          this.__P_426_6.select(null); // delete the current sample


          this.__P_426_10.getModel().remove(current); // reset the current selected sample


          this.setCurrentSample(null);
        }
      },

      /**
       * Helper to rename a sample.
       */
      __P_426_33: function __P_426_33() {
        var current = this.getCurrentSample(); // if we have a sample and its not a static one

        if (current || current.getCategory() != "static") {
          // ask the user for a new name
          var name = window.prompt(this.tr("Please enter a name"), current.getName());

          if (!name) {
            return;
          } // just write the new name to the to the sample


          current.setName(name);
        }
      },

      /**
       * Helper to toggle the editors split pane which means togglinge the
       * visibility of the editor and the samples pane.
       */
      _onToggleMaximize: function _onToggleMaximize() {
        this.__P_426_21 = !this.__P_426_21;

        if (this.__P_426_21) {
          this.__P_426_7.exclude();
        } else {
          this.__P_426_7.show();
        }
      },
      // ***************************************************
      // TOOLBAR HANDLER
      // ***************************************************

      /**
       * Handler for sample changes of the toolbar.
       * @param e {qx.event.type.Data} Data event containing the boolean
       * weather the examples should be shown.
       */
      __P_426_23: function __P_426_23(e) {
        qx.bom.Cookie.set("playgroundShowExamples", e.getData(), 100);

        if (e.getData()) {
          this.__P_426_6.show();
        } else {
          this.__P_426_6.exclude();
        }
      },

      /**
       * Handler for the changeHighlight event of the toolbar.
       * @param e {qx.event.type.Data} Data event containing the boolean to change
       *   the highlighted code view.
       */
      __P_426_24: function __P_426_24(e) {
        qx.bom.Cookie.set("playgroundHighlight", e.getData(), 100);

        this.__P_426_4.useHighlight(e.getData());
      },

      /**
       * Handler for showing the log of the toolbar.
       * @param e {qx.event.type.Data} Data event containing if the log should
       *   be shown.
       */
      __P_426_25: function __P_426_25(e) {
        e.getData() ? this.__P_426_3.show() : this.__P_426_3.exclude();
      },

      /**
       * Handler for the url shortening service.
       */
      __P_426_26: function __P_426_26() {
        window.open("http://tinyurl.com/create.php?url=" + encodeURIComponent(location.href), "tinyurl", "width=800,height=600,resizable=yes,scrollbars=yes");
      },

      /**
       * Handler for opening the api viewer.
       */
      __P_426_27: function __P_426_27() {
        window.open((qx.core.Environment.get("qx.serve.appspath") || "https://www.qooxdoo.org/qxl.") + "apiviewer/");
      },

      /**
       * Handler for opening the manual.
       */
      __P_426_28: function __P_426_28() {
        window.open((qx.core.Environment.get("qx.serve.docspath") || "https://www.qooxdoo.org/") + "docs");
      },

      /**
       * Handler for opening the demo browser.
       */
      __P_426_29: function __P_426_29() {
        window.open((qx.core.Environment.get("qx.serve.appspath") || "https://www.qooxdoo.org/qxl.") + "widgetbrowser/");
      },
      // ***************************************************
      // HISTORY SUPPORT
      // ***************************************************

      /**
       * Back button and bookmark support
       */
      __P_426_36: function __P_426_36() {
        this.__P_426_11 = qx.bom.History.getInstance();

        this.__P_426_11.addListener("changeState", this.__P_426_40, this); // Handle bookmarks


        var state = this.__P_426_11.getState();

        var name = state.replace(/_/g, " ");
        var code = ""; // checks if the state corresponds to a sample. If yes, the application
        // will be initialized with the selected sample

        if (state && this.__P_426_9.isAvailable(state)) {
          var sample = this.__P_426_9.get(state);

          this.setCurrentSample(sample);
          return; // check if a mode is given
        } else if (state.indexOf("mode=") == 0) {
          var mode = state.substring(5, state.length);

          if (mode == "mobile") {
            // try to set the mobile mode but if its not supported, take ria
            try {
              this.setMode("mobile");
            } catch (e) {
              this.setMode("ria");
            }
          } else {
            this.setMode("ria");
          }

          var sample = this.__P_426_9.getFirstSample(this.__P_426_20);

          this.setCurrentSample(sample);
          return; // if there is a state given
        } else if (state && state.charAt(0) == "{") {
          var name = this.tr("Custom Code");
          code = this.__P_426_41(state); // need to get the code from the editor in case he changes something
          // in the code

          this.__P_426_4.setCode(code);

          this.setOriginCode(this.__P_426_4.getCode()); // try to select a custom sample

          this.__P_426_6.selectByCode(code);

          this.setName(name);
          this.run(); // if no state is given
        } else {
          var sample = this.__P_426_9.getFirstSample(this.__P_426_20);

          this.setCurrentSample(sample);
          return;
        }
      },

      /**
       * Handler for changes of the history.
       * @param e {qx.event.type.Data} Data event containing the history changes.
       */
      __P_426_40: function __P_426_40(e) {
        var state = e.getData(); // is a sample name given

        if (this.__P_426_9.isAvailable(state)) {
          var sample = this.__P_426_9.get(state);

          if (this.__P_426_42(sample.getCode(), this.__P_426_4.getCode())) {
            this.setCurrentSample(sample);
          } // is code given

        } else if (state != "") {
          var code = this.__P_426_41(state);

          if (code != this.__P_426_4.getCode()) {
            this.__P_426_4.setCode(code);

            this.setName(this.tr("Custom Code"));
            this.run();
          }
        }
      },

      /**
       * Helper method for parsing the given url parameter to a valid code
       * fragment.
       * @param state {String} The given state of the browsers history.
       * @return {String} A valid code snippet.
       */
      __P_426_41: function __P_426_41(state) {
        try {
          var data = qx.lang.Json.parse(state); // change the mode in case a different mode is given

          if (data.mode && data.mode != this.__P_426_20) {
            this.setMode(data.mode);
          }

          return decodeURIComponent(data.code).replace(/%0D/g, "");
        } catch (e) {
          var error = this.tr("// Could not handle URL parameter! \n// %1", e);

          if (qx.core.Environment.get("engine.name") == "mshtml") {
            error += this.tr("// Your browser has a length restriction of the URL parameter which could have caused the problem.");
          }

          return error;
        }
      },

      /**
       * Adds the given code to the history.
       * @param code {String} the code to add.
       * @lint ignoreDeprecated(confirm)
       */
      __P_426_38: function __P_426_38(code) {
        var codeJson = "{\"code\":\"" + encodeURIComponent(code) + '", "mode":"' + this.__P_426_20 + '"}';

        if (qx.core.Environment.get("engine.name") == "mshtml" && codeJson.length > 1300) {
          if (!this.__P_426_14 && window.confirm(this.tr("Cannot append sample code to URL, as it is too long. Disable this warning in the future?"))) {
            this.__P_426_14 = true;
          }

          ;
          return;
        }

        this.__P_426_11.addToHistory(codeJson);
      },
      // ***************************************************
      // UPDATE & RUN & COMPARE
      // ***************************************************

      /**
       * Checcks if the code is changed. If that is the case, the user will be
       * prompted to discard the changes.
       *
       * @lint ignoreDeprecated(confirm)
       * @return {Boolean} <code>true</code> if the code has been modified
       */
      __P_426_34: function __P_426_34() {
        var userCode = this.__P_426_4.getCode();

        if (userCode && this.__P_426_42(userCode, this.getOriginCode())) {
          if (!window.confirm(this.tr("Tap OK to discard your changes."))) {
            return true;
          }
        }

        return false;
      },

      /**
       * Special compare method for IE.
       * @param code1 {String} The first code to compare.
       * @param code2 {String} The second code to compare.
       * @return {Boolean} true, if the code is equal.
       */
      __P_426_42: function __P_426_42(code1, code2) {
        if (qx.core.Environment.get("engine.name") == "opera") {
          code1 = code1.replace(/\r?\n/g, "\n");
          code2 = code2.replace(/\r?\n/g, "\n");
          return code1 != code2;
        }

        var compareElem1 = document.getElementById("compare_div1");
        compareElem1.innerHTML = code1;
        var compareElem2 = document.getElementById("compare_div2");
        compareElem2.innerHTML = code2;
        return compareElem1.innerHTML.length != compareElem2.innerHTML.length || compareElem1.innerHTML != compareElem2.innerHTML;
      },

      /**
       * Update the window title with given sample label
       * @param label {String} sample label
       * @return {String} new window title
       */
      __P_426_37: function __P_426_37(label) {
        var title = document.title.split(":")[0] + ": " + label;
        return title;
      },

      /**
       * Updates the qxl.playground.
       */
      __P_426_43: function __P_426_43() {
        var exc;

        this.__P_426_3.clear();

        this.__P_426_5.reset(this.__P_426_16, this.__P_426_17, this.__P_426_18);

        var reg = qx.Class.$$registry;
        delete reg[this.__P_426_13]; // build the code to run

        var code = this.__P_426_4.getCode(); // special replacement for unicode "zero width space" [BUG #3635]


        code = code.replace("\u200B", "");
        code = 'this.info("' + this.tr("Starting application").toString() + " '" + this.getName() + "'" + ' ...");\n' + (code || "") + 'this.info("' + this.tr("Successfully started").toString() + '.");\n'; // try to create a function

        try {
          this.__P_426_18 = code;
          this.fun = qx.event.GlobalError.observeMethod(new Function(code));
        } catch (ex) {
          exc = ex;
        } // run the code


        try {
          // save the current registry
          qx.ui.core.queue.Manager.flush();
          this.__P_426_16 = qx.lang.Object.clone(qx.core.ObjectRegistry.getRegistry()); // run the application

          this.fun.call(this.__P_426_5.getApp());
          qx.ui.core.queue.Manager.flush();
          this.__P_426_17 = qx.lang.Object.clone(qx.core.ObjectRegistry.getRegistry());
        } catch (ex) {
          exc = ex;
        } // store the new standalone app if available


        for (var name in reg) {
          if (this.__P_426_44(name)) {
            this.__P_426_13 = name;

            this.__P_426_45(name);

            break;
          }
        } // error handling


        if (exc) {
          this.error(this.__P_426_19.replace(/\|/g, "\n") + exc);

          this.__P_426_2.showLog(true);

          this.__P_426_3.show();

          this.__P_426_5.reset(this.__P_426_16, this.__P_426_17, this.__P_426_18);
        }

        this.__P_426_3.fetch();
      },

      /**
       * Runs the current set sample and checks if it need to be saved to the url.
       *
       * @param e {qx.event.type.Event} A possible events (unused)
       */
      run: function run(e) {
        var code = this.__P_426_4.getCode();

        if (code && this.__P_426_42(code, this.getOriginCode())) {
          this.__P_426_38(code);

          if (!this.__P_426_15) {
            this.setName(this.tr("%1 (modified)", this.getName()));
          }

          this.__P_426_15 = true;
        }

        this.__P_426_43();
      },

      /**
       * Handler for global errors.
       *
       * @param e {Event} The global error event
       */
      __P_426_22: function __P_426_22(e) {
        this.error(e);
      },
      // ***************************************************
      // STANDALONE SUPPORT
      // ***************************************************

      /**
       * Determines whether the class (given by name) exists in the object
       * registry and is a qooxdoo application class.
       *
       * @param name {String} Name of the class to examine
       * @return {Boolean} Whether it is a registered application class
       */
      __P_426_44: function __P_426_44(name) {
        if (name === "qxl.playground.Application") {
          return false;
        }

        var clazz = qx.Class.$$registry[name]; // ria mode supports standalone applications

        if (this.__P_426_20 == "ria") {
          return clazz && clazz.superclass && clazz.superclass.classname === "qx.application.Standalone"; // mobile mode supports mobild applications
        } else if (this.__P_426_20 == "mobile") {
          return clazz && clazz.superclass && clazz.superclass.classname === "qx.application.Mobile";
        }

        return false;
      },

      /**
       * Execute the class (given by name) as a standalone app
       *
       * @param name {String} Name of the application class to execute
       */
      __P_426_45: function __P_426_45(name) {
        var self = this;

        qx.application.Standalone.prototype._createRootWidget = function () {
          return self.__P_426_5.getApp().getRoot();
        };

        var app = new qx.Class.$$registry[name]();

        try {
          app.main();
          qx.ui.core.queue.Manager.flush();
        } catch (ex) {
          var exc = ex;
          this.error(this.__P_426_19.replace(/\|/g, "\n") + exc);
        }
      }
    },

    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */
    destruct: function destruct() {
      this.__P_426_11 = this.__P_426_16 = this.__P_426_17 = null;

      this._disposeObjects("__P_426_13", "__P_426_9", "__P_426_2", "__P_426_4", "__P_426_5", "__P_426_3");
    }
  });
  qxl.playground.Application.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Application.js.map?dt=1590412587909