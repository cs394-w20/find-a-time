import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import React, {Fragment} from "react";
import Grid from '@material-ui/core/Grid';
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {createMuiTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import PublicIcon from "@material-ui/icons/Public"
import StopIcon from "@material-ui/icons/Stop"
import SubjectIcon from '@material-ui/icons/Subject';
import moment from "moment-timezone";
import {DATE_FORMAT} from "../../constants";
import jstz from "jstz";
// Used to change the font.{theme.palette.secondary.main

let abbrs = {
    EST : 'Eastern Standard Time',
    EDT : 'Eastern Daylight Time',
    CST : 'Central Standard Time',
    CDT : 'Central Daylight Time',
    MST : 'Mountain Standard Time',
    MDT : 'Mountain Daylight Time',
    PST : 'Pacific Standard Time',
    PDT : 'Pacific Daylight Time',
};
// formatting for timezone, overrides defaults .
moment.fn.zoneName = function () {
    let abbr = this.zoneAbbr();
    return abbrs[abbr] || abbr;
};

let timeZone = jstz.determine().name();
let longFormattedTimeZone = moment().tz(timeZone).format('zz');

const theme = createMuiTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: "#603dcb",
            light: "#956aff",
            dark: "#231099"
        },
        secondary: {
            // This is green.A700 as hex.
            main: "#af3f3f",
            light: "#e56f6a",
            dark: "#7a0719"
        }
    },
    typography: {
        fontFamily: [
            "Nunito",
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif"
        ].join(",")
    }
})

/* The style sheet */
const useStyles = makeStyles(theme => ({
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex'
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    },
    overline: {
        background: "#603dcb",
        height: "3%",
        width: "100%"
    },
    card: {
        minWidth: 275
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
    },
    title: {
        textAlign: "center"
    },
    pos: {
        marginBottom: 12
    },
    icon: {
        padding: "10%",
        display: "inline-block"
    },
    rectangleTop: {
        padding: "1%",
        paddingLeft: "2%",
        display: "inline-block",
        backgroundColor: "#585858",
        width: "100%",
        height: "1%",
        margin: 0,
        color: "white",
        fontWeight: "bold"
    },
    rectangleSuccess: {
        padding: "1%",
        paddingLeft: "2%",
        display: "inline-block",
        backgroundColor: "#603dcb",
        width: "100%",
        height: "1%",
        margin: 0,
        color: "white",
        fontWeight: "bold"
    },
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    divider: {
        marginBottom: theme.spacing(1)
    }
}));


const CondensedEvent = ({text,title,start,end}) => {
    start = "2020-01-10";
    end = "2020-01-12";
    const classes = useStyles();
    const startDay = moment(start,DATE_FORMAT).format("ddd, MMM DD");
    const endDay = moment(end,DATE_FORMAT).format("ddd, MMM DD");
    const weekDay = moment(start,DATE_FORMAT).format("ddd").toUpperCase();
    const dayOfWeek = moment(start,DATE_FORMAT).format("DD");

    title = "CS 394 Meeting";
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

    return (
        <Fragment>
            <ListItem component="div">

                <div  >

                    <div className="eventpage__container-date">
                        <span className="eventpage_container-date-dayOfweek">{weekDay}</span>
                        <br/>
                        <span>{dayOfWeek}</span>
                    </div>


                <Card className="card" >

                    <CardHeader
                        title={title}
                        style={{ textAlign: "center" }}
                    />
                    {/*Length of meeting*/}

                    <Divider component="div"/>
                    <CardContent>
                        {/*Meeting time*/}
                        <Box>
                            <Grid
                                component="div"
                                color="primary-light"
                                container
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                alignContent={"flex-start"}
                            >
                                <Grid item component="div" >
                                    <CalendarTodayIcon className="red" />
                                </Grid>


                                <Grid item component="div">
                                    <Typography
                                        className="red"

                                        gutterBottom
                                        noWrap={false}
                                        component="div">
                                        {startDay} - {endDay}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/*Time Zone*/}
                        <Box color="text.disabled">
                            <Grid
                                component="div"
                                container
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <Grid item component="div">
                                    <PublicIcon />
                                </Grid>
                                <Grid item component="div">
                                    <Typography className={classes.title} gutterBottom component="div">
                                        {longFormattedTimeZone}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/*Title and editor*/}
                        <Box color="text.secondary">
                            <Grid
                                component="div"
                                direction="row"
                                alignItems="center"
                            >
                                <Grid item component="div">
                                    <SubjectIcon />
                                </Grid>
                                <Grid item component="div">
                                    <Typography variant="body2" className={classes.wrapIcon}
                                                                                        component="p"
                                                                                        noWrap={false} gutterBottom>
                                        {text}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>


                    </CardContent>
                </Card>
                </div>





            </ListItem>
        </Fragment>
    )
};


export default CondensedEvent;