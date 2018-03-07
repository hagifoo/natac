'use strict';

import Backbone from 'backbone';

export default class extends Backbone.Model {
    constructor() {
        super();
        this._actions = new Backbone.Collection();
        this._lastBlocker = null;

        this._actions.on('cancel', action => {
            this._actions.remove(action);
        })
    }

    add(action) {
        this._actions.add(action);
        if(action.isBlocker()) {
            this._lastBlocker = action;
        }
    }

    getActions() {
        return this._actions;
    }

    get lastBlocker() {
        return this._lastBlocker;
    }
}