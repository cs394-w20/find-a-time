import React, { useContext, useEffect, useState, Fragment } from "react"
import moment from "moment-timezone"
import { UserContext } from "../../context/UserContext"
import "./EventInvites.css"

import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"

import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"

import Typography from "@material-ui/core/Typography"

import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import PublicIcon from "@material-ui/icons/Public"

import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import StopIcon from "@material-ui/icons/Stop"
import jstz from 'jstz';
import _SendEventInvites from "./_SendEventInvites"
import {Link} from "@material-ui/core";



/**
 * Converts time to the local isotime
 * @example 2015-05-28T17:00:00 => 2015-05-28T17:00:00-06:00   // Assuming your in chicago
 */
const formatToLocalTime = (time)=>{
  let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
  if (currentTimeZoneOffsetInHours <10){
    currentTimeZoneOffsetInHours = '0'+currentTimeZoneOffsetInHours;
  }
  currentTimeZoneOffsetInHours = currentTimeZoneOffsetInHours+':00';
  return time+'-'+currentTimeZoneOffsetInHours
};


let TIMEZONE_OFFSET = new Date().getTimezoneOffset();

// ToDo: Text Editing
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
const getTimeDifference = ({start,end}) =>{
  const now = moment(start);
  const then = moment(end);

  let humanForm = moment.duration(now.diff(then)).humanize();

  humanForm= humanForm.replace(/minutes?/, 'Minute');
  humanForm =humanForm.replace(/hours?/, 'Hour');

  return humanForm;
};


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
})

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


const EventInvites = ({
  eventClicked,
  eventInviteOnCloseCallback,
  eventData
}) => {
  const [open, setOpen] = useState(false);
  const [hasScheduled, setScheduled] = useState(false);
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [hasConfirmed, setConfirmed] = useState(false);
  const [eventHtmlLink, setEventHtmlLink] = useState(null);

  const setSchedule = () => {
    setScheduled(true)
  };

  const setConfirm = () => {
    setConfirmed(true);
        _SendEventInvites(payload)
            .then((eventHtmlLink)=>setEventHtmlLink(eventHtmlLink));

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


  // The timezones
  let timeZone = jstz.determine().name();
  let longFormattedTimeZone = moment(eventData.startSelected).tz(timeZone).format('zz');

  useEffect(() => setOpen(eventClicked), [eventClicked]);

  //style={{color:theme.palette.secondary.light}}
  // color="textSecondary"

  const startTime = moment(eventData.startSelected).format("LT");
  const endTime = moment(eventData.endSelected).format("LT");
  const eventDay = moment(eventData.startSelected).format("LL");
  const title = eventData.title;
  const emailList = eventData.emailList;
  const description = eventData.description;
  const humanReadableTimeDiff = getTimeDifference({start: eventData.startSelected,end:eventData.endSelected});


  const payload = {
    emailList: emailList,
    title:title,
    description:description,
    startTime: formatToLocalTime(eventData.startSelected),
    endTime: formatToLocalTime(eventData.endSelected)
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
              <Card className={classes.card} >
                <div className={(eventHtmlLink===null)?classes.rectangleTop:classes.rectangleSuccess}>
                  {" "}
                  <small> {(eventHtmlLink===null)?'Send Calendar Invites': 'Calendar Invites Sent!'}</small>

                </div>
                <CardHeader
                  title={(eventHtmlLink===null)? `${humanReadableTimeDiff} Meeting`: 'Thank You'}
                  style={{ textAlign: "center" }}
                  u
                />
                {/*Length of meeting*/}

                <Divider />

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
                        <CalendarTodayIcon color="secondary" />
                      </Grid>


                      <Grid item>
                        <Typography
                          className={classes.title}
                          color="secondary"
                          gutterBottom
                          noWrap={false}
                        >
                          {startTime} - {endTime}, {eventDay}
                        </Typography>
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
                        <PublicIcon />
                      </Grid>
                      <Grid item>
                        <Typography className={classes.title} gutterBottom>
                          {longFormattedTimeZone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/*Title and editor*/}
                  <Box color="text.secondary">
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={0}
                    >
                      <Grid item>
                        <StopIcon />
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          {title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  {(eventHtmlLink===null)? <Fragment/>: <Divider style={{marginBottom:"5%"}}/>}


                  <Box color="text.primary">
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item>

                        <Typography
                          variant="body2"
                          component="p"
                          noWrap={false}
                        >
                          {(eventHtmlLink===null)?description: <a href={eventHtmlLink} >Visit your event page</a>}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <CardActions>
                  {!hasScheduled ? (
                    <Fragment>
                      <Button
                        onClick={handleClose}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={setSchedule}
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        Send Invites
                      </Button>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Button
                        onClick={handleClose}
                        size="small"
                        variant="contained"
                        color={(eventHtmlLink===null)? 'secondary': 'primary'}
                      >
                        {(eventHtmlLink===null)? 'Cancel': 'Close'}
                      </Button>
                      {(eventHtmlLink===null)?
                      <Button
                        onClick={setConfirm}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Confirm
                      </Button>:
                          <Fragment/>}
                    </Fragment>
                  )}
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
