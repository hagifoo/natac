'use strict';

import _ from 'underscore';

export class HexVector {
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;

    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    add(vector) {
        return new HexVector(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
        )
    }

    sub(vector) {
        return new HexVector(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z
        )
    }

    multi(n) {
        return new HexVector(
            this.x * n,
            this.y * n,
            this.z * n
        )
    }

    div(n) {
        return new HexVector(
            this.x / n,
            this.y / n,
            this.z / n
        )
    }

    toString() {
        return `${this.x},${this.y},${this.z}`;
    }

    isLessThan(vector) {
        if((this.x + this.y) < (vector.x + vector.y)) {
            return true;
        }
        if((this.x + this.y) > (vector.x + vector.y)) {
            return false;
        }
        return this.z < vector.z;
    }

    getNeighbors() {
        if(!this._neighbors) {
            this._neighbors = [
                this.add(A),
                this.sub(A),
                this.add(B),
                this.sub(B),
                this.add(C),
                this.sub(C)
            ];
        }

        return this._neighbors;
    }

    getNeighborsStr() {
        if(!this._neighborsStr) {
            this._neighborsStr = _.map(this.getNeighbors(), n => n.toString());
        }
        return this._neighborsStr;
    }

    isNeighbor(vector) {
        return _.contains(this.getNeighborsStr(), vector.toString());
    }

    distance(vector) {
        const dx = Math.abs(vector.x - this.x);
        const dy = Math.abs(vector.y - this.y);
        const dz = Math.abs(vector.z - this.z);
        return (dx + dy + dz) / 2;
    }

    isEqualTo(vector) {
        return this.x == vector.x && this.y == vector.y && this.z == vector.z;
    }
}

export const A = new HexVector(1, -1, 0);
export const B = new HexVector(1, 0, -1);
export const C = new HexVector(0, 1, -1);
