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
        this.listenTo(this._actionRepository, 'done', this.onActionFinish);
        this.listenTo(this._actionRepository, 'cancel', this.onActionCancel);
        this.listenTo(this._actionRepository, 'add', this.onActionAdd);
        this.set({currentAction: null});
    }

    get turn() {
        return this.get('turn');
    }

    get actions() {
        return this._actionRepository.getActions();
    }

    get currentAction() {
        return this.get('currentAction');
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

    _setCurrentAction(action) {
        if(this.currentAction) {
            return
        }

        this.set({currentAction: action});
    }

    _unsetCurrentAction() {
        if(!this.currentAction) {
            return
        }

        this.set({currentAction: null});
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
    }

    _do() {
        if(this.currentAction) {
            return;
        }

        const action = this._actionRepository.getLastUndoneAction();
        if(!action) {
            return;
        }

        this._setCurrentAction(action);
        action.do();
    }

    onActionFinish(action) {
        if(this.currentAction == action) {
            this._unsetCurrentAction();
        }
        _.each(action.chainTo(), a => {
            this._actionRepository.add(a);
        });

        this._do();
    }

    onActionCancel(action) {
        if(this.currentAction == action) {
            this._unsetCurrentAction();
        }
    }

    onActionAdd(action) {
        this._do();
    }

    redo(action) {
        action.undo();
        this._setCurrentAction(action);
        action.do();
    }

    undo(action) {
        action.undo();
        action.trigger('cancel', action);
    }
}