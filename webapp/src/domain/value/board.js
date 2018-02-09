'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import Settlement from 'domain/value/settlement';

export default class extends Backbone.Model {
    constructor(options) {
        super();
        const players = options.players;

        this._settlements = new Backbone.Collection();


        _.each(players, p => {
            _.each(_.range(5), () => {
                this._settlements.add(new Settlement({
                    player: p
                }));
            });
        });
    }

    get settlements() {
        return this._settlements;
    }

    getUnusedSettlements(player) {
        return this._settlements.filter(s => s.player == player && !s.node);
    }
}
