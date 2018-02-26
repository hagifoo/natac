'use strict';

import _ from 'underscore';
import Action from './index';

export default class extends Action {
    constructor({context}) {
        super({context: context});

        this._moveFrom = null;
    }

    name() {
        return '盗賊移動';
    }

    executeImpl() {
        _.each(this.context.map.tiles, t => {
            t.activate();
            t.on('select', this._move.bind(this));
        });
    }

    _move(tile) {
        this._moveFrom = this.context.board.robber.hex;
        this.context.board.robber.moveTo(tile.hex);

        this._unlisten();
        this.finish();
    }

    rollbackImpl() {
        if(this._moveFrom) {
            this.context.board.robber.moveTo(this._moveFrom);
        }
        this.trigger('cancel', this);
    }

    cancel() {
        this._unlisten();
        this.trigger('cancel', this);
    }

    _unlisten() {
        _.each(this.context.map.tiles, t => {
            t.off('select');
            t.deactivate();
        });
    }
}