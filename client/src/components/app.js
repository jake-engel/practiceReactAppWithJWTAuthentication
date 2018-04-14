import React, { Component } from 'react';

import Header from './header';

export default class App extends Component {
  // MUST HAVE THIS.PROPS.CHILDREN WHEN SHOWING CHILD ROUTES
  render() {
    return (
      <div>
        <Header />
        { this.props.children }
      </div>
    );
  }
}
