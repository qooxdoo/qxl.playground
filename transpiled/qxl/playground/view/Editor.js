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
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MBlocker": {
        "require": true
      },
      "qx.util.ResourceManager": {},
      "qx.bom.request.Script": {},
      "qx.ui.layout.VBox": {},
      "qx.ui.decoration.Decorator": {},
      "qx.ui.layout.HBox": {},
      "qx.ui.basic.Label": {},
      "qx.ui.form.TextArea": {},
      "qx.bom.Font": {},
      "qx.ui.core.Widget": {},
      "qx.bom.client.Engine": {},
      "qx.bom.client.Browser": {},
      "qx.bom.Stylesheet": {},
      "qx.bom.Cookie": {},
      "qx.event.Timer": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "browser.version": {
          "className": "qx.bom.client.Browser"
        },
        "browser.documentmode": {
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
       2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Container for the source code editor.
   *
   * @asset(qxl/playground/*)
   * @ignore(ace.*, require)
   */
  qx.Class.define("qxl.playground.view.Editor", {
    extend: qx.ui.container.Composite,
    include: qx.ui.core.MBlocker,
    statics: {
      loadAce: function loadAce(clb, ctx) {
        var resource = ["qxl/playground/editor/ace.js", "qxl/playground/editor/theme-eclipse.js", "qxl/playground/editor/mode-javascript.js"];

        var load = function load(list) {
          if (list.length == 0) {
            clb.call(ctx);
            return;
          }

          var res = list.shift();
          var uri = qx.util.ResourceManager.getInstance().toUri(res);
          var loader = new qx.bom.request.Script();

          loader.onload = function () {
            load(list);
          };

          loader.open("GET", uri);
          loader.send();
        };

        load(resource);
      }
    },
    construct: function construct() {
      qx.ui.container.Composite.constructor.call(this);
    },
    events: {
      /**
       * Event for signaling that the highlighting could not be done by the editor.
       */
      "disableHighlighting": "qx.event.type.Event"
    },
    members: {
      __P_431_0: null,
      __P_431_1: null,
      __P_431_2: null,
      __P_431_3: null,
      __P_431_4: null,

      /**
       * The constructor was spit up to make the included mixin available during
       * the init process.
       */
      init: function init() {
        this.setBackgroundColor("white"); // If widgets are added to the container, the zIndex of the editor blocker
        // is set to 100. This makes possible to resize the splitpanes

        this.addListener("addChildWidget", function () {
          this.getBlocker().getBlockerElement().setStyles({
            "zIndex": 100
          });
        }, this); // layout stuff

        var layout = new qx.ui.layout.VBox();
        this.setLayout(layout);
        this.setDecorator("main"); // caption

        var dec = new qx.ui.decoration.Decorator().set({
          widthBottom: 1,
          colorBottom: "border-separator"
        });
        var caption = new qx.ui.container.Composite().set({
          padding: 5,
          allowGrowX: true,
          allowGrowY: true,
          backgroundColor: "white",
          decorator: dec
        });
        this.add(caption); // configure caption

        caption.setLayout(new qx.ui.layout.HBox(10));
        caption.add(new qx.ui.basic.Label(this.tr("Source Code")).set({
          font: "bold"
        }));
        this.__P_431_4 = new qx.ui.basic.Label().set({
          textColor: "red"
        });
        caption.add(this.__P_431_4); // plain text area

        this.__P_431_0 = new qx.ui.form.TextArea().set({
          wrap: false,
          font: qx.bom.Font.fromString("14px monospace"),
          backgroundColor: "white",
          padding: [0, 0, 0, 5],
          decorator: null
        });
        this.add(this.__P_431_0, {
          flex: 1
        });
        this.__P_431_2 = new qx.ui.core.Widget();
        var highlightDisabled = false;
        var badIE = qx.core.Environment.get("engine.name") == "mshtml";

        if (badIE) {
          badIE = parseFloat(qx.core.Environment.get("browser.version")) <= 8 || qx.core.Environment.get("browser.documentmode") <= 8;
        }

        var opera = qx.core.Environment.get("engine.name") == "opera"; // FF2 does not have that...

        if (!document.createElement("div").getBoundingClientRect || badIE || opera || !window.ace) {
          this.fireEvent("disableHighlighting");
          highlightDisabled = true;
        } else {
          this.__P_431_2.addListenerOnce("appear", function () {
            this.__P_431_5();
          }, this);
        }

        this.__P_431_2.setVisibility("excluded");

        this.add(this.__P_431_2, {
          flex: 1
        }); // override the focus border CSS of the editor

        qx.bom.Stylesheet.createElement(".ace_editor {border: 0px solid #9F9F9F !important;}"); // chech the initial highlight state

        var shouldHighligth = qx.bom.Cookie.get("playgroundHighlight") !== "false";
        this.useHighlight(!highlightDisabled && shouldHighligth);
      },

      /**
       * This code part uses the ajax.org code editor library to add a
       * syntax-highlighting editor as an textarea replacement
       *
       * @ignore(ace.edit, require)
       */
      __P_431_5: function __P_431_5() {
        // timout needed for chrome to not get the ACE layout wrong and show the
        // text on top of the gutter
        qx.event.Timer.once(function () {
          var container = this.__P_431_2.getContentElement().getDomElement(); // create the editor


          var editor = this.__P_431_3 = ace.edit(container); // set javascript mode

          var JavaScriptMode = require("ace/mode/javascript").Mode;

          editor.getSession().setMode(new JavaScriptMode()); // configure the editor

          var session = editor.getSession();
          session.setUseSoftTabs(true);
          session.setTabSize(2); // copy the inital value

          session.setValue(this.__P_431_0.getValue() || "");
          var self = this; // append resize listener

          this.__P_431_2.addListener("resize", function () {
            // use a timeout to let the layout queue apply its changes to the dom
            window.setTimeout(function () {
              self.__P_431_3.resize();
            }, 0);
          });
        }, this, 500);
      },

      /**
       * Returns the current set code of the editor.
       * @return {String} The current set text.
       */
      getCode: function getCode() {
        if (this.__P_431_1 && this.__P_431_3) {
          return this.__P_431_3.getSession().getValue();
        } else {
          return this.__P_431_0.getValue();
        }
      },

      /**
       * Sets the given code to the editor.
       * @param code {String} The new code.
       */
      setCode: function setCode(code) {
        if (this.__P_431_3) {
          this.__P_431_3.getSession().setValue(code); // move cursor to start to prevent scrolling to the bottom


          this.__P_431_3.renderer.scrollToX(0);

          this.__P_431_3.renderer.scrollToY(0);

          this.__P_431_3.selection.moveCursorFileStart();
        }

        this.__P_431_0.setValue(code);
      },

      /**
       * Displays the given error in the caption bar.
       * @param ex {Exception} The exception to display.
       */
      setError: function setError(ex) {
        this.__P_431_4.setValue(ex ? ex.toString() : "");
      },

      /**
       * Switches between the ajax code editor editor and a plain textarea.
       * @param value {Boolean} True, if the code editor should be used.
       */
      useHighlight: function useHighlight(value) {
        this.__P_431_1 = value;

        if (value) {
          // change the visibility
          this.__P_431_2.setVisibility("visible");

          this.__P_431_0.setVisibility("excluded"); // copy the value, if the editor already availabe


          if (this.__P_431_3) {
            this.__P_431_3.getSession().setValue(this.__P_431_0.getValue());
          }
        } else {
          // change the visibility
          this.__P_431_2.setVisibility("excluded");

          this.__P_431_0.setVisibility("visible"); // copy the value, if the editor already availabe


          if (this.__P_431_3) {
            this.__P_431_0.setValue(this.__P_431_3.getSession().getValue());
          }
        }
      }
    },

    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */
    destruct: function destruct() {
      this._disposeObjects("__P_431_0");

      this.__P_431_3 = null;
    }
  });
  qxl.playground.view.Editor.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Editor.js.map?dt=1590412588187