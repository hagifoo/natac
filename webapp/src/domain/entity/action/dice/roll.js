'use strict';

import _ from 'underscore';
import Action from '../index';

import MoveRobberAction from '../move-robber';

export default class extends Action {
    constructor({context}) {
        super({context: context});

        this._dice = _.random(1, 6) + _.random(1, 6);
    }

    name() {
        return `ダイス: ${this._dice}`;
    }

    isBlocker() {
        return true;
    }

    doImpl() {
        this.finish();
    }

    undoImpl() {

    }

    chainTo() {
        if(this.number == 0) {
            return [
                // new ResourceDistributeAction({context: this.context, dice: 10})
            ];
        } else {
            return [
                // new DiscardAction({context: this.context, dice: 10}),
                new MoveRobberAction({
                    context: this.context,
                    dice: this._dice,
                    chainFrom: this
                }),
            ]
        }
    }
}