'use strict';
import React from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Game from 'domain/entity/game';
import Map from 'domain/entity/map';
import Board from 'domain/value/board';
import Player from 'domain/entity/player';
import Land from 'ui/view/land/index';
import PlayerList from 'ui/view/player/list';
import ActionList from 'ui/view/action/list';
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
const p3 = new Player({color: '#4CAF50'});
const order = [p1, p2, p3];
const board = new Board({
    players: [p1, p2, p3],
    map: map
});
const game = new Game({
    order: order,
    board: board,
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
                r="12"
            />
        });
    }
}

class RobberSVG extends React.Component {
    render () {
        const robber = this.props.robber;
        robber.on('change', () => {
            this.forceUpdate();
        });
        const center = hex2svg(robber.hex, 50);
        return <g transform={`translate(${center.x},${center.y})`}
                  className="robber"
        >
            <circle
                cx="0"
                cy="0"
                r={this.props.r}
            />
            <text textAnchor="middle" dominantBaseline="middle">
                &#xf21b;
            </text>
        </g>
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

        this.click = this.click.bind(this);
        this.props.node.on('change:active', () => {this.forceUpdate();});
    }
    click() {
        this.props.node.select();
    }
    render () {
        const center = hex2svg(this.props.node.hex, 50);
        const className = this.props.node.isActive() ?
            'node is-active' :
            'node';

        return <circle
            onClick={this.click}
            className={className}
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
        return _.map(map.lands, l => {
            return <Land
                land={l}
                center={hex2svg(l.hex, 50)}
                r={38}
                color={l.getColor()}
                hex={l.hex}
                text={l.getName()} />
        });
    }
}

class SVG extends React.Component {
    render () {
        const w = $(window).width() / 3 * 2;
        const h = $(window).height();
        return <svg
            width={w}
            height={h}
            viewBox={`${-w/2} ${-h/2} ${w} ${h}`}
        >
            <MapSVG />
            <EdgesSVG />
            <NodesSVG />
            <RobberSVG
                robber={game.board.robber}
                r="14"
            />
            <SettlementsSVG />
        </svg>;
    }
}

class App extends React.Component {
    reset() {
        map.generateTiles();
    }
    render () {
        return <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        natac
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={this.reset}
                    >
                        盤面リセット
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={12}>
                <Grid item xs={12} sm={2}>
                    <PlayerList game={game} />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <SVG />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <ActionList game={game} />
                </Grid>
            </Grid>
        </div>;
    }
}

render(<App />, document.getElementById('app'));
