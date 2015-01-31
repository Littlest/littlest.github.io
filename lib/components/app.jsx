var littlest = require('littlest-isomorph');
var React = require('react');

var App = React.createClass({
  mixins: [littlest.Mixin],
  render: function () {
    return (
      <div className="app">
        <div className="app__header">
          <h1><a href={this.context.getRouteUrl('home')}>Littlest</a></h1>
          <nav>
            <ul className="nav-list">
              <li><a className="nav-list__item" href={this.context.getRouteUrl('home')}>Home</a></li>
              <li><a className="nav-list__item" href={this.context.getRouteUrl('about')}>About</a></li>
            </ul>
          </nav>
        </div>
        <div className="app__content">
          {this.props.children}
        </div>
        <div class="app__footer">
          Made with &hearts; by <a href="https://twitter.com/Schoonology">@Schoonology</a>. Incubated <a href="https://faithlife.com">@Faithlife</a>.
          Code (including this site) is available under <a href="https://github.com/Littlest/littlest.github.io/blob/master/LICENSE">MIT</a>. Documentation is available under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
        </div>
      </div>
    );
  }
});

module.exports = App;
