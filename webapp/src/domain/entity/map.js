'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import {HexVector, A, B} from 'domain/value/hex-vector';

class Tile {
    constructor(hex) {
        this._hex = hex;
    }

    get hex() {
        return this._hex;
    }
}

class Soil extends Tile {
    getColor() {
        return '#EF9A9A';
    }
    getName() {
        return '土';
    }
}

class Sheep extends Tile {
    getColor() {
        return '#C5E1A5';
    }
    getName() {
        return '羊';
    }
}

class Wheat extends Tile {
    getColor() {
        return '#FFE082';
    }
    getName() {
        return '麦';
    }
}

class Mine extends Tile {
    getColor() {
        return '#B0BEC5';
    }
    getName() {
        return '鉄';
    }
}

class Forest extends Tile {
    getColor() {
        return '#80CBC4';
    }
    getName() {
        return '木';
    }
}

class Desert extends Tile {
    getColor() {
        return '#BCAAA4';
    }
    getName() {
        return '砂';
    }
}

class Ocean extends Tile {
    getColor() {
        return '#BBDEFB';
    }
    getName() {
        return '';
    }
}

export default class extends Backbone.Model {
    constructor() {
        super();
        const center = new HexVector(0, 0, 0);
        this._tileVectors = [];
        this._oceanVectors = [];

        _.each(_.range(-4, 4), k => {
            _.each(_.range(-4, 4), i => {
                const v = center.add(A.multi(i)).add(B.multi(k));
                if(v.distance(center) == 0) {
                    this._tileVectors.push(v);
                }
                else if(v.distance(center) <= 4) {
                    this._tileVectors.push(v);
                }
                else if(v.distance(center) <= 6) {
                    this._oceanVectors.push(v);
                }
            });
        });
    }

    get tiles() {
        return this._tiles;
    }

    generateTiles() {
        this._tiles = _.map(this._oceanVectors, v => new Ocean(v));
        // const center = new HexVector(0, 0, 0);
        // this._tileVectors.push(center);
        const hexes = _.sample(this._tileVectors, this._tileVectors.length);
        const tileSet = [
            [Sheep, 4],
            [Forest, 4],
            [Wheat, 4],
            [Soil, 3],
            [Mine, 3],
            [Desert, 1],
        ];

        _.each(tileSet, t => {
            const num = t[1];
            const klass = t[0];
            _.each(_.range(num), () => {
                this._tiles.push(new klass(hexes.pop()));
            });
        });

        this.trigger('reset');
    }

    getTileOf(coordinate) {

    }
}