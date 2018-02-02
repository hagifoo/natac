'use strict';

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

    distance(vector) {
        const dx = Math.abs(vector.x - this.x);
        const dy = Math.abs(vector.y - this.y);
        const dz = Math.abs(vector.z - this.z);
        return dx + dy + dz;
    }
}

export const A = new HexVector(1, -1, 0);
export const B = new HexVector(1, 0, -1);
export const C = new HexVector(-1, 1, 0);
