'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import Turn from 'domain/value/turn';

export default class extends Backbone.Model {
    constructor(options) {
        super(options);
        this._order = options.order;
        this.set('turn', new Turn({player: this._order[0]}));
    }

    get turn() {
        return this.get('turn');
    }

    nextTurn() {
        const current = this.turn;
        let index = _.indexOf(this._order, current.player) + 1;
        if(index == this._order.length) {
            index = 0;
        }

        this.set('turn', new Turn({player: this._order[index]}));
        return this.turn;
    }
}