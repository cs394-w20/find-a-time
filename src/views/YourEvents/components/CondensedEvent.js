import ListItem from "@material-ui/core/ListItem";
import React, {Fragment} from "react";
import Grid from '@material-ui/core/Grid';
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import PublicIcon from "@material-ui/icons/Public"
import SubjectIcon from '@material-ui/icons/Subject';
import moment from "moment-timezone";
import {DATE_FORMAT} from "../../../constants";
import jstz from "jstz";
import {Link} from "react-router-dom"
import GroupIcon from '@material-ui/icons/Group';
import UserChips from "./UserChips";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import "./CondensedEvent.scss"
import Button from "@material-ui/core/Button";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {CardActions} from "@material-ui/core";
import SimpleDialog from "./SimpleDialog";

// Hacky way to change button color
const purpleTheme = createMuiTheme({palette: {primary: {main: "#5243AA"}}});

/******************* GETS THE TIME ZONE TO DISPLAY **************/
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
// formatting for timezone -- overrides defaults
moment.fn.zoneName = function () {
    let abbr = this.zoneAbbr();
    return abbrs[abbr] || abbr;
};

const timeZone = jstz.determine().name();
const longFormattedTimeZone = moment().tz(timeZone).format('zz');




/** The event card **/
const CondensedEvent = ({payload}) => {
    const start = payload.time_interval.start;
    const end = payload.time_interval.end;
    const title = payload.meta_data.title;
    const description = payload.meta_data.description;
    const roomId = 1; //FixMe: Hard coded

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
    };

    const startDay = moment(start, DATE_FORMAT).format("ddd, MMM Do");
    const endDay = moment(end, DATE_FORMAT).format("ddd, MMM Do");
    const weekDay = moment(start, DATE_FORMAT).format("ddd").toUpperCase();
    const dayOfWeek = moment(start, DATE_FORMAT).format("DD");


    return (
        <Fragment>
            <ListItem component="div">

                <div>
                    {/*Day of week right next to card*/}
                    <div className="condensedevent__container-date">
                        <span className="condensedevent_container-date-dayOfweek">{weekDay}</span>
                        <br/>
                        <span>{dayOfWeek}</span>
                    </div>

                    <Card className={`card`}>
                        {/*Title of the event*/}
                        <CardHeader
                            title={title}
                            style={{textAlign: "center", color: "black"}}
                        />
                        <Divider component="div"/>

                        <CardContent>
                            {/*Day interval of event */}
                            <Box>
                                <Grid
                                    component="div"
                                    color="primary-light"
                                    container
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    alignContent={"flex-start"}>
                                    <Grid item component="div">
                                        <CalendarTodayIcon className="red"/>
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

                            {/*Time Zone or event*/}
                            <Box color="text.disabled">
                                <Grid
                                    component="div"
                                    container
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}>
                                    <Grid item component="div">
                                        <PublicIcon/>
                                    </Grid>
                                    <Grid item component="div">
                                        <Typography gutterBottom component="div">
                                            {longFormattedTimeZone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>


                            {/* Members of the event*/}
                            <Box color="text.secondary" className="condensedevent__container-namesEmails">
                                <Grid
                                    direction="row"
                                    container>
                                    <Grid item>
                                        <GroupIcon style={{color: '#424242'}}/>
                                    </Grid>
                                    <Grid item>
                                        <Box mx="auto" p={1} className="condensedevent__container-namesEmails-chips">
                                            {Object.keys(payload.users)
                                                .map((email) =>
                                                    <UserChips key={email}
                                                               email={email}
                                                               picture={payload.users[email].picture}
                                                               name={payload.users[email].name}/>)}
                                        </Box>

                                        <Box className="condensedevent_container-namesEmails-dropDown">
                                                <IconButton
                                                    onClick={handleClickOpen}>
                                                    {open ?
                                                        <ArrowDropUpIcon />
                                                        :
                                                        <ArrowDropDownIcon />
                                                    }
                                                </IconButton>
                                                <SimpleDialog open={open} onClose={handleClose}
                                                              users={payload.users}/>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>


                            {/*Description or event*/}
                            <Box>
                                <Box color="text.secondary">
                                    <Grid container direction="row">
                                        <Grid item component="div">
                                            <SubjectIcon/>
                                        </Grid>
                                        <Grid item component="div">
                                            <Box className="condensedevent__container-description">
                                                <Typography variant="body2"
                                                            component="p"
                                                            noWrap={false} gutterBottom>
                                                    {description}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/*Link to the event calendar*/}
                                    <ThemeProvider theme={purpleTheme}>
                                        <Box className="condensedevent__container-navigate">
                                            <Link to={`/events/${roomId}`}>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined">
                                                    GO TO EVENT
                                                </Button>
                                            </Link>
                                        </Box>
                                    </ThemeProvider>
                            </Box>
                        </CardContent>
                    </Card>
                </div>
            </ListItem>
        </Fragment>
    )
};


export default CondensedEvent;