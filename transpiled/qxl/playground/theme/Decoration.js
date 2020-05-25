(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.indigo.Decoration": {
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
  
  ************************************************************************* */
  qx.Theme.define("qxl.playground.theme.Decoration", {
    extend: qx.theme.indigo.Decoration,
    aliases: {
      decoration: "qx/decoration/Simple"
    },
    decorations: {
      "mode-select-tab": {
        include: "tabview-page-button-top",
        style: {
          color: "highlight-shade",
          backgroundColor: "background-selected"
        }
      }
    }
  });
  qxl.playground.theme.Decoration.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Decoration.js.map?dt=1590412588285