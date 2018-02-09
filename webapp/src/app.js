import React from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

import Game from 'domain/entity/game';
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
const game = new Game({
    order: [p1, p2]
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
                r="12"
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
        game.turn.player.buildSettlement(this.props.node, board);
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

class Turn extends React.Component {
    render () {
        game.on('change:turn', () => {
            this.forceUpdate();
        });
        return <div style={{color: game.turn.player.color}}>
            Turn
        </div>;
    }
}

class BuildSettlementButton extends React.Component {
    build() {
    }
    render () {
        return <RaisedButton
            onClick={this.build}
            label="Settlement"
            primary={true}
        >
            <i className="fas fa-home"></i>
        </RaisedButton>;
    }
}

class NextTurnButton extends React.Component {
    next() {
        game.nextTurn();
    }
    render () {
        return <RaisedButton
            onClick={this.next}
            label="Next Turn"
            primary={true}
        >
            <i className="fas fa-arrow-alt-circle-right"></i>
        </RaisedButton>;
    }
}

class ResetButton extends React.Component {
    reset() {
        map.generateTiles();
    }
    render () {
        return <RaisedButton
            onClick={this.reset}
            label="Reset Map"
            primary={true}
        />;
    }
}

class App extends React.Component {
    render () {
        return <MuiThemeProvider>
            <AppBar />
            <Turn />
            <ResetButton />
            <NextTurnButton />
            <BuildSettlementButton />
            <SVG />
        </MuiThemeProvider>;
    }
}

render(<App />, document.getElementById('app'));
