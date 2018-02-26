'use strict';

import _ from 'underscore';
import Action from '../index';

export default class extends Action {
    constructor({context}) {
        super({context: context});

        this._settlement = null;
    }

    name() {
        return '開拓地作成';
    }

    executeImpl() {
         _.each(this.context.map.nodes, n => {
             n.activate();
             n.on('select', this._build.bind(this));
         });
    }

    cancel() {
        this._unlisten();
        this.trigger('cancel', this);
    }

    rollbackImpl() {
        if(this._settlement) {
            this._settlement.destruct();
        }
        this.trigger('cancel', this);
    }

    _build(node) {
        const game = this.context.game;
        const board = this.context.board;

        this._settlement = game.turn.player.buildSettlement(node, board);

        this._unlisten();
        this.finish();
    }

    _unlisten() {
        _.each(this.context.map.nodes, n => {
            n.off('select');
            n.deactivate();
        });
    }
}