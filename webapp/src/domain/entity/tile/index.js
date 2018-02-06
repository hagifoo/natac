class Tile {
    constructor(hex) {
        this._hex = hex;
    }

    getColor() {
        return '#EF9A9A';
    }
    getName() {
        return '土';
    }

    get hex() {
        return this._hex;
    }
}

class Soil extends Tile {
    getColor() {
        return '#EF9A9A';
    }
    getName() {
        return '土';
    }
}

class Sheep extends Tile {
    getColor() {
        return '#C5E1A5';
    }
    getName() {
        return '羊';
    }
}

class Wheat extends Tile {
    getColor() {
        return '#FFE082';
    }
    getName() {
        return '麦';
    }
}

class Mine extends Tile {
    getColor() {
        return '#B0BEC5';
    }
    getName() {
        return '鉄';
    }
}

class Forest extends Tile {
    getColor() {
        return '#80CBC4';
    }
    getName() {
        return '木';
    }
}

class Desert extends Tile {
    getColor() {
        return '#BCAAA4';
    }
    getName() {
        return '砂';
    }
}

class Ocean extends Tile {
    getColor() {
        return '#BBDEFB';
    }
    getName() {
        return '';
    }
}

export {Soil, Desert, Forest, Mine, Ocean, Sheep, Tile, Wheat};
