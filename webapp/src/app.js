import React from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';

import Tile from 'ui/view/tile/index';
import Map from 'domain/entity/map';
import 'ui/scss/index.scss';

const hex2svg = function(vector, scale) {
    return {
        x: scale * (vector.x - vector.y) / Math.sqrt(2),
        y: scale * (vector.x + vector.y - 2 * vector.z) / Math.sqrt(6)
    }
};

const map = new Map();
map.generateTiles();

class EdgesSVG extends React.Component {
    render () {
        map.on('reset', () => {
            this.forceUpdate();
        });
        return _.map(map.edges, edge => {
            const s = hex2svg(edge.nodes[0].hex, 50);
            const e = hex2svg(edge.nodes[1].hex, 50);
            return <line x1={s.x} y1={s.y} x2={e.x} y2={e.y}
                         style={{stroke: "rgba(128, 128, 128, 0.5)", strokeWidth: 5}} />
        });
    }
}

class NodeSVG extends React.Component {
    render () {
        return <circle
            className="node"
            cx={this.props.center.x}
            cy={this.props.center.y}
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
            const c = hex2svg(n.hex, 50);
            return <NodeSVG
                center={c}
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
            return <Tile center={hex2svg(t.hex, 50)} r={38}
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
