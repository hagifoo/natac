import React from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';

import Land from 'ui/view/land/index';
import Map from 'domain/entity/map';
import Board from 'domain/value/board';
import Player from 'domain/entity/player';
import 'ui/scss/index.scss';

const hex2svg = function(vector, scale) {
    return {
        x: scale * (vector.x - vector.y) / Math.sqrt(2),
        y: scale * (vector.x + vector.y - 2 * vector.z) / Math.sqrt(6)
    }
};

const map = new Map();
map.generateTiles();
const p1 = new Player({color: '#F44336'});
const p2 = new Player({color: '#2196F3'});
const board = new Board({
    players: [p1, p2],
    map: map
});

{/*<text textAnchor="middle" dominantBaseline="middle">*/}
    {/*&#xf1ad;*/}
{/*</text>*/}
class SettlementSVG extends React.Component {
    render () {
        const settle = this.props.settlement;
        settle.on('change', () => {
            this.forceUpdate();
        });
        const center = hex2svg(settle.node.hex, 50);
        return <g transform={`translate(${center.x},${center.y})`}
                  className="settlement"
        >
            <circle
                cx="0"
                cy="0"
                r={this.props.r}
                fill={settle.player.color}
            />
            <text textAnchor="middle" dominantBaseline="middle">
                &#xf015;
            </text>
        </g>
    }
}

class SettlementsSVG extends React.Component {
    render () {
        board.settlements.on('reset change:node', () => {
            this.forceUpdate();
        });
        return board.settlements.map(s => {
            if(!s.node) {
                return;
            }
            return <SettlementSVG
                settlement={s}
                r="14"
            />
        });
    }
}

class EdgesSVG extends React.Component {
    render () {
        map.on('reset', () => {
            this.forceUpdate();
        });
        return _.map(map.edges, edge => {
            const s = hex2svg(edge.nodes[0].hex, 50);
            const e = hex2svg(edge.nodes[1].hex, 50);
            return <line
                className="edge"
                x1={s.x}
                y1={s.y}
                x2={e.x}
                y2={e.y}
            />
        });
    }
}

class NodeSVG extends React.Component {
    constructor(props) {
        super(props);

        this.buildSettlement = this.buildSettlement.bind(this);
    }
    buildSettlement() {
        p1.buildSettlement(this.props.node, board);
    }
    render () {
        const center = hex2svg(this.props.node.hex, 50);
        return <circle
            onClick={this.buildSettlement}
            className="node"
            cx={center.x}
            cy={center.y}
            r={this.props.r}
        />
    }
}

class NodesSVG extends React.Component {
    render () {
        map.on('reset', () => {
            this.forceUpdate();
        });
        return _.map(map.nodes, n => {
            return <NodeSVG
                node={n}
                r="8"
                color="rgba(128, 128, 128, 0.5)"
            />
        });
    }
}

class MapSVG extends React.Component {
    render () {
        map.on('reset', () => {
            this.forceUpdate();
        });
        return _.map(map.tiles, t => {
            return <Land center={hex2svg(t.hex, 50)} r={38}
                         color={t.getColor()} hex={t.hex} text={t.getName()} />
        });
    }
}

class SVG extends React.Component {
    render () {
        const w = $(window).width();
        const h = $(window).height();
        return <svg
            width={w}
            height={h}
            viewBox={`${-w/2} ${-h/2} ${w} ${h}`}
        >
            <MapSVG />
            <EdgesSVG />
            <NodesSVG />
            <SettlementsSVG />
        </svg>;
    }
}

class ResetButton extends React.Component {
    reset() {
        map.generateTiles();
    }
    render () {
        return <button onClick={this.reset}
                       style={{position: 'absolute'}}>Reset Map</button>;
    }
}


class App extends React.Component {
    render () {
        return <div>
            <ResetButton />
            <SVG />
        </div>;
    }
}

render(<App />, document.getElementById('app'));
