import React, {useContext, useEffect, useState, Fragment} from "react"
import moment from "moment-timezone"
import {UserContext} from "context/UserContext"
import "./EventInvites.scss"
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {createMuiTheme} from "@material-ui/core/styles"
import {ThemeProvider} from "@material-ui/styles"
import SubjectIcon from '@material-ui/icons/Subject';
import ScrollDuration from "./ScrollDuration";
import {makeStyles} from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import PeopleIcon from '@material-ui/icons/People';
import Typography from "@material-ui/core/Typography"
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import PublicIcon from "@material-ui/icons/Public"
import Collapse from '@material-ui/core/Collapse';
import useDuration from "./useDuration";
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import StopIcon from "@material-ui/icons/Stop"
import jstz from 'jstz';
import _SendEventInvites from "./_SendEventInvites"
import {firebaseEmailToNormalEmail} from "../Utility";
import {Link} from "@material-ui/core";
import DurationChip from "./DurationChip";
// Imports for styling the list of available users
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import useScroll from "../../views/YourEvents/components/useScroll";

// gets list of email's for a dictionary of users.
const getEmailListFromUsers = ({users}) => {
    return Object.keys(users).map(email => firebaseEmailToNormalEmail(email))
};

/**
 * Converts time to the local isotime
 * @example 2015-05-28T17:00:00 => 2015-05-28T17:00:00-06:00   // This example assumes you are in chicago
 */
const formatToLocalTime = (time) => {
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    if (currentTimeZoneOffsetInHours < 10) {
        currentTimeZoneOffsetInHours = '0' + currentTimeZoneOffsetInHours;
    }
    currentTimeZoneOffsetInHours = currentTimeZoneOffsetInHours + ':00';
    return time + '-' + currentTimeZoneOffsetInHours
};


let TIMEZONE_OFFSET = new Date().getTimezoneOffset();

/**
 * Returns true if the attribute exists
 */
const hasAttribute = attribute => {
    return typeof attribute !== "undefined" && attribute != null
};

/**
 * Computes human readable timedifference between two dates
 * @param start {String} string formatted start time
 * @param end {String} string formatted end time
 */
const getTimeDifference = ({start, end}) => {
    const now = moment(start);
    const then = moment(end);

    let humanForm = moment.duration(now.diff(then)).humanize();

    humanForm = humanForm.replace(/minutes?/, 'Minute');
    humanForm = humanForm.replace(/hours?/, 'Hour');

    return humanForm;
};


let abbrs = {
    EST: 'Eastern Standard Time',
    EDT: 'Eastern Daylight Time',
    CST: 'Central Standard Time',
    CDT: 'Central Daylight Time',
    MST: 'Mountain Standard Time',
    MDT: 'Mountain Daylight Time',
    PST: 'Pacific Standard Time',
    PDT: 'Pacific Daylight Time',
};
// formatting for timezone, overrides defaults .
moment.fn.zoneName = function () {
    let abbr = this.zoneAbbr();
    return abbrs[abbr] || abbr;
};


// Used to change the font.{theme.palette.secondary.main
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
});

/* The style sheet */
const useStyles = makeStyles(theme => ({
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


const EventInvites = ({
                          eventClicked,
                          eventInviteOnCloseCallback,
                          eventData,
                          meta_data,
                          users
                      }) => {
    const [open, setOpen] = useState(false);
    const [hasScheduled, setScheduled] = useState(false);
    const userContext = useContext(UserContext);
    const classes = useStyles();
    const [hasConfirmed, setConfirmed] = useState(false);
    const [eventHtmlLink, setEventHtmlLink] = useState(null);
    const [openNameList, setOpenNameList] = useState(false);


    let durationState = useDuration();


    const setSchedule = () => {
        setScheduled(true)
    };

    const setConfirm = () => {

        let payload = {
            emailList: emailList,
            title: title,
            description: description,
            startTime: formatToLocalTime(eventData.startSelected),
            endTime: moment(formatToLocalTime(eventData.startSelected)).add('m',durationState.duration).format()
        };

        setConfirmed(true);
        _SendEventInvites(payload)
            .then((eventHtmlLink) => setEventHtmlLink(eventHtmlLink));

    };

    const handleClose = () => {
        setScheduled(false);
        setConfirmed(false);
        setOpen(false);
        if (hasAttribute(eventInviteOnCloseCallback) != null) {
            eventInviteOnCloseCallback()
        }

        setEventHtmlLink(eventHtmlLink);
    };

    const handleNameListClick = () => {
        setOpenNameList(!openNameList)

    };


    // The timezones
    let timeZone = jstz.determine().name();
    let longFormattedTimeZone = moment(eventData.startSelected).tz(timeZone).format('zz');

    useEffect(() => setOpen(eventClicked), [eventClicked]);

    //style={{color:theme.palette.secondary.light}}
    // color="textSecondary"

    const startTime = moment(formatToLocalTime(eventData.startSelected)).format("LT");
    const endTime = moment(formatToLocalTime(eventData.startSelected)).add('m',durationState.duration).format("LT");


    const availableUsers = eventData.availableUsers;
    const eventDay = moment(eventData.startSelected).format("LL");
    const title = meta_data.title;
    const emailList =  getEmailListFromUsers({users}); //["find.a.time1@gmail.com"]
    const description = meta_data.description;


    /*
    * Manges the name dropdown by adding a button to a select item so that expandable view can be seen
    * */
    const nameListThreshold = 2;

    const manageNormalNameDropDown = () => {
        let count = 0;
        let listOfUsers = [];
        let user;

        for (let i = 0; i < availableUsers.length; i++) {
            user = availableUsers[i];
            count += 1;
            // if nameListThreshold==4 and (# of users)>=nameListThreshold+1, then add a button for this one item , this will be the dropdown trigger itemm
            if ((count === nameListThreshold) && availableUsers.length>nameListThreshold) {
                listOfUsers.push(
                    <ListItem
                        component={'div'}
                        key={user[1]}
                        button onClick={handleNameListClick}
                        style={{  width: '100%',padding:0,marginTop:0}}>

                        <Box
                            style={
                            {
                                width: '100%',
                                padding:0,
                                display:'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'

                            }
                        }>
                            <Box
                                className='eventinvite__userAvailable_nameEmail'
                                component={'div'}>
                                <Box style={
                                    {
                                        height:'3rem',
                                        width:'3rem',
                                        display:'flex',
                                        alignItems:'center',
                                        marginRight:'5px'}
                                }>
                                        <Avatar  style={{fontSize:'.2rem'}}  alt={user[0].name} src={user[0].picture}/>
                                </Box>

                                <Box style={{width:'90%'}}>
                                    <ListItemText
                                        style={{color:'#313639'}}
                                        disableTypography
                                        primary={`${user[0].name} <${user[1]}>`}/>
                                </Box>
                            </Box>

                            <Box
                                className="eventinvite__userAvailable_button"
                                component={'div'}>
                                {!openNameList ? <ExpandLess/> : <ExpandMore />}
                            </Box>
                        </Box>
                    </ListItem>);
                break;
            } else {
                listOfUsers.push(
                    <ListItem
                        component={'div'}
                        key={user[1]}
                        style={{ width: '100%',padding:0}}>

                        <Box
                            style={
                                {
                                    width: '100%',
                                    padding:0,
                                    display:'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'

                                }
                            }>
                            <Box
                                className='eventinvite__userAvailable_nameEmail'
                                component={'div'}>
                                <Box style={
                                    {
                                        alignItems: 'center',
                                        display:'flex',
                                        height:'3rem',
                                        width:'3rem',
                                        marginRight:'5px'}
                                }>
                                    <Avatar  style={{fontSize:'.2rem',border:'solid',borderWidth:'.3px',alignSelf:'center'}}  alt={user[0].name} src={user[0].picture}/>
                                </Box>

                                <Box style={{width:'90%'}}>
                                    <ListItemText
                                        style={{color:'#313639'}}
                                        disableTypography
                                        primary={`${user[0].name} <${user[1]}>`}/>
                                </Box>
                            </Box>

                        </Box>
                    </ListItem>)
            }
        }
        return listOfUsers;
    };

    const manageExpandableNameDropDown = () => {
        let listOfUsers = [];
        let user;

        for (let i = nameListThreshold; i < availableUsers.length; i++) {
            user = availableUsers[i];
            listOfUsers.push(
                <ListItem
                    component={'div'}
                    key={user[1]}
                    style={{ width: '100%',padding:0}}>

                    <Box
                        style={
                            {
                                width: '100%',
                                padding:0,
                                display:'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'

                            }
                        }>
                        <Box
                            className='eventinvite__userAvailable_nameEmail'
                            component={'div'}>
                            <Box style={
                                {
                                    display:'flex',
                                    alignItems:'center',
                                    height:'3rem',
                                    width:'3rem',
                                    marginRight:'5px'}
                            }>
                                <Avatar  style={{fontSize:'.2rem'}}  alt={user[0].name} src={user[0].picture}/>
                            </Box>

                            <Box style={{width:'90%'}}>
                                <ListItemText
                                    style={{color:'#313639'}}
                                    disableTypography
                                    primary={`${user[0].name} <${user[1]}>`}/>
                            </Box>
                        </Box>

                    </Box>
                </ListItem>)
        }

        return listOfUsers;
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
                    timeout: 500
                }}
            >


                <ThemeProvider theme={theme}>
                    <Fade in={open}>
                        <Box maxWidth="50%">
                            <Card className={classes.card}>
                                <div
                                    className={(eventHtmlLink === null) ? classes.rectangleTop : classes.rectangleSuccess}>
                                    {" "}
                                    <small> {(eventHtmlLink === null) ? (hasScheduled? 'Send Calendar Invites': 'Time Interval Info/Calendar Invites') : 'Calendar Invites Sent!'}</small>

                                </div>


                                <CardHeader
                                    title={(eventHtmlLink === null) ? (hasScheduled?`${durationState.duration} minute meeting` :`${durationState.duration} minute interval`) : 'Thank You'}
                                    style={{textAlign: "center"}}

                                />
                                {/*Length of meeting*/}

                                <Divider/>

                                <CardContent>
                                    {/*Meeting time*/}
                                    <Box>
                                        <Grid
                                            color="primary-light"
                                            container
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            alignContent={"flex-start"}
                                        >
                                            <Grid item style={{}}>
                                                <CalendarTodayIcon color="secondary"/>
                                            </Grid>


                                            <Grid item>
                                                <Box className="eventinvite__container-title">
                                                    <Typography
                                                        className="eventinvite__title"
                                                        color="secondary"
                                                        gutterBottom
                                                        noWrap={false}
                                                    >
                                                        {startTime} - {endTime}, {eventDay}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>


                                    {/*Time Zone*/}
                                    <Box color="text.disabled">
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            <Grid item>
                                                <PublicIcon/>
                                            </Grid>
                                            <Grid item>
                                                <Typography className={classes.title} gutterBottom>
                                                    {longFormattedTimeZone}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/*People available*/}
                                    {hasScheduled||
                                    <Box >
                                        <Grid
                                            color="primary"
                                            container
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            alignContent={"flex-start"}
                                        >
                                            <Grid component={'div'}
                                                  item
                                                  style={
                                                      {
                                                          display: 'flex',
                                                          flexFlow: 'flex-start',
                                                          alignItems: 'flex-start',


                                                      }
                                                  }>
                                                <PeopleIcon color="primary" style={{marginRight: '10px'}}/>
                                                <Typography
                                                    component={'div'}
                                                    color={'Primary'}
                                                ><u>People Available</u></Typography>
                                            </Grid>


                                            <Grid component={'div'} item
                                                 className={'eventinvite__container-userAvailable'}>
                                                <List style={{zIndex: 105, width: '100%',paddingTop:0}} component={'div'}>
                                                    {manageNormalNameDropDown()}
                                                </List>
                                                <Collapse in={openNameList} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {manageExpandableNameDropDown()}
                                                    </List>
                                                </Collapse>
                                            </Grid>
                                        </Grid>
                                    </Box>}

                                    {(eventHtmlLink === null) ? <Fragment/> : <Divider style={{marginBottom: "5%"}}/>}


                                    {(hasScheduled && (eventHtmlLink==null))?
                                    <Box color="text.secondary">
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            {(eventHtmlLink === null) && <Grid item>
                                                <StopIcon/>
                                            </Grid>}

                                            <Grid item component={'div'} style={{width:'80%'}}>
                                                <Typography
                                                    variant="h5"
                                                    component="p"
                                                    noWrap={false}
                                                >
                                                    {title}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>: false}



                                    {(eventHtmlLink)||hasScheduled?

                                    <Box color="text.secondary">
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            {(eventHtmlLink === null) && <Grid item>
                                                <SubjectIcon/>
                                            </Grid>}

                                            <Grid item component={'div'} style={{width:'80%'}}>
                                                <Typography
                                                    variant="body2"
                                                    component="p"
                                                    noWrap={false}
                                                >
                                                    {(eventHtmlLink === null) ? description :
                                                        <a href={eventHtmlLink}>Visit your event page</a>}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>:false}

                                </CardContent>

                                {!(eventHtmlLink==null)||<Divider />}

                                <CardActions>
                                    <Box style={{width:'100%',marginTop:'10px'}}>
                                        {hasScheduled|| <Box>
                                            <Typography
                                                color={'textSecondary'}
                                                variant="subtitle2"
                                                component="p"
                                                noWrap={false}
                                            >
                                                CALENDAR EVENT DURATION:
                                            </Typography>
                                        </Box>}

                                        {hasScheduled||
                                        <Box style={{width:'100%'}}>
                                            <ScrollDuration durationState={durationState}/>
                                        </Box>}


                                        <Box>
                                        {!hasScheduled ? (


                                            <Fragment>

                                                <Button
                                                    onClick={setSchedule}
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Send Calendar Invites
                                                </Button>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                {eventHtmlLink === null||
                                                <Button
                                                    onClick={handleClose}
                                                    size="small"
                                                    variant="contained"
                                                    color={(eventHtmlLink === null) ? 'secondary' : 'primary'}
                                                >
                                                    Close
                                                </Button>}
                                                {(eventHtmlLink === null) ?
                                                    <Button
                                                        onClick={setConfirm}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                    >
                                                        Confirm Calendar Invites
                                                    </Button> :
                                                    <Fragment/>}
                                            </Fragment>
                                        )}
                                        </Box>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Box>
                    </Fade>
                </ThemeProvider>
            </Modal>
        </div>
    )
}

export default EventInvites
