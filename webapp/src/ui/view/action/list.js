'use strict';

import _ from 'underscore';

import React from 'react';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

class ActionCancelIcon extends React.Component {
    render () {
        return <i className="fa fa-times"></i>
    }
}

class ActionUndoIcon extends React.Component {
    render () {
        return <i className="fa fa-trash"></i>
    }
}

class ActionRedoIcon extends React.Component {
    render () {
        return <i className="fa fa-redo"></i>
    }
}

class ActionItem extends React.Component {
    constructor(props) {
        super(props);

        this.props.action.on('change', () => {
            this.forceUpdate();
        });
        this.cancel = this.cancel.bind(this);
        this.redo = this.redo.bind(this);
        this.undo = this.undo.bind(this);
    }

    cancel() {
        this.props.action.cancel();
    }

    undo() {
        this.props.game.undo(this.props.action);
    }

    redo() {
        this.props.game.redo(this.props.action);
    }

    icons() {
        let icons = [];
        const action = this.props.action;

        if(this.props.frozen) {
            return icons;
        }

        if(action.isRedoable()){
            icons.push(<IconButton
                aria-label="Redo"
                onClick={this.redo}
            >
                <ActionRedoIcon />
            </IconButton>)
        }
        if(action.isUndoable()) {
            icons.push(<IconButton
                aria-label="Undo"
                onClick={this.undo}
            >
                <ActionUndoIcon />
            </IconButton>)
        }
        if(action.isCancelable()){
            icons.push(<IconButton
                aria-label="Cancel"
                onClick={this.cancel}
            >
                <ActionCancelIcon />
            </IconButton>)
        }

        return icons;
    }

    render () {
        const action = this.props.action;
        const icons = this.icons();
        const className = this.props.game.currentAction == this.props.action ?
            'fa fa-star' :
            '';

        let prefix;
        if(action.chainFrom && action.chainFrom.chainFrom) {
            prefix = <i
                className="fa fa-caret-down"
                style={{
                    marginLeft: 20,
                    marginRight: 8}}
            />
        }
        else if(action.chainFrom) {
            prefix = <i
                className="fa fa-caret-down"
                style={{
                    marginLeft: 3,
                    marginRight: 13}}
            />
        }

        return <ListItem
            style={{
                paddingTop: 8,
                paddingBottom: 8
            }}
        >
            {prefix}
            <Avatar
                style={{
                    backgroundColor: action.context.player.color,
                    width: 16,
                    height: 16
                }}
            >
                <i className={className} style={{fontSize: 12}}></i>
            </Avatar>
            <ListItemText primary={action.name()} />
            <ListItemSecondaryAction>
                {icons}
            </ListItemSecondaryAction>
        </ListItem>;
    }
}
export default class ActionList extends React.Component {
    constructor(props) {
        super(props);

        this.props.game.actions.on('add remove', () => {this.forceUpdate();});
    }
    render () {
        const actionCollection = this.props.game.actions;
        const lastBlocker = this.props.game.lastBlockerAction;
        const lastBlockerIndex = actionCollection.indexOf(lastBlocker);

        const actions = _.chain(this.props.game.actions.models)
            .map(action => {
                const frozen = actionCollection.indexOf(action) < lastBlockerIndex;

                return <ActionItem
                    key={action.cid}
                    action={action}
                    game={this.props.game}
                    frozen={frozen}
                />
            })
            .reverse()
            .value();
        return <List>
            {actions}
        </List>
    }
}
