'use strict';

import React from 'react';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

class ActionCancelIcon extends React.Component {
    render () {
        return <i className="fa fa-times"></i>
    }
}

class ActionRollbackIcon extends React.Component {
    render () {
        return <i className="fa fa-redo"></i>
    }
}

class ActionItem extends React.Component {
    constructor(props) {
        super(props);

        this.props.action.on('change', () => {this.forceUpdate();});
        this.cancel = this.cancel.bind(this);
        this.rollback = this.rollback.bind(this);
    }

    cancel() {
        this.props.action.cancel();
    }

    rollback() {
        this.props.game.rollbackTo(this.props.action);
    }

    render () {
        let icon;
        const action = this.props.action;
        if(action.isBlocker()) {

        } else {
            if(action.isExecuted()) {
                icon = <IconButton
                    aria-label="Rollback"
                    onClick={this.rollback}
                >
                    <ActionRollbackIcon />
                </IconButton>
            } else {
                icon = <IconButton
                    aria-label="Cancel"
                    onClick={this.cancel}
                >
                    <ActionCancelIcon />
                </IconButton>
            }
        }

        return <ListItem
            style={{
                paddingTop: 8,
                paddingBottom: 8
            }}
        >
            <Avatar
                style={{
                    backgroundColor: action.context.player.color,
                    width: 16,
                    height: 16
                }}
            />
            <ListItemText primary={action.name()} />
            <ListItemSecondaryAction>
                {icon}
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
        const actions = this.props.game.actions.map(action => {
            return <ActionItem
                action={action}
                game={this.props.game}
            />
        });
        return <List>
            {actions}
        </List>
    }
}
