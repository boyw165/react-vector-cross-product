import $ from 'jquery';
import React from 'react';
import Point from '../lib/Point';

export default class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      svgPath: []
    };

    this._width = this.props.width || 800;
    this._height = this.props.height || 400;
    this._boundingClientRect = false;

    this._isDrawing = false;
    this._ctx = false;
    this._lineStartPt = false;
  }

  render() {
    var svgPath, svgCircles = [];

    if (this.state.svgPath.length) {
      var first = this.state.svgPath[0];
      var path = this.state.svgPath.map((pt, i) => {
        // Create svg circle.
        svgCircles.push(<circle cx={pt.x} cy={pt.y} r='5' stroke='green' fill='none'/>);
        // Create svg path.
        if (i === 0) {
          return 'M' + pt.x + ' ' + pt.y;
        } else {
          return 'L' + pt.x + ' ' + pt.y + (pt.isClosed ? ' Z' : '');
        }
      }).join(' ');

      svgPath = <path d={path} stroke='green' fill='none'/>;
    }

    return (
      <div className='noselect'>
        <canvas width={this._width} height={this._height}
                className='fixed-pos solid-border toppest'
                onMouseDown={this._onMouseDown.bind(this)}
                onMouseMove={this._onMouseMove.bind(this)}
                onMouseOut={this._onDoubleClick.bind(this)}
                onClick={this._onClick.bind(this)}
                onDoubleClick={this._onDoubleClick.bind(this)}/>
        <svg width={this.props.width} height={this.props.height}
             className='fixed-pos'>
          {svgPath}
          {svgCircles}
        </svg>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  // Private ///////////////////////////////////////////////////////////////////

  _onMouseDown(e) {
    var x = e.clientX;
    var y = e.clientY;

    this._ctx = e.target.getContext('2d');
    this._boundingClientRect = e.target.getBoundingClientRect();

    if (this._isDrawing) {
      this._canvasLineTo(this._toCanvasCoords(x, y));
    } else {
      this._startDrawing(this._toCanvasCoords(x, y));
    }
  }

  _onMouseMove(e) {
    if (this._isDrawing) {
      var x = e.clientX;
      var y = e.clientY;

      this._canvasLineTo(this._toCanvasCoords(x, y));
    }
  }

  _onClick(e) {
    var x = e.clientX;
    var y = e.clientY;
    var endPt = this._toCanvasCoords(x, y);
    var oldNodes = this.state.svgPath;
    var newNodes;

    if (oldNodes.length == 0) {
      newNodes = oldNodes.concat(this._lineStartPt, endPt);
    } else {
      var ln = oldNodes.length;
      var last = ln - 1;

      newNodes = oldNodes;
      [this._lineStartPt, endPt].forEach((pt) => {
        if (!oldNodes[last].eq(pt)) {
          newNodes = newNodes.concat(pt);
        }
      });
    }

    this.setState({
      svgPath: newNodes
    });
    this._lineStartPt = endPt;
  }

  _onDoubleClick(e) {
    if (this._isDrawing) {
      var x = e.clientX;
      var y = e.clientY;

      this._stopDrawing(this._toCanvasCoords(x, y));
    }
  }

  _startDrawing(startPt) {
    this._lineStartPt = startPt;
    this._isDrawing = true;

    this.setState({
      svgPath: []
    });
  }

  _stopDrawing(endPt) {
    this._isDrawing = false;
    this._lineStartPt = false;
    this._ctx.clearRect(0, 0, this._width, this._height);

    var oldNodes = this.state.svgPath;
    var newNodes;

    if (oldNodes.length > 2) {
      newNodes = oldNodes.slice(0);
      newNodes[newNodes.length - 1].isClosed = true;
    } else {
      newNodes = [];
    }

    this.setState({
      svgPath: newNodes
    });
  }

  _toCanvasCoords(x, y) {
    return new Point(x - this._boundingClientRect.left,
                     y - this._boundingClientRect.top);
  }

  _canvasLineTo(toPt) {
    // Clear canvas.
    this._ctx.clearRect(0, 0, this._width, this._height);

    // Draw line.
    this._ctx.beginPath();
    this._ctx.moveTo(this._lineStartPt.x, this._lineStartPt.y);
    this._ctx.lineTo(toPt.x, toPt.y);
    this._ctx.strokeStyle='#FF0000';
    this._ctx.stroke();
    this._ctx.closePath();
  }
}
