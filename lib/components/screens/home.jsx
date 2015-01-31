var React = require('react');
var App = require('../app.jsx');

var Home = React.createClass({
  render: function () {
    return (
      <App>
        <h2>Getting Started &amp; Architecture</h2>
        <p>To properly take advantage of Littlest, you should understand <em>how it works</em>, including all
        underlying technolgies. This documentation won't even <em>pretend</em> to teach you then better than existing
        resources, and will link you elsewhere wherever possible.</p>
        <div className="home__row">
          <img className="home__cutout" src="public/cutout.png" alt="Littlest Cutout: Node/Browsers, JavaScript, React, Dispatcher, and Isomorph" />
          <h3>Layers</h3>
          <dl>
            <dt>Isomorph</dt><dd>Serving, Navigating, Contextualizing, Abstracting</dd>
            <dt>Dispatcher</dt><dd>Storing, Acting, Dispatching</dd>
            <dt>React</dt><dd>Rendering, Organizing</dd>
            <dt>JavaScript</dt><dd>Everything</dd>
          </dl>
        </div>
        <h3>JavaScript</h3>
        <p>You <em>did</em> know this was a suite of JavaScript libraries, right?
          {' '}<a href="https://www.codeschool.com/courses/javascript-road-trip-part-1">CodeSchool</a> and
          {' '}<a href="https://www.khanacademy.org/computing/computer-programming/programming">Khan Academy</a>
          {' '}have plenty to say on the subject. Don't come back until you know how {'function'} scoping and
          {' '}<code>this</code> work, inside and out. There will be a quiz; please have your
          {' '}<a href="http://en.wikipedia.org/wiki/Pencil">#2 pencil</a> sharpened and ready.</p>
        <h3>React</h3>
        <p>An impressively fast component renderer, React provides the backbone for the rest of the architecture.
        To learn React, check out their <a href="http://facebook.github.io/react/docs/tutorial.html">fantastic tutorial</a>,
        paying close attention to how Components are organized and how state is passed from one to another.
        </p>
        <h3>Flux</h3>
        <p>To complement React's philosophical underpinnings, the developers documented Flux: a non-MVC-based
          architecture for changing state in response to behaviour. While their implementation differs greatly from
          that provided by Littlest, it's useful to know one's roots &ndash; you can find their tutorial, specific to
          Flux, <a href="http://facebook.github.io/flux/docs/todo-list.html">here</a>.</p>
        <h3>Dispatcher</h3>
        <p>The <a href="https://github.com/Littlest/littlest-dispatcher">Littlest Dispatcher</a> is the first layer
          built on top of React, providing an implementation of Flux. The notable differences from other Flux
          implementations are:
        </p>
        <ul>
          <li>The Dispatcher leverages node's EventEmitter implementation. No need to reinvent the bus.</li>
          <li>Actions are just Functions, though a helper is provided to automatically dispatch from
            Promise-returning functions based on the promise state.</li>
          <li>Stores also leverage EventEmitter for <code>change</code> events, and store state in a well-defined
            manner, while still being serializable/deserializable for rehydrating on the client.</li>
        </ul>
        <h3>Isomorph</h3>
        <p>The <a href="https://github.com/Littlest/littlest-isomorph">Littlest Isomorph</a> is only the second layer
          built on top of React, yet the last. It provides the bulk of the value of Littlest, attempting to be a simple
          yet coprehensive and cohesive library to build applications from:
        </p>
        <ul>
          <li>Navigators provide top-level navigation from Component to Component.</li>
          <li>Renderers wrap React's `render` methods, providing interfaces for the DOM and Express.</li>
          <li>The Context contextualizes Store state to a single session or request.</li>
          <li>The Context also provides an <em>implementation</em> of state rehydration. The final server-side state
            becomes the first client-side state with zero loss of "work".</li>
          <li>The Mixin provides easier-to-use, one-way data bindings between Context/Store state and Component state.
          </li>
          <li>The Router provides a simple (perhaps too simple) vehicle for History manipulation and mapping URLs
            requested to Components rendered.</li>
        </ul>
        <h3>Support: ProxyClient</h3>
        <p>A product of building a multitude of Littlest applications at <a href="https://faithlife.com">Faithlife</a>,
          {' '}<a href="https://github.com/Littlest/proxy-client">ProxyClient</a> provides a top-level prototype for
          HTTP API clients that can be proxied on the Littlest server (or any Express application).</p>
        <p>No more CORS headaches, and unfriendly APIs can be reshaped for better application responsiveness.</p>
        <h3>Scaffolding: Yeoman</h3>
        <p><em>Once you know what to expect,</em> the Yeoman
          {' '}<a href="https://github.com/Littlest/generator-littlest-isomorph">generator</a> can scaffold out a
          complete application, rife with the opinions of Littlest's loving creators.</p>
      </App>
    );
  }
});

module.exports = Home;
