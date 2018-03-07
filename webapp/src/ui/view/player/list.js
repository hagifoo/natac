'use strict';
import _ from 'underscore';
import React from 'react';
import Avatar from 'material-ui/Avatar';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import TurnEndAction from 'domain/entity/action/turn-end';
import RollDiceAction from 'domain/entity/action/dice/roll';
import BuildSettlementAction from 'domain/entity/action/build/settlement';

class BuildSettlementIcon extends React.Component {
    render () {
        return <i class="fa fa-home" />
    }
}

class RollDiceIcon extends React.Component {
    render () {
        return <i class="fa fa-minus-square"></i>
    }
}

class EndTurnIcon extends React.Component {
    render () {
        return <i class="fas fa-arrow-alt-circle-right"></i>
    }
}

class PlayerItem extends React.Component {
    constructor(props) {
        super(props);
        const game = props.game;

        this.buildSettlement = this.buildSettlement.bind(this);
        this.rollDice = this.rollDice.bind(this);
        this.endTurn = this.endTurn.bind(this);
        game.on('change:turn', () => {
            this.forceUpdate();
        });
        game.on('change:currentAction', () => {
            this.forceUpdate();
        });
        game.board.on('settlement', () => {
            this.forceUpdate();
        });
    }

    rollDice () {
        const game = this.props.game;
        const map = game.map;
        const board = game.board;

        game.doAction(new RollDiceAction({
            context: {
                game: game,
                board: board,
                map: map,
                player: game.turn.player
            }
        }));
    }

    buildSettlement() {
        const game = this.props.game;
        const map = game.map;
        const board = game.board;

        game.doAction(new BuildSettlementAction({
            context: {
                game: game,
                board: board,
                map: map,
                player: game.turn.player
            }
        }));
    }

    endTurn() {
        const game = this.props.game;
        const map = game.map;
        const board = game.board;

        game.doAction(new TurnEndAction({
            context: {
                game: game,
                board: board,
                map: map,
                player: game.turn.player
            }
        }));
    }

    render () {
        const game = this.props.game;
        const player = this.props.player;

        const className = game.turn.player == player ?
            'fa fa-star' :
            '';
        const disableAction = game.currentAction != null;
        let content, actions;

        if(game.turn.player == player) {
            content = <CardContent>
                <Typography component="p">
                    開拓地: {game.board.getBuiltSettlements(player).length} / {game.board.getSettlements(player).length}
                </Typography>
            </CardContent>
            actions = <CardActions disableActionSpacing>
                <IconButton
                    aria-label="Build Settlement"
                    onClick={this.rollDice}
                    disabled={disableAction}
                >
                    <RollDiceIcon />
                </IconButton>
                <IconButton
                    aria-label="Build Settlement"
                    onClick={this.buildSettlement}
                    disabled={disableAction}
                >
                    <BuildSettlementIcon />
                </IconButton>
                <IconButton
                    aria-label="Share"
                    onClick={this.endTurn}
                    disabled={disableAction}
                >
                    <EndTurnIcon />
                </IconButton>
            </CardActions>
        }
        return <Card
            style={{margin: 8}}
        >
            <CardHeader
                avatar={
                    <Avatar style={{backgroundColor: player.color}}>
                        <i className={className}></i>
                    </Avatar>
                }
                title="勝利点: "
            />
            {content}
            {actions}
        </Card>
    }
}

export default class PlayerList extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        const players = _.map(this.props.game.order, p =>
            <PlayerItem
                game={this.props.game}
                player={p}
            />
        );
        return <List>
            {players}
        </List>
    }
}
