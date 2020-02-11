import React from "react";
import {createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeProvider} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";

const theme1 = createMuiTheme({
    palette: {
        primary: {
            main: "#19588a",

        },
        secondary: {
            main: "#A5ADBA",
        }
    }
});


/**
 * Render's the little chips that have the user name and avatar.
 */
const DurationChip = ({duration, durationState}) => {

    const handleOpen = () => {
        durationState.setDuration(duration);

    };

    return (
        <div >
            <MuiThemeProvider theme={theme1}>

            <Button
                size={"medium"}
                    style={{borderRadius: '25px'} }
                    color={'primary'}
                    variant={(durationState.duration === duration)?'contained':'outlined'}
                    onClick={handleOpen}
                >
                <span style={{fontSize:'.61rem'}}>{`${duration} minutes`}</span>

            </Button>
            </MuiThemeProvider>
        </div>

    )
};


export default DurationChip;