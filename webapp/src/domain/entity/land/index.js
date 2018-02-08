class Land {
    constructor(tile) {
        this._tile = tile;
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
