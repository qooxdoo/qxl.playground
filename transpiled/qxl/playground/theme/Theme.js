(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.indigo.Color": {
        "require": true
      },
      "qxl.playground.theme.Decoration": {
        "require": true
      },
      "qxl.playground.theme.Font": {
        "require": true
      },
      "qxl.playground.theme.Appearance": {
        "require": true
      },
      "qx.theme.icon.Tango": {
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
   * Playgrounds default theme, mostly the indigo theme.
   */
  qx.Theme.define("qxl.playground.theme.Theme", {
    meta: {
      color: qx.theme.indigo.Color,
      decoration: qxl.playground.theme.Decoration,
      font: qxl.playground.theme.Font,
      appearance: qxl.playground.theme.Appearance,
      icon: qx.theme.icon.Tango
    }
  });
  qxl.playground.theme.Theme.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Theme.js.map?dt=1590412587923