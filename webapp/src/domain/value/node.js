'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import {HexVector} from 'domain/value/hex-vector';

export default class Node extends Backbone.Model {
    constructor(options) {
        super(options);
        if(options.vectors.length != 3) {
            throw 'vectors.length should be 3';
        }

        this._vectors = Node.sortVectors(options.vectors);
        this._3hex = _.reduce(options.vectors, (m, v) => m.add(v), new HexVector(0, 0, 0));
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

    activate() {
        this.set({active: true});
    }

    deactivate() {
        this.set({active: false});
    }

    isActive() {
        return this.get('active');
    }

    select() {
        this.trigger('select', this);
    }

    toString() {
        return this._3hex.toString();
    }
}