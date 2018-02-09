'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

export default class extends Backbone.Model {
    get color() {
        return this.get('color');
    }

    buildSettlement(node, board) {
        const settles = board.getUnusedSettlements(this);
        if(settles.length == 0) {
            throw 'No Settlement remaining';
        }

        return _.sample(settles).builtOn(node);
    }
}
