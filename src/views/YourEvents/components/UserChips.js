import React, {Fragment, useState} from "react";
import Chip from '@material-ui/core/Chip';
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import "./UserChips.scss"
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {getFirstName} from "./Utility"



/**
 * Render's the little chips that have the user name and avatar.
 */
const UserChips = ({name, email, picture}) => {
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };
    return (
        <Fragment >
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip title={`${name} <${email}>`}
                         arrow
                         onClose={handleTooltipClose}
                         open={open}
                         disableFocusListener
                         disableTouchListener
                >
                    <Chip
                        style={{color:'#303030',background:'#FAFBFC',cursor:'pointer'}}
                        avatar={<Avatar alt={name} src={picture} />}
                        variant="outlined"
                        label={getFirstName(name)}
                        tile = {email}
                        className="userchip__chip"
                        onClick={handleTooltipOpen}
                    />
                </Tooltip>
            </ClickAwayListener>
        </Fragment>

    )
};


export default UserChips;