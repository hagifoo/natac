'use strict';

import React from 'react';
import _ from 'underscore';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.points = _.map(_.range(6), i => {
            return {
                x: props.r * Math.sin(Math.PI * i / 3),
                y: props.r * Math.cos(Math.PI * i / 3)
            }
        });
    }
    render() {
        const c = this.props.center;
        const pointsString = _.reduce(this.points, (memo, v) => `${memo} ${v.x},${v.y}`, '');
        return <g transform={`translate(${c.x},${c.y})`}>
            <polygon points={pointsString} fill={this.props.color}></polygon>
            <text textAnchor="middle" dominantBaseline="middle" font-weight="bold">
                {this.props.text}
            </text>
        </g>
    }
}

