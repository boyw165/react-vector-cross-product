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
      isDrawPolygon: false
    };
  }

  render() {
    var canvasWidth = this.props.width || 800;
    var canvasHeight = this.props.height || 400;

    return (
      <div>
        <h1>Vector Cross Product Test</h1>
        <p>Use cross-product to tell whether a given point is inside or outside the convex polygon.<br/> P.S. NOT appropriate for concave polygon.</p>
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
        <AppCanvas width={canvasWidth} height={canvasHeight}
                   isDrawPolygon={this.state.isDrawPolygon}/>
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
