'use strict';

import _ from 'underscore';
import Backbone from 'backbone';

import Settlement from 'domain/value/settlement';
import Robber from 'domain/value/robber';

export default class extends Backbone.Model {
    constructor(options) {
        super();
        const players = options.players;
        const map = options.map;

        this._settlements = new Backbone.Collection();
        this._robber = new Robber({tile: map.getDesert().hex});

        _.each(players, p => {
            _.each(_.range(5), () => {
                this._settlements.add(new Settlement({
                    player: p
                }));
            });
        });

        this._settlements.on('all', settlement => {
            this.trigger('settlement', settlement);
        });
    }

    get map() {
        return this.get('map');
    }

    get robber() {
        return this._robber;
    }

    get settlements() {
        return this._settlements;
    }

    getUnusedSettlements(player) {
        return this._settlements.filter(s => s.player == player && !s.node);
    }

    getBuiltSettlements(player) {
        return this._settlements.filter(s => s.player == player && s.node);
    }

    getSettlements(player) {
        return this._settlements.filter(s => s.player == player);
    }
}
