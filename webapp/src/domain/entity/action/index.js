'use strict';

import Backbone from 'backbone';

export default class extends Backbone.Model {
    constructor({context, chainFrom=null}) {
        super();
        this._context = context;
        this._chainFrom = chainFrom;
        this.set({executed: false});
    }

    name() {
        throw 'Not Implemented!';
    }

    get context() {
        return this._context;
    }

    isBlocker() {
        return false;
    }

    isExecuted() {
        return this.get('executed');
    }

    cancel() {
        this.trigger('remove');
    }

    execute() {
        if(this.isExecuted()) {
            throw 'Already executed!';
        }

        this.executeImpl();
    }

    executeImpl() {
        throw 'Not Implemented!';
    }

    rollback() {
        if(!this.isExecuted())  {
            throw `This Action is not executed: ${this.toJSON()}`;
        }
        if(this.isBlocker()) {
            throw `This Action can not be rolled back: ${this.toJSON()}`;
        }

        this.rollbackImpl();

        this.set({executed: false});
    }

    rollbackImpl() {
        throw 'Not Implemented!';
    }

    finish() {
        this.set({executed: true});
        this.trigger('finish', this);
    }

    chainTo() {
        return [];
    }

    toJSON() {

    }

    static fromJSON() {

    }
}