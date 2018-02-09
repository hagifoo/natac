'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

export default class extends Backbone.Model {
    constructor(options) {
        super(options);
    }

    get player() {
        return this.get('player');
    }

    get node() {
        return this.get('node');
    }

    builtOn(node) {
        if(this.node) {
            throw 'Already built!';
        }
        this.set('node', node);
        return this;
    }
}
