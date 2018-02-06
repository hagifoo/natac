'use strict';

import _ from 'underscore';
import {HexVector} from 'domain/value/hex-vector';

export default class Node {
    constructor(vectors) {
        if(vectors.length != 3) {
            throw 'vectors.length should be 3';
        }

        this._vectors = Node.sortVectors(vectors);
        this._3hex = _.reduce(vectors, (m, v) => m.add(v), new HexVector(0, 0, 0));
    }

    static sortVectors(vectors) {
        vectors.sort((a, b) => {
            return a.isLessThan(b) ?
                -1 :
                1;
        });

        return vectors;
    }

    get vectors() {
        return this._vectors;
    }

    get hex() {
        return this._3hex.div(3);
    }

    toString() {
        return this._3hex.toString();
    }
}