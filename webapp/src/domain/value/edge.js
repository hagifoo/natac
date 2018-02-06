'use strict';

import _ from 'underscore';
import {HexVector} from 'domain/value/hex-vector';

export default class Edge {
    constructor(nodes) {
        if(nodes.length != 2) {
            throw 'nodes.length should be 2';
        }

        this._nodes = nodes;
        this._2hex = _.reduce(nodes, (m, v) => m.add(v.hex), new HexVector(0, 0, 0));
    }

    get nodes() {
        return this._nodes;
    }

    get hex() {
        return this._2hex.div(2);
    }

    toString() {
        return this._2hex.toString();
    }
}