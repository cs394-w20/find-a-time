import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import React from "react";

/**
 * The dialog box so you can see more info about the user's assigned to room
 * Based on --> https://material-ui.com/components/dialogs/ (almost copied word-for-word)
 * */
const SimpleDialog = ({onClose, selectedValue, open, users}) => {

    const emails = Object.keys(users);

    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title" style={{margin: 0, paddingBottom: 0}}>Members</DialogTitle>
            <List style={{zIndex: 105}}>
                {emails.map(email => (
                    <ListItem key={email}>
                        <ListItemAvatar>
                            <Avatar alt={users[email].name} src={users[email].picture}/>
                        </ListItemAvatar>
                        <ListItemText primary={`${users[email].name} <${email}>`}/>
                    </ListItem>
                ))}

            </List>
        </Dialog>
    );
};

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default SimpleDialog;