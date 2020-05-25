(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.indigo.Appearance": {
        "require": true
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
   * A custom apperance theme for the qxl.playground.
   */
  qx.Theme.define("qxl.playground.theme.Appearance", {
    extend: qx.theme.indigo.Appearance,
    appearances: {
      "app-header": {
        style: function style(states) {
          return {
            font: "headline",
            textColor: "text-selected",
            backgroundColor: "background-selected-dark",
            decorator: "app-header",
            padding: [10, 10, 0, 10]
          };
        }
      },
      "modeButton": {
        include: "tabview-page/button",
        alias: "tabview-page/button",
        style: function style(states, superStyles) {
          return {
            font: states.checked ? "bold" : "default",
            textColor: "white",
            decorator: states.checked ? "mode-select-tab" : null,
            padding: [2, 15, 6, 15],
            marginBottom: -5,
            marginTop: 8
          };
        }
      },
      "website-content": {
        style: function style() {
          return {
            backgroundColor: "light-background"
          };
        }
      },
      "sample-list": {
        include: "list",
        alias: "list",
        style: function style(states) {
          return {
            decorator: "separator-vertical",
            padding: 0
          };
        }
      }
    }
  });
  qxl.playground.theme.Appearance.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Appearance.js.map?dt=1590412588320