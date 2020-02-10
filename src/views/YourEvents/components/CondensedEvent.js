import ListItem from "@material-ui/core/ListItem";
import React, {Fragment,useRef,useEffect} from "react";
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
import './CondensedEvent.scss';
import Button from "@material-ui/core/Button";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
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
const CondensedEvent = ({payload, hasDate,scrollState}) => {
    const [open, setOpen] = React.useState(false);
    const ref = useRef();
    const roomId = payload.roomId;
    const start = payload.time_interval.start;
    const end = payload.time_interval.end;
    const title = payload.meta_data.title;
    const description = payload.meta_data.description;
    const startDay = moment(start, DATE_FORMAT).format("ddd, MMM Do");
    const endDay = moment(end, DATE_FORMAT).format("ddd, MMM Do");
    const weekDay = moment(start, DATE_FORMAT).format("ddd").toUpperCase();
    const dayOfWeek = moment(start, DATE_FORMAT).format("DD");

    // add the ref to scrollState so that it can monitor position of this element relative to scroll box
    useEffect(()=>{
        scrollState.addRef({roomId,ref,start});
        },[]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
    };

    // Usually only 3 chips can fit
    const getFirstThreeChips = ({payload}) =>{
        let chips = [];
        let emailList = Object.keys(payload.users);
        let i = 0;
        let email;

        for (i; i< emailList.length && i<3; i++){
            email = emailList[i];
            chips.push(<UserChips key={email}
                                          email={email}
                                          picture={payload.users[email].picture}
                                          name={payload.users[email].name}/>
                                          );
        }


        return chips;
    };


    return (
        <div  >
            <ListItem component="div" >

                <div >


                    {/*Day of week right next to card*/}
                    <div className="condensedevent__container-date" >
                        <span className="condensedevent_container-date-dayOfweek">{hasDate?weekDay:''}</span>
                        <br/>
                        <span >{hasDate?dayOfWeek:''}</span>
                    </div>

                    <Card className="condensedevent__card" component='div' ref={ref}>
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
                                        <CalendarTodayIcon className="condensedevent__red"/>
                                    </Grid>
                                    <Grid item component="div"
                                          className="condensedevent__red condensedevent__container-dateInterval">
                                            {startDay} - {endDay}
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
                                    <Grid item component="div" className="condensedevent__timeZone">
                                            {longFormattedTimeZone}
                                    </Grid>
                                </Grid>
                            </Box>


                            {/* Members of the event*/}

                            <Box color="text.secondary"  className={"condensedevent__container-namesEmails"}>
                                <Grid

                                    direction="row"
                                    container>
                                    <Grid item>
                                        <GroupIcon className="condensedevent__card-groupIcon"/>
                                    </Grid>
                                    <Grid item>
                                        <Box mx="auto" p={1} className="condensedevent__container-namesEmails-chips">
                                           {getFirstThreeChips({payload})}
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
        </div>
    )
};

/*
CondensedEvent.propTypes = {
    payload: PropTypes.array.isRequired,
    hasDate: PropTypes.bool.isRequired,
};*/


export default CondensedEvent;