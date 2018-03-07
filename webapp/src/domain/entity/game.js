'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import Turn from 'domain/value/turn';
import ActionRepository from 'domain/repository/action';

export default class extends Backbone.Model {
    constructor(options) {
        super(options);
        this.set('turn', new Turn({player: this.get('order')[0]}));

        this._actionRepository = new ActionRepository();
    }

    get turn() {
        return this.get('turn');
    }

    get actions() {
        return this._actionRepository.getActions();
    }

    get lastBlockerAction() {
        return this._actionRepository.lastBlocker;
    }

    get order() {
        return this.get('order');
    }

    get board() {
        return this.get('board');
    }

    get map() {
        return this.get('map');
    }

    nextTurn() {
        const current = this.turn;
        let index = _.indexOf(this.order, current.player) + 1;
        if(index == this.order.length) {
            index = 0;
        }

        this.set('turn', new Turn({player: this.order[index]}));
        return this.turn;
    }

    doAction(action) {
        this._actionRepository.add(action);
        action.on('finish', () => {
            action.off('finish');
            _.each(action.chainTo(), a => {
                this.doAction(a);
            });
        });
        action.execute();
    }

    redo(action) {
        action.rollback();
        this.doAction(action);
    }

    rollbackTo(action) {
        action.rollback();
        action.trigger('cancel', action);
    }
}