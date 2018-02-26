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

        this.click = this.click.bind(this);
        this.props.land.on('change:active', () => {this.forceUpdate();});
    }
    click() {
        this.props.land.select();
    }
    render() {
        const c = this.props.center;
        const land = this.props.land;
        const pointsString = _.reduce(this.points, (memo, v) => `${memo} ${v.x},${v.y}`, '');
        let number;

        if(land.number == 6 || land.number == 8) {
            number = <g>
                <circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill="#fff"
                >
                </circle>
                <text className="number number-accent" textAnchor="middle" dominantBaseline="central" font-weight="bold">
                    {land.number}
                </text>
            </g>
        } else if (land.number) {
            number = <g>
                <circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill="#fff"
                >
                </circle>
                <text className="number" textAnchor="middle" dominantBaseline="central" font-weight="bold">
                    {land.number}
                </text>
            </g>
        }

        return <g
            onClick={this.click}
            className="land"
            transform={`translate(${c.x},${c.y})`}
        >
            <polygon
                points={pointsString}
                fill={this.props.color}
            />
            <text className="land-type" textAnchor="middle" dominantBaseline="central" font-weight="bold">
                {this.props.text}
            </text>
            {number}
        </g>
    }
}

