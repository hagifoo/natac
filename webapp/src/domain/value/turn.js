'use strict';

import Backbone from 'backbone';

export default class extends Backbone.Model {
    get player() {
        return this.get('player');
    }
}