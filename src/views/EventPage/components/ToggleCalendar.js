import React,{useState} from "react"
import "./ToggleCalendar.scss"
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
    buttonGroup:
        {
            border:'solid',
            borderRadius: '5px',
            borderWidth: '2px',
            borderColor: '#ccc'
        },
    buttonActive: {
        fontWeight:'bold',
        background: '#44548f',
        color:'#fff',
        "&:hover": {
            backgroundColor: "#374473"
        }
    },
    buttonNotActive:
        {
            fontWeight:'normal',
            color:'#424242',
            background:'#ffffff',
            "&:hover": {
                backgroundColor: "#F5F5F5"
            }
        }
}));

const ToggleCalendar = ({onGroupAvailabilityClick, onYourAvailabilityClick,isUserLoaded}) =>{
    const [isGroupAvailButton, setIsGroupAvailButton] = useState(true);
    const classes = useStyles();

    const onGroupClick = () =>{
        onGroupAvailabilityClick();
        setIsGroupAvailButton(true);
    };

    const onYourClick = () =>{
        onYourAvailabilityClick();
        setIsGroupAvailButton(false);
    };

    return (
        <nav className="toggleCalendar__container">
            <div className="toggleCalendar__links-container">
                    <ButtonGroup size="large" aria-label="small outlined button group"
                                 className={classes.buttonGroup} >
                        <Button
                            className={isGroupAvailButton? classes.buttonActive : classes.buttonNotActive }
                            onClick={onGroupClick}
                            variant="contained">
                            Group Availability
                        </Button>
                        <Button
                            className={!(isGroupAvailButton)? classes.buttonActive : classes.buttonNotActive }
                            onClick={onYourClick}
                            disabled={!(isUserLoaded)}
                            variant="contained">
                            Your Availability
                        </Button>
                    </ButtonGroup>
            </div>
        </nav>
    )
};

ToggleCalendar.propTypes = {
    onGroupAvailabilityClick: PropTypes.func.isRequired,
    onYourAvailabilityClick: PropTypes.func.isRequired,
    isUserLoaded: PropTypes.bool.isRequired
};

export default ToggleCalendar;