'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import {HexVector, A, B} from 'domain/value/hex-vector';
import * as land from 'domain/entity/land/index';
import Node from 'domain/value/node';
import Edge from 'domain/value/edge';

export default class extends Backbone.Model {
    constructor() {
        super();
        const center = new HexVector(0, 0, 0);
        this._tileVectors = [];
        this._oceanVectors = [];
        this._tiles = [];

        _.each(_.range(-4, 4), k => {
            _.each(_.range(-4, 4), i => {
                const v = center.add(A.multi(i)).add(B.multi(k));
                if(v.distance(center) <= 2) {
                    this._tileVectors.push(v);
                }
                else if(v.distance(center) <= 3) {
                    this._oceanVectors.push(v);
                }
            });
        });

        this.setNodesAndEdges();
    }

    get tiles() {
        return this._tiles;
    }

    get lands() {
        return this._tiles;
    }

    get oceans() {
        return this._oceans;
    }

    get nodes() {
        return _.values(this._nodes);
    }

    get edges() {
        return _.values(this._edges);
    }

    setNodesAndEdges() {
        const center = new HexVector(0, 0, 0);
        const nodes = {};
        const edgeCands = {};

        _.each(_.range(0, 3), i => {
            const vectors = _.filter(this._tileVectors, v => v.distance(center) == i);

            _.each(vectors, v => {
                const ns = _.filter(v.getNeighbors(), n => n.distance(center) >= i);

                _.each(ns, n => {
                    const nexts = _.filter(ns, n2 => n2.distance(n) == 1 && n2.distance(n) != 0);

                    _.each(nexts, next => {
                        const node = new Node({vectors: [v, n, next]});
                        nodes[node.toString()] = node;
                    })
                });
            });
        });

        this._nodes = nodes;
        const nodesByTiles = {};

        function addTile(v1, v2, node) {
            const key = v1.add(v2).toString();
            if(key in nodesByTiles) {
                nodesByTiles[key].push(node);
            } else {
                nodesByTiles[key] = [node];
            }
        }

        _.each(nodes, n => {
            const v1 = n.vectors[0];
            const v2 = n.vectors[1];
            const v3 = n.vectors[2];

            addTile(v1, v2, n);
            addTile(v2, v3, n);
            addTile(v3, v1, n);
        });

        const edges = {};
        _.each(nodesByTiles, nbt => {
            if(nbt.length != 2) {
                return;
            }
            const edge = new Edge(nbt);
            edges[edge.toString()] = edge;
        });
        this._edges = edges;
    }

    generateTiles() {
        this._oceans = _.map(this._oceanVectors, v => new land.Ocean(v));
        // const center = new HexVector(0, 0, 0);
        // this._tileVectors.push(center);
        const hexes = _.sample(this._tileVectors, this._tileVectors.length);
        const tileSet = [
            [land.Pasture, 4],
            [land.Forest, 4],
            [land.Field, 4],
            [land.Hill, 3],
            [land.Mountain, 3],
            [land.Desert, 1],
        ];

        let numbers = [
            2, 12,
            3, 3, 11, 11,
            4, 4, 10, 10,
            5, 5, 9, 9,
            6, 6, 8, 8
        ];
        numbers = _.sample(numbers, numbers.length);

        _.each(tileSet, t => {
            const num = t[1];
            const klass = t[0];
            _.each(_.range(num), () => {
                this._tiles.push(new klass({
                    tile: hexes.pop(),
                    number: numbers.pop()
                }));
            });
        });

        this.trigger('reset');
    }

    getDesert() {
        return _.find(this._tiles, t => t instanceof land.Desert);
    }

    getTileOf(coordinate) {

    }
}