import React from 'react';

export default class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <canvas className='fixed-pos' width={this.props.width} height={this.props.height}>
        </canvas>
        <svg className='fixed-pos' width={this.props.width} height={this.props.height}>
          <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
        </svg>
      </div>
    );
  }
}
