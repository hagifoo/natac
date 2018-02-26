'use strict';

import Backbone from 'backbone';

export default class extends Backbone.Model {
    constructor(options) {
        super(options);
    }

    get hex() {
        return this.get('tile');
    }

    moveTo(tile) {
        this.set({tile: tile});
    }
}
