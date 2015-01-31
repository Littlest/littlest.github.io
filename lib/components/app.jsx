var littlest = require('littlest-isomorph');
var React = require('react');

var App = React.createClass({
  mixins: [littlest.Mixin],
  render: function () {
    return (
      <div className="app">
        <div className="app__header">
          <div className="container">
            <h1 className="app__title"><a href={this.context.getRouteUrl('home')}>Littlest</a></h1>
            <img className="app__logo" src="public/logo.png" />
          </div>
        </div>
        <div className="app__content">
          <div className="container container--readability">
            {this.props.children}
          </div>
        </div>
        <div className="app__footer">
          <div className="container">
            <p>Made with &hearts; by <a href="https://twitter.com/Schoonology">@Schoonology</a>.</p>
            <p>Incubated <a href="https://faithlife.com">@Faithlife</a>.</p>
            <p>Code (including this site) is available under <a href="https://github.com/Littlest/littlest.github.io/blob/master/LICENSE">MIT</a>. Documentation is available under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
