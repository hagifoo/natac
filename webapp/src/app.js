import React from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';

import Tile from 'ui/view/tile/index';
import Map from 'domain/entity/map';

const hex2svg = function(vector, scale) {
    return {
        x: scale * 2 * (vector.x + vector.y / 2) * Math.cos(Math.PI / 6),
        y: scale * vector.y * (Math.sin(Math.PI / 6) + 1)
    }
};

const map = new Map();
map.generateTiles();

class MapSVG extends React.Component {
    render () {
        map.on('reset', () => {
            this.forceUpdate();
        });
        return _.map(map.tiles, t => {
            return <Tile center={hex2svg(t.hex, 40)} r={35} color={t.getColor()} hex={t.hex} text={t.getName()} />
        });
    }
}

class SVG extends React.Component {
    render () {
        const w = $(window).width();
        const h = $(window).height();
        return <svg width={w} height={h} viewBox={`${-w/2} ${-h/2} ${w} ${h}`}>
            <MapSVG />
            </svg>;
    }
}

class ResetButton extends React.Component {
    reset() {
        map.generateTiles();
    }
    render () {
        return <button onClick={this.reset} style={{position: 'absolute'}}>Reset Map</button>;
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
