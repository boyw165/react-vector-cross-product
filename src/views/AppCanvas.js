import $ from 'jquery';
import React from 'react';
import Point from '../lib/Point';

export default class Canvas extends React.Component {

  constructor(props) {
    super(props);

    var pts = [new Point(400, 74),
               new Point(139, 343),
               new Point(721, 343)];

    pts[2].isClosed = true;
    this.state = {
      svgPolygonPath: pts
    };

    this._width = this.props.width || 800;
    this._height = this.props.height || 400;
    this._boundingClientRect = false;

    this._isDragging = false;
    this._isDrawingPolygon = false;
    this._ctx = false;
    this._lineStartPt = false;
  }

  render() {
    var svgPolygonPath, svgEdges = [];

    if (this.state.svgPolygonPath.length) {
      var path = this.state.svgPolygonPath.map((pt, i) => {
        // Create svg edges.
        svgEdges.push(<circle cx={pt.x} cy={pt.y} r='5' stroke='green' fill='none'/>);
        svgEdges.push(<text x={pt.x - 3} y={pt.y - 12} fill='green'>{i + 1}</text>);
        // Create svg path.
        if (i === 0) {
          return 'M' + pt.x + ' ' + pt.y;
        } else {
          return 'L' + pt.x + ' ' + pt.y + (pt.isClosed ? ' Z' : '');
        }
      }).join(' ');

      svgPolygonPath = <path d={path} stroke='green' fill='none'/>;
    }

    return (
      <div className='noselect'>
        <canvas width={this._width} height={this._height}
                className='fixed-pos solid-border toppest'
                onMouseDown={this._onMouseDown.bind(this)}
                onMouseUp={this._onMouseUp.bind(this)}
                onMouseMove={this._onMouseMove.bind(this)}
                onMouseOut={this._onStopAll.bind(this)}
                onClick={this._onClick.bind(this)}
                onDoubleClick={this._onStopAll.bind(this)}/>
        <svg width={this.props.width} height={this.props.height}
             className='fixed-pos'>
          {svgPolygonPath}
          {svgEdges}
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

    if (this.props.isDrawPolygon) {
      // Drawing polygon mode.
      if (this._isDrawingPolygon) {
        this._canvasLineTo(this._toCanvasCoords(x, y));
      } else {
        this._startDrawPolygon(this._toCanvasCoords(x, y));
      }
    } else {
      // DO NOTHING.
      this._canvasArc(this._toCanvasCoords(x, y));
      this._isDragging = true;
    }
  }

  _onMouseUp(e) {
    if (this.props.isDrawPolygon) {
      // DO NOTHING.
    } else {
      this._isDragging = false;
    }
  }

  _onMouseMove(e) {
    var x = e.clientX;
    var y = e.clientY;

    if (this.props.isDrawPolygon) {
      if (this._isDrawingPolygon) {

        this._canvasLineTo(this._toCanvasCoords(x, y));
      }
    } else {
      if (this._isDragging) {
        this._canvasArc(this._toCanvasCoords(x, y));
      }
    }
  }

  _onClick(e) {
    var x = e.clientX;
    var y = e.clientY;
    var endPt = this._toCanvasCoords(x, y);

    if (this.props.isDrawPolygon) {
      var oldPaths = this.state.svgPolygonPath;
      var newPaths;

      if (oldPaths.length == 0) {
        newPaths = oldPaths.concat(this._lineStartPt, endPt);
      } else {
        var ln = oldPaths.length;
        var last = ln - 1;

        newPaths = oldPaths;
        [this._lineStartPt, endPt].forEach((pt) => {
          if (!oldPaths[last].eq(pt)) {
            newPaths = newPaths.concat(pt);
          }
        });
      }

      this._lineStartPt = endPt;
      this._ctx.clearRect(0, 0, this._width, this._height);
      this.setState({
        svgPolygonPath: newPaths
      });
    } else {
      // DO NOTHING.
    }
  }

  _onStopAll(e) {
    this._isDragging = false;

    if (this._isDrawingPolygon) {
      var x = e.clientX;
      var y = e.clientY;

      this._stopDrawPolygon(this._toCanvasCoords(x, y));
    }
  }

  _startDrawPolygon(startPt) {
    this._lineStartPt = startPt;
    this._isDrawingPolygon = true;

    this.setState({
      svgPolygonPath: []
    });
  }

  _stopDrawPolygon(endPt) {
    this._isDrawingPolygon = false;
    this._lineStartPt = false;
    this._ctx.clearRect(0, 0, this._width, this._height);

    var oldPaths = this.state.svgPolygonPath;
    var newPaths;

    if (oldPaths.length > 2) {
      newPaths = oldPaths.slice(0);
      newPaths[newPaths.length - 1].isClosed = true;
    } else {
      newPaths = [];
    }

    this.setState({
      svgPolygonPath: newPaths
    });
  }

  _isPointInsidePolygon(p, polygonPts) {
    var crossA,
        vectors = polygonPts.map((pt) => {
          return p.sub(pt, true);
        });

    vectors = vectors.concat(vectors[0]);

    for (var i = 1, ln = vectors.length; i < ln; ++i) {
      var crossB = vectors[i - 1].crossProd(vectors[i]);
      if (i === 1) {
        crossA = crossB;
      } else if (!crossA.eqDirection(crossB)) {
        return false;
      }
    }

    return true;
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

  _canvasArc(cPt, r = 10, sAngle = 0, eAngle = 2 * Math.PI, ccw = false) {
    // Clear canvas.
    this._ctx.clearRect(0, 0, this._width, this._height);

    // Draw arc.
    var cross = r / 2;
    this._ctx.beginPath();
    this._ctx.arc(cPt.x, cPt.y, r, sAngle, eAngle, ccw);
    this._ctx.fillStyle = this._isPointInsidePolygon(cPt, this.state.svgPolygonPath) ? '#00FF00' : '#FF0000';
    this._ctx.fill();
    this._ctx.moveTo(cPt.x - cross, cPt.y);
    this._ctx.lineTo(cPt.x + cross, cPt.y);
    this._ctx.moveTo(cPt.x, cPt.y - cross);
    this._ctx.lineTo(cPt.x, cPt.y + cross);
    this._ctx.strokeStyle = '#000000';
    this._ctx.stroke();
    this._ctx.closePath();
  }
}
