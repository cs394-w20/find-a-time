import React, {useContext, useEffect, useState} from "react"
import { UserContext } from "../../context/UserContext"

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

/**
 * Returns true if the attribute exists
 */
const hasAttribute = (attribute) =>{
    return (typeof(attribute) !== 'undefined' && attribute != null)
};



/* The style sheet */
const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const EventInvites = ({eventClicked,eventInviteOnCloseCallback, data}) => {
    const [open, setOpen] = useState(null);
    const userContext = useContext(UserContext);
    const classes = useStyles();

    useEffect(()=> setOpen(eventClicked),[eventClicked]);

    const handleClose = () => {
        setOpen(false);
        if (eventInviteOnCloseCallback!=null){
            eventInviteOnCloseCallback();
        }
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Transition modal</h2>
                        <p id="transition-modal-description">react-transition-group animates me.</p>
                        <p> {hasAttribute(data)? "there is data": " no data"} </p>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}



export default EventInvites;
