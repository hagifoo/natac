'use strict';

import Backbone from 'backbone';

export default class extends Backbone.Model {
    constructor({context, chainFrom=null}) {
        super();
        this._context = context;
        this._chainFrom = chainFrom;
        this.set({done: false});
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

    isDone() {
        return this.get('done');
    }

    cancel() {
        this.trigger('remove');
    }

    do() {
        if(this.isDone()) {
            throw 'Already done!';
        }

        this.doImpl();
    }

    doImpl() {
        throw 'Not Implemented!';
    }

    undo() {
        if(!this.isDone())  {
            throw `This Action is not dod: ${this.toJSON()}`;
        }
        if(this.isBlocker()) {
            throw `This Action can not be rolled back: ${this.toJSON()}`;
        }

        this.undoImpl();

        this.set({done: false});
    }

    undoImpl() {
        throw 'Not Implemented!';
    }

    finish() {
        this.set({done: true});
        this.trigger('finish', this);
    }

    chainTo() {
        return [];
    }

    get chainFrom() {
        return this._chainFrom;
    }

    isUndoable() {
        return !this.isBlocker() && this.isDone() && !this.chainFrom;
    }

    isCancelable() {
        return !this.isDone() && !this.chainFrom;
    }

    isRedoable() {
        return !this.isBlocker() && this.isDone();
    }

    toJSON() {

    }

    static fromJSON() {

    }
}