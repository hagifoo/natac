'use strict';

import Backbone from 'backbone';

class Land extends Backbone.Model {
    constructor({tile, number}) {
        super();
        this._tile = tile;
        this._number = number;
    }

    getColor() {
        return '#EF9A9A';
    }
    getName() {
        return '土';
    }

    get hex() {
        return this._tile;
    }

    get number() {
        return this._number;
    }

    activate() {
        this.set({active: true});
    }

    deactivate() {
        this.set({active: false});
    }

    isActive() {
        return this.get('active');
    }

    select() {
        this.trigger('select', this);
    }
}

class Hill extends Land {
    getColor() {
        return '#EF9A9A';
    }
    getName() {
        return '土';
    }
}

class Pasture extends Land {
    getColor() {
        return '#C5E1A5';
    }
    getName() {
        return '羊';
    }
}

class Field extends Land {
    getColor() {
        return '#FFE082';
    }
    getName() {
        return '麦';
    }
}

class Mountain extends Land {
    getColor() {
        return '#B0BEC5';
    }
    getName() {
        return '鉄';
    }
}

class Forest extends Land {
    getColor() {
        return '#80CBC4';
    }
    getName() {
        return '木';
    }
}

class Desert extends Land {
    getColor() {
        return '#BCAAA4';
    }
    getName() {
        return '砂';
    }

    get number() {
        return null;
    }
}

class Ocean extends Land {
    getColor() {
        return '#BBDEFB';
    }
    getName() {
        return '';
    }
}

export {Hill, Desert, Forest, Mountain, Ocean, Pasture, Land, Field};
