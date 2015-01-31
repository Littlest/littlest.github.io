(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){

'use strict';

/*!
 * This "script" bootstraps the client-specific code. See Client.js for
 * more information.
 */
var littlest = require('littlest-isomorph');
var React = require('react');
var FlickrClient = require('../lib/clients/flickr');
var config = require('../lib/config');
var context = require('../lib/context');

// Attach a singleton client instance to the Context. All Actions will use
// this client from the browser. As such, all requests will be proxied through
// our server instance.
context.flickr = FlickrClient.createClient(config.client.flickr.proxy);

// Install the client.
littlest.DomNavigator
  .createNavigator({
    context: context
  }).start();

// Log the top-level configuration for debugging.
console.log('Config:', config);

// Expose React to trigger the React devtools.
if (config.env === 'development') {
  global.React = React;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/clients/flickr":3,"../lib/config":8,"../lib/context":9,"littlest-isomorph":"3lLj4m","react":"M6d2gk"}],2:[function(require,module,exports){
var context = require('../context');

context.createAction('photos:interesting:fetch', function (params) {
  return this.flickr.getInteresting();
});

},{"../context":9}],3:[function(require,module,exports){
/**
 * TODO: Description.
 */
var util = require('util');
var ProxyClient = require('proxy-client');

/**
 * Creates a new instance of FlickrClient with the provided `options`.
 *
 * @param {Object} options
 */
function FlickrClient(options) {
  if (!(this instanceof FlickrClient)) {
    return new FlickrClient(options);
  }

  options = options || {};

  this.apiKey = this.apiKey || options.apiKey;
  this.rootUrl = this.rootUrl || options.rootUrl || 'https://api.flickr.com/services/rest';

  ProxyClient.call(this, options);
}
ProxyClient.inherit(FlickrClient);

/**
 * Makes a request to the Flickr API in their non-standard way.
 */
FlickrClient.prototype.call = function call(method, args) {
  return this.get('/')
    .query(util._extend({
      method: method,
      api_key: this.apiKey,
      format: 'json',
      nojsoncallback: 1
    }, args))
    .end();
};

/**
 * Returns an Array of "interesting" Photo objects for today.
 * Pagination is supported via `page` and `count`.
 */
FlickrClient.prototype.getInteresting = function getInteresting(params) {
  var self = this;

  params = params || {};

  return self
    .call('flickr.interestingness.getList', {
      per_page: params.count,
      page: params.page
    })
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.photos.photo;
    });
};

/*!
 * Export `FlickrClient`.
 */
module.exports = FlickrClient;

},{"proxy-client":"IWMNTG","util":16}],4:[function(require,module,exports){
var littlest = require('littlest-isomorph');
var React = require('react');

var App = React.createClass({displayName: "App",
  mixins: [littlest.Mixin],
  render: function () {
    return (
      React.createElement("div", {className: "app"}, 
        React.createElement("div", {className: "app__header"}, 
          React.createElement("div", {className: "container"}, 
            React.createElement("h1", {className: "app__title"}, React.createElement("a", {href: this.context.getRouteUrl('home')}, "Littlest")), 
            React.createElement("img", {className: "app__logo", src: "public/logo.png"})
          )
        ), 
        React.createElement("div", {className: "app__content"}, 
          React.createElement("div", {className: "container container--readability"}, 
            this.props.children
          )
        ), 
        React.createElement("div", {className: "app__footer"}, 
          React.createElement("div", {className: "container"}, 
            React.createElement("p", null, "Made with ♥ by ", React.createElement("a", {href: "https://twitter.com/Schoonology"}, "@Schoonology"), "."), 
            React.createElement("p", null, "Incubated ", React.createElement("a", {href: "https://faithlife.com"}, "@Faithlife"), "."), 
            React.createElement("p", null, "Code (including this site) is available under ", React.createElement("a", {href: "https://github.com/Littlest/littlest.github.io/blob/master/LICENSE"}, "MIT"), ". Documentation is available under ", React.createElement("a", {href: "http://creativecommons.org/licenses/by/3.0/"}, "CC BY 3.0"), ".")
          )
        )
      )
    );
  }
});

module.exports = App;

},{"littlest-isomorph":"3lLj4m","react":"M6d2gk"}],5:[function(require,module,exports){
var React = require('react');
var config = require('../../config');
var App = require('../app.jsx');

var About = React.createClass({displayName: "About",
  render: function () {
    return (
      React.createElement(App, null, 
        React.createElement("h1", null, "About"), 
        React.createElement("p", null, "Config:"), 
        React.createElement("pre", null, React.createElement("code", null, JSON.stringify(config, null, 2)))
      )
    );
  }
});

module.exports = About;

},{"../../config":8,"../app.jsx":4,"react":"M6d2gk"}],6:[function(require,module,exports){
var React = require('react');
var App = require('../app.jsx');

var Error = React.createClass({displayName: "Error",
  render: function () {
    return (
      React.createElement(App, null, 
        React.createElement("h1", null, this.props.code, " Error"), 
        React.createElement("p", null, "Message: ", React.createElement("code", null, this.props.message))
      )
    );
  }
});

module.exports = Error;

},{"../app.jsx":4,"react":"M6d2gk"}],7:[function(require,module,exports){
var React = require('react');
var App = require('../app.jsx');

var Home = React.createClass({displayName: "Home",
  render: function () {
    return (
      React.createElement(App, null, 
        React.createElement("h2", null, "Getting Started & Architecture"), 
        React.createElement("p", null, "To properly take advantage of Littlest, you should understand ", React.createElement("em", null, "how it works"), ", including all" + ' ' +
        "underlying technolgies. This documentation won't even ", React.createElement("em", null, "pretend"), " to teach you then better than existing" + ' ' +
        "resources, and will link you elsewhere wherever possible."), 
        React.createElement("div", {className: "home__row"}, 
          React.createElement("img", {className: "home__cutout", src: "public/cutout.png", alt: "Littlest Cutout: Node/Browsers, JavaScript, React, Dispatcher, and Isomorph"}), 
          React.createElement("h3", null, "Layers"), 
          React.createElement("dl", null, 
            React.createElement("dt", null, "Isomorph"), React.createElement("dd", null, "Serving, Navigating, Contextualizing, Abstracting"), 
            React.createElement("dt", null, "Dispatcher"), React.createElement("dd", null, "Storing, Acting, Dispatching"), 
            React.createElement("dt", null, "React"), React.createElement("dd", null, "Rendering, Organizing"), 
            React.createElement("dt", null, "JavaScript"), React.createElement("dd", null, "Everything")
          )
        ), 
        React.createElement("h3", null, "JavaScript"), 
        React.createElement("p", null, "You ", React.createElement("em", null, "did"), " know this was a suite of JavaScript libraries, right?", 
          ' ', React.createElement("a", {href: "https://www.codeschool.com/courses/javascript-road-trip-part-1"}, "CodeSchool"), " and", 
          ' ', React.createElement("a", {href: "https://www.khanacademy.org/computing/computer-programming/programming"}, "Khan Academy"), 
          ' ', "have plenty to say on the subject. Don't come back until you know how ", 'function', " scoping and", 
          ' ', React.createElement("code", null, "this"), " work, inside and out. There will be a quiz; please have your", 
          ' ', React.createElement("a", {href: "http://en.wikipedia.org/wiki/Pencil"}, "#2 pencil"), " sharpened and ready."), 
        React.createElement("h3", null, "React"), 
        React.createElement("p", null, "An impressively fast component renderer, React provides the backbone for the rest of the architecture." + ' ' +
        "To learn React, check out their ", React.createElement("a", {href: "http://facebook.github.io/react/docs/tutorial.html"}, "fantastic tutorial"), "," + ' ' +
        "paying close attention to how Components are organized and how state is passed from one to another."
        ), 
        React.createElement("h3", null, "Flux"), 
        React.createElement("p", null, "To complement React's philosophical underpinnings, the developers documented Flux: a non-MVC-based" + ' ' +
          "architecture for changing state in response to behaviour. While their implementation differs greatly from" + ' ' +
          "that provided by Littlest, it's useful to know one's roots – you can find their tutorial, specific to" + ' ' +
          "Flux, ", React.createElement("a", {href: "http://facebook.github.io/flux/docs/todo-list.html"}, "here"), "."), 
        React.createElement("h3", null, "Dispatcher"), 
        React.createElement("p", null, "The ", React.createElement("a", {href: "https://github.com/Littlest/littlest-dispatcher"}, "Littlest Dispatcher"), " is the first layer" + ' ' +
          "built on top of React, providing an implementation of Flux. The notable differences from other Flux" + ' ' +
          "implementations are:"
        ), 
        React.createElement("ul", null, 
          React.createElement("li", null, "The Dispatcher leverages node's EventEmitter implementation. No need to reinvent the bus."), 
          React.createElement("li", null, "Actions are just Functions, though a helper is provided to automatically dispatch from" + ' ' +
            "Promise-returning functions based on the promise state."), 
          React.createElement("li", null, "Stores also leverage EventEmitter for ", React.createElement("code", null, "change"), " events, and store state in a well-defined" + ' ' +
            "manner, while still being serializable/deserializable for rehydrating on the client.")
        ), 
        React.createElement("h3", null, "Isomorph"), 
        React.createElement("p", null, "The ", React.createElement("a", {href: "https://github.com/Littlest/littlest-isomorph"}, "Littlest Isomorph"), " is only the second layer" + ' ' +
          "built on top of React, yet the last. It provides the bulk of the value of Littlest, attempting to be a simple" + ' ' +
          "yet coprehensive and cohesive library to build applications from:"
        ), 
        React.createElement("ul", null, 
          React.createElement("li", null, "Navigators provide top-level navigation from Component to Component."), 
          React.createElement("li", null, "Renderers wrap React's `render` methods, providing interfaces for the DOM and Express."), 
          React.createElement("li", null, "The Context contextualizes Store state to a single session or request."), 
          React.createElement("li", null, "The Context also provides an ", React.createElement("em", null, "implementation"), " of state rehydration. The final server-side state" + ' ' +
            "becomes the first client-side state with zero loss of \"work\"."), 
          React.createElement("li", null, "The Mixin provides easier-to-use, one-way data bindings between Context/Store state and Component state."
          ), 
          React.createElement("li", null, "The Router provides a simple (perhaps too simple) vehicle for History manipulation and mapping URLs" + ' ' +
            "requested to Components rendered.")
        ), 
        React.createElement("h3", null, "Support: ProxyClient"), 
        React.createElement("p", null, "A product of building a multitude of Littlest applications at ", React.createElement("a", {href: "https://faithlife.com"}, "Faithlife"), ",", 
          ' ', React.createElement("a", {href: "https://github.com/Littlest/proxy-client"}, "ProxyClient"), " provides a top-level prototype for" + ' ' +
          "HTTP API clients that can be proxied on the Littlest server (or any Express application)."), 
        React.createElement("p", null, "No more CORS headaches, and unfriendly APIs can be reshaped for better application responsiveness."), 
        React.createElement("h3", null, "Scaffolding: Yeoman"), 
        React.createElement("p", null, React.createElement("em", null, "Once you know what to expect,"), " the Yeoman", 
          ' ', React.createElement("a", {href: "https://github.com/Littlest/generator-littlest-isomorph"}, "generator"), " can scaffold out a" + ' ' +
          "complete application, rife with the opinions of Littlest's loving creators.")
      )
    );
  }
});

module.exports = Home;

},{"../app.jsx":4,"react":"M6d2gk"}],8:[function(require,module,exports){
(function (process){
'use strict';

/*!
 * Config.js is responsible for rendering the top-level configuration as
 * required by client, server, or both. _No information should exist here that
 * cannot be seen by the client_, as Browserify will bundle the generated
 * code with the client.
 *
 * If the configuration doesn't seem to match on the client and on the server,
 * _make sure the same environment variables are specified on both!_
 */
var os = require('os');
var env = process.env.NODE_ENV || 'development';
var validEnvs = ['development', 'production'];

if (validEnvs.indexOf(env) === -1) {
  throw new Error('Invalid environment name:', env);
}

function byEnv(config) {
  validEnvs.forEach(function (name) {
    if (typeof config[name] === 'undefined') {
      console.warn('Configuration missing value for environment:', name);
    }
  });

  return config[env];
}

module.exports = {
  env: env
};

}).call(this,require("JkpR2F"))
},{"JkpR2F":14,"os":13}],9:[function(require,module,exports){
module.exports = require('littlest-isomorph').createContext();

// Since we perform Actions and get Stores by name, we need to bootstrap them
// somewhere. How about here? There's no magic going on here, we're just
// using `require` to ensure some JavaScript gets run, populating our Context.
require('./actions/photos');
require('./stores/photos');
require('./router');

},{"./actions/photos":2,"./router":10,"./stores/photos":11,"littlest-isomorph":"3lLj4m"}],10:[function(require,module,exports){
/**
 * Application-specific Router. Includes routes configuration, defaults,
 * error pages, etc.
 */
var context = require('./context');
var About = require('./components/screens/about.jsx');
var Error = require('./components/screens/error.jsx');
var Home = require('./components/screens/home.jsx');

context
  .createRoute('home', {
    path: '/',
    title: 'Home',
    body: Home,
    action: 'photos:interesting:fetch'
  })
  .createRoute('about', {
    path: '/about',
    title: 'About',
    body: About
  })
  .createErrorRoute(404, {
    title: 'Not Found',
    body: Error
  })
  .createErrorRoute(500, {
    title: 'Unexpected Error',
    body: Error
  });

},{"./components/screens/about.jsx":5,"./components/screens/error.jsx":6,"./components/screens/home.jsx":7,"./context":9}],11:[function(require,module,exports){
var context = require('../context');

context.createStore('photos')
  .define('interesting', [])
  .handle('photos:interesting:fetch:succeeded', function (data) {
    this.interesting = data;
  });

},{"../context":9}],12:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],13:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],14:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],15:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],16:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("JkpR2F"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":15,"JkpR2F":14,"inherits":12}]},{},[1]);