import React, {Fragment} from "react";
import Chip from '@material-ui/core/Chip';
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import "./UserChips.scss"


/**
 * Render's the little chips that have the user name and avatar.
 */
const UserChips = ({name, email, picture}) => {

    return (
        <Fragment >
            <Tooltip title={email}>
                <Chip
                    avatar={<Avatar alt={name} src={picture} />}
                    variant="outlined"
                    label={name}
                    tile = {email}
                    disableRipple
                    className="userchip__chip"
                />
            </Tooltip>

        </Fragment>

    )
};


export default UserChips;