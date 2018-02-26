'use strict';

import Backbone from 'backbone';

export default class extends Backbone.Model {
    constructor() {
        super();
        this._actions = new Backbone.Collection();
        this._visibleActions = [];

        this._actions.on('cancel', action => {
            this._actions.remove(action);
        })
    }

    add(action) {
        this._actions.add(action);
        this._visibleActions.push(action);
    }

    getActions() {
        return this._actions;
    }
}