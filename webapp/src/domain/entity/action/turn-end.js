'use strict';

import Action from './index';

export default class extends Action {
    constructor({context}) {
        super({context: context});
    }

    name() {
        return 'ターン終了';
    }

    executeImpl() {
        this.context.game.nextTurn();
        this.finish();
    }

    cancel() {
        this.trigger('cancel', this);
    }

    rollbackImpl() {
        this.context.game.prevTurn();
        this.trigger('cancel', this);
    }
}