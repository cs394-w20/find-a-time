import React, { useContext, useEffect, useState, Fragment } from "react"
import moment from "moment"
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

// ToDo: Text Editing
/**
 * Returns true if the attribute exists
 */
const hasAttribute = attribute => {
  return typeof attribute !== "undefined" && attribute != null
}

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
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  divider: {
    marginBottom: theme.spacing(1)
  }
}))

const EventInvites = ({
  eventClicked,
  eventInviteOnCloseCallback,
  data,
  eventData
}) => {
  const [open, setOpen] = useState(false)
  const [hasScheduled, setScheduled] = useState(false)
  const userContext = useContext(UserContext)
  const classes = useStyles()
  const [hasConfirmed, setConfirmed] = useState(false)

  const setSchedule = () => {
    setScheduled(true)
  }

  const setConfirm = () => {
    setConfirmed(true)
  }

  const handleClose = () => {
    setScheduled(false)
    setConfirmed(false)
    setOpen(false)
    if (hasAttribute(eventInviteOnCloseCallback) != null) {
      eventInviteOnCloseCallback()
    }
  }

  useEffect(() => setOpen(eventClicked), [eventClicked])

  //style={{color:theme.palette.secondary.light}}
  // color="textSecondary"
  const startTime = moment(eventData.startSelected).format("LT")
  const endTime = moment(eventData.endSelected).format("LT")
  const eventDay = moment(eventData.startSelected).format("LL")
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
              <Card className={classes.card} style={{ background: "#f8f8ff" }}>
                <div className={classes.rectangleTop}>
                  {" "}
                  <small> Send Calendar Invites</small>
                </div>
                <CardHeader
                  title={"30 Minute Meeting"}
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
                      alignItems={"flex-start"}
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
                          Central Time - US & Canada
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
                          CS 394 Meeting
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

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
                          Hey everyone! Please fill out this form whenever you
                          can so that we can find a time to meet weekly! Make
                          sure to connect your Google calendar so you don’t have
                          to manually fill in events!
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
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={setConfirm}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Confirm
                      </Button>
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
