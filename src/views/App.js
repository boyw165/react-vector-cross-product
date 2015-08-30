import React from 'react';
import SwitchButton from 'react-switch-button';
import AppCanvas from './AppCanvas';

// Webpack using CSS.
require('react-switch-button.min.css');
require('./css/app-canvas.css');

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isDrawPolygon: true
    };
  }

  render() {
    return (
      <div>
        <h1>Vector Cross Product Test</h1>
        <ul>
          <li>
            <SwitchButton name='draw-polygon'
                          label_right='Draw Polygon'
                          checked={this.state.isDrawPolygon}
                          onChange={this._onDrawModeChange.bind(this)} />
          </li>
          <li>
            <SwitchButton name='drop-point'
                          label_right='Drop Point'
                          checked={!this.state.isDrawPolygon}
                          onChange={this._onDrawModeChange.bind(this)} />
          </li>
        </ul>
        <AppCanvas width='800' height='400'/>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  // Private ///////////////////////////////////////////////////////////////////

  _onDrawModeChange(e) {
    this.setState({
      isDrawPolygon: !this.state.isDrawPolygon
    });
  }
}
