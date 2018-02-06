'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import {HexVector, A, B} from 'domain/value/hex-vector';
import * as tile from 'domain/entity/tile/index';
import Node from 'domain/value/node';
import Edge from 'domain/value/edge';

export default class extends Backbone.Model {
    constructor() {
        super();
        const center = new HexVector(0, 0, 0);
        this._tileVectors = [];
        this._oceanVectors = [];

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
                        const node = new Node([v, n, next]);
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
        this._oceans = _.map(this._oceanVectors, v => new tile.Ocean(v));
        // const center = new HexVector(0, 0, 0);
        // this._tileVectors.push(center);
        const hexes = _.sample(this._tileVectors, this._tileVectors.length);
        const tileSet = [
            [tile.Sheep, 4],
            [tile.Forest, 4],
            [tile.Wheat, 4],
            [tile.Soil, 3],
            [tile.Mine, 3],
            [tile.Desert, 1],
        ];

        this._tiles = [];
        _.each(tileSet, t => {
            const num = t[1];
            const klass = t[0];
            _.each(_.range(num), () => {
                this._tiles.push(new klass(hexes.pop()));
            });
        });

        this.trigger('reset');
    }

    getTileOf(coordinate) {

    }
}