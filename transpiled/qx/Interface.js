function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.lang.normalize.Array": {
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.OOUtil": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * This class is used to define interfaces (similar to Java interfaces).
   *
   * See the description of the {@link #define} method how an interface is
   * defined.
   *
   * @require(qx.lang.normalize.Array)
   */
  qx.Bootstrap.define("qx.Interface", {
    statics: {
      /*
      ---------------------------------------------------------------------------
         PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Define a new interface. Interface definitions look much like class definitions.
       *
       * The main difference is that the bodies of functions defined in <code>members</code>
       * and <code>statics</code> are called before the original function with the
       * same arguments. This can be used to check the passed arguments. If the
       * checks fail, an exception should be thrown. It is convenient to use the
       * method defined in {@link qx.core.MAssert} to check the arguments.
       *
       * In the <code>build</code> version the checks are omitted.
       *
       * For properties only the names are required so the value of the properties
       * can be empty maps.
       *
       * Example:
       * <pre class='javascript'>
       * qx.Interface.define("name",
       * {
       *   extend: [SuperInterfaces],
       *
       *   statics:
       *   {
       *     PI : 3.14
       *   },
       *
       *   properties: {"color": {}, "name": {} },
       *
       *   members:
       *   {
       *     meth1: function() {},
       *     meth2: function(a, b) { this.assertArgumentsCount(arguments, 2, 2); },
       *     meth3: function(c) { this.assertInterface(c.constructor, qx.some.Interface); }
       *   },
       *
       *   events :
       *   {
       *     keydown : "qx.event.type.KeySequence"
       *   }
       * });
       * </pre>
       *
       * @param name {String} name of the interface
       * @param config {Map ? null} Interface definition structure. The configuration map has the following keys:
       *   <table>
       *     <tr><th>Name</th><th>Type</th><th>Description</th></tr>
       *     <tr><th>extend</th><td>Interface |<br>Interface[]</td><td>Single interface or array of interfaces this interface inherits from.</td></tr>
       *     <tr><th>members</th><td>Map</td><td>Map of members of the interface.</td></tr>
       *     <tr><th>statics</th><td>Map</td><td>
       *         Map of statics of the interface. The statics will not get copied into the target class.
       *         This is the same behaviour as statics in mixins ({@link qx.Mixin#define}).
       *     </td></tr>
       *     <tr><th>properties</th><td>Map</td><td>Map of properties and their definitions.</td></tr>
       *     <tr><th>events</th><td>Map</td><td>Map of event names and the corresponding event class name.</td></tr>
       *   </table>
       *
       * @return {qx.Interface} The configured interface
       */
      define: function define(name, config) {
        if (config) {
          // Normalize include
          if (config.extend && !(qx.Bootstrap.getClass(config.extend) === "Array")) {
            config.extend = [config.extend];
          } // Validate incoming data


          // Create interface from statics
          var iface = config.statics ? config.statics : {}; // Attach configuration

          if (config.extend) {
            iface.$$extends = config.extend;
          }

          if (config.properties) {
            iface.$$properties = config.properties;
          }

          if (config.members) {
            iface.$$members = config.members;
          }

          if (config.events) {
            iface.$$events = config.events;
          }
        } else {
          // Create empty interface
          var iface = {};
        } // Add Basics


        iface.$$type = "Interface";
        iface.name = name; // Attach toString

        iface.toString = this.genericToString; // Assign to namespace

        iface.basename = qx.Bootstrap.createNamespace(name, iface); // Add to registry

        qx.Interface.$$registry[name] = iface; // Return final interface

        return iface;
      },

      /**
       * Returns an interface by name
       *
       * @param name {String} class name to resolve
       * @return {Class} the class
       */
      getByName: function getByName(name) {
        return this.$$registry[name];
      },

      /**
       * Determine if interface exists
       *
       * @param name {String} Interface name to check
       * @return {Boolean} true if interface exists
       */
      isDefined: function isDefined(name) {
        return this.getByName(name) !== undefined;
      },

      /**
       * Determine the number of interfaces which are defined
       *
       * @return {Number} the number of interfaces
       */
      getTotalNumber: function getTotalNumber() {
        return qx.Bootstrap.objectGetLength(this.$$registry);
      },

      /**
       * Generates a list of all interfaces including their super interfaces
       * (resolved recursively)
       *
       * @param ifaces {Interface[] ? []} List of interfaces to be resolved
       * @return {Array} List of all interfaces
       */
      flatten: function flatten(ifaces) {
        if (!ifaces) {
          return [];
        } // we need to create a copy and not to modify the existing array


        var list = ifaces.concat();

        for (var i = 0, l = ifaces.length; i < l; i++) {
          if (ifaces[i].$$extends) {
            list.push.apply(list, this.flatten(ifaces[i].$$extends));
          }
        }

        return list;
      },

      /**
       * Assert members
       *
       * @param object {qx.core.Object} The object, which contains the methods
       * @param clazz {Class} class of the object
       * @param iface {Interface} the interface to verify
       * @param wrap {Boolean ? false} wrap functions required by interface to
       *     check parameters etc.
       * @param shouldThrow {Boolean} if <code>false</code>, the method
       *   will return a boolean instead of throwing an exception
       * @return {Boolean} <code>true</code> if all members are supported
       */
      __P_5_0: function __P_5_0(object, clazz, iface, wrap, shouldThrow) {
        // Validate members
        var members = iface.$$members;

        if (members) {
          for (var key in members) {
            if (qx.Bootstrap.isFunction(members[key])) {
              var isPropertyMethod = this.__P_5_1(clazz, key);

              var hasMemberFunction = isPropertyMethod || qx.Bootstrap.isFunction(object[key]);

              if (!hasMemberFunction) {
                if (shouldThrow) {
                  throw new Error('Implementation of method "' + key + '" is missing in class "' + clazz.classname + '" required by interface "' + iface.name + '"');
                } else {
                  return false;
                }
              } // Only wrap members if the interface was not been applied yet. This
              // can easily be checked by the recursive hasInterface method.


              var shouldWrapFunction = wrap === true && !isPropertyMethod && !qx.util.OOUtil.hasInterface(clazz, iface);

              if (shouldWrapFunction) {
                object[key] = this.__P_5_2(iface, object[key], key, members[key]);
              }
            } else {
              // Other members are not checked more detailed because of
              // JavaScript's loose type handling
              if (_typeof(object[key]) === undefined) {
                if (typeof object[key] !== "function") {
                  if (shouldThrow) {
                    throw new Error('Implementation of member "' + key + '" is missing in class "' + clazz.classname + '" required by interface "' + iface.name + '"');
                  } else {
                    return false;
                  }
                }
              }
            }
          }
        }

        if (!shouldThrow) {
          return true;
        }
      },

      /**
       * Internal helper to detect if the method will be generated by the
       * property system.
       *
       * @param clazz {Class} The current class.
       * @param methodName {String} The name of the method.
       *
       * @return {Boolean} true, if the method will be generated by the property
       *   system.
       */
      __P_5_1: function __P_5_1(clazz, methodName) {
        var match = methodName.match(/^(is|toggle|get|set|reset)(.*)$/);

        if (!match) {
          return false;
        }

        var propertyName = qx.Bootstrap.firstLow(match[2]);
        var isPropertyMethod = qx.util.OOUtil.getPropertyDefinition(clazz, propertyName);

        if (!isPropertyMethod) {
          return false;
        }

        var isBoolean = match[0] === "is" || match[0] === "toggle";

        if (isBoolean) {
          return qx.util.OOUtil.getPropertyDefinition(clazz, propertyName).check === "Boolean";
        }

        return true;
      },

      /**
       * Assert properties
       *
       * @param clazz {Class} class to check interface for
       * @param iface {Interface} the interface to verify
       * @param shouldThrow {Boolean} if <code>false</code>, the method
       *   will return a boolean instead of throwing an exception
       * @return {Boolean} <code>true</code> if all properties are supported
       */
      __P_5_3: function __P_5_3(clazz, iface, shouldThrow) {
        if (iface.$$properties) {
          for (var key in iface.$$properties) {
            if (!qx.util.OOUtil.getPropertyDefinition(clazz, key)) {
              if (shouldThrow) {
                throw new Error('The property "' + key + '" is not supported by Class "' + clazz.classname + '"!');
              } else {
                return false;
              }
            }
          }
        }

        if (!shouldThrow) {
          return true;
        }
      },

      /**
       * Assert events
       *
       * @param clazz {Class} class to check interface for
       * @param iface {Interface} the interface to verify
       * @param shouldThrow {Boolean} if <code>false</code>, the method
       *   will return a boolean instead of throwing an exception
       * @return {Boolean} <code>true</code> if all events are supported
       */
      __P_5_4: function __P_5_4(clazz, iface, shouldThrow) {
        if (iface.$$events) {
          for (var key in iface.$$events) {
            if (!qx.util.OOUtil.supportsEvent(clazz, key)) {
              if (shouldThrow) {
                throw new Error('The event "' + key + '" is not supported by Class "' + clazz.classname + '"!');
              } else {
                return false;
              }
            }
          }
        }

        if (!shouldThrow) {
          return true;
        }
      },

      /**
       * Asserts that the given object implements all the methods defined in the
       * interface. This method throws an exception if the object does not
       * implement the interface.
       *
       *  @param object {qx.core.Object} Object to check interface for
       *  @param iface {Interface} The interface to verify
       */
      assertObject: function assertObject(object, iface) {
        var clazz = object.constructor;

        this.__P_5_0(object, clazz, iface, false, true);

        this.__P_5_3(clazz, iface, true);

        this.__P_5_4(clazz, iface, true); // Validate extends, recursive


        var extend = iface.$$extends;

        if (extend) {
          for (var i = 0, l = extend.length; i < l; i++) {
            this.assertObject(object, extend[i]);
          }
        }
      },

      /**
       * Checks if an interface is implemented by a class
       *
       * @param clazz {Class} class to check interface for
       * @param iface {Interface} the interface to verify
       * @param wrap {Boolean ? false} wrap functions required by interface to
       *     check parameters etc.
       */
      assert: function assert(clazz, iface, wrap) {
        this.__P_5_0(clazz.prototype, clazz, iface, wrap, true);

        this.__P_5_3(clazz, iface, true);

        this.__P_5_4(clazz, iface, true); // Validate extends, recursive


        var extend = iface.$$extends;

        if (extend) {
          for (var i = 0, l = extend.length; i < l; i++) {
            this.assert(clazz, extend[i], wrap);
          }
        }
      },

      /**
       * Asserts that the given object implements all the methods defined in the
       * interface.
       *
       *  @param object {qx.core.Object} Object to check interface for
       *  @param iface {Interface} The interface to verify
       * @return {Boolean} <code>true</code> if the objects implements the interface
       */
      objectImplements: function objectImplements(object, iface) {
        var clazz = object.constructor;

        if (!this.__P_5_0(object, clazz, iface) || !this.__P_5_3(clazz, iface) || !this.__P_5_4(clazz, iface)) {
          return false;
        } // Validate extends, recursive


        var extend = iface.$$extends;

        if (extend) {
          for (var i = 0, l = extend.length; i < l; i++) {
            if (!this.objectImplements(object, extend[i])) {
              return false;
            }
          }
        }

        return true;
      },

      /**
       * Tests whether an interface is implemented by a class, without throwing an
       * exception when it doesn't.
       *
       * @param clazz {Class} class to check interface for
       * @param iface {Interface} the interface to verify
       * @return {Boolean} <code>true</code> if interface is implemented
       */
      classImplements: function classImplements(clazz, iface) {
        if (!this.__P_5_0(clazz.prototype, clazz, iface) || !this.__P_5_3(clazz, iface) || !this.__P_5_4(clazz, iface)) {
          return false;
        } // Validate extends, recursive


        var extend = iface.$$extends;

        if (extend) {
          for (var i = 0, l = extend.length; i < l; i++) {
            if (!this.has(clazz, extend[i])) {
              return false;
            }
          }
        }

        return true;
      },

      /*
      ---------------------------------------------------------------------------
         PRIVATE/INTERNAL API
      ---------------------------------------------------------------------------
      */

      /**
       * This method will be attached to all interface to return
       * a nice identifier for them.
       *
       * @internal
       * @return {String} The interface identifier
       */
      genericToString: function genericToString() {
        return "[Interface " + this.name + "]";
      },

      /** Registry of all defined interfaces */
      $$registry: {},

      /**
       * Wrap a method with a precondition check.
       *
       * @signature function(iface, origFunction, functionName, preCondition)
       * @param iface {String} Name of the interface, where the pre condition
       *   was defined. (Used in error messages).
       * @param origFunction {Function} function to wrap.
       * @param functionName {String} name of the function. (Used in error messages).
       * @param preCondition {Function}. This function gets called with the arguments of the
       *   original function. If this function return true the original function is called.
       *   Otherwise an exception is thrown.
       * @return {Function} wrapped function
       */
      __P_5_2: function __P_5_2(iface, origFunction, functionName, preCondition) {},

      /** @type {Map} allowed keys in interface definition */
      __P_5_5: null,

      /**
       * Validates incoming configuration and checks keys and values
       *
       * @signature function(name, config)
       * @param name {String} The name of the class
       * @param config {Map} Configuration map
       */
      __P_5_6: function __P_5_6(name, config) {}
    }
  });
  qx.Interface.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Interface.js.map?dt=1590412552878