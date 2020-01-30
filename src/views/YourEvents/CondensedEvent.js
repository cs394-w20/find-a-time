import ListItem from "@material-ui/core/ListItem";
import React, {Fragment} from "react";
import Grid from '@material-ui/core/Grid';
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import PublicIcon from "@material-ui/icons/Public"
import SubjectIcon from '@material-ui/icons/Subject';
import moment from "moment-timezone";
import {DATE_FORMAT} from "../../constants";
import jstz from "jstz";
import {Link} from "react-router-dom"
import CardActionArea from "@material-ui/core/CardActionArea";

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

let timeZone = jstz.determine().name();
let longFormattedTimeZone = moment().tz(timeZone).format('zz');

/*  style sheet */
const useStyles = makeStyles(theme => ({
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex'
    },
    title: {
        textAlign: "center"
    }
}));


const CondensedEvent = ({payload}) => {

    let start = payload.time_interval.start;
    let end = payload.time_interval.end;
    let title = payload.meta_data.title;
    let description = payload.meta_data.description;


    const classes = useStyles();
    const startDay = moment(start, DATE_FORMAT).format("ddd, MMM DD");
    const endDay = moment(end, DATE_FORMAT).format("ddd, MMM DD");
    const weekDay = moment(start, DATE_FORMAT).format("ddd").toUpperCase();
    const dayOfWeek = moment(start, DATE_FORMAT).format("DD");

    const roomId = 1;

    return (
        <Fragment>
            <ListItem component="div">

                <div>

                    <div className="eventpage__container-date">
                        <span className="eventpage_container-date-dayOfweek">{weekDay}</span>
                        <br/>
                        <span>{dayOfWeek}</span>
                    </div>

                    <Link to={`/events/${roomId}`}>
                        <Card className="card">
                            <CardActionArea>
                                <CardHeader
                                    title={title}
                                    style={{textAlign: "center"}}
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
                                                <PublicIcon/>
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
                                                <SubjectIcon/>
                                            </Grid>
                                            <Grid item component="div">
                                                <Typography variant="body2" className={classes.wrapIcon}
                                                            component="p"
                                                            noWrap={false} gutterBottom>
                                                    {description}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>


                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Link>
                </div>


            </ListItem>
        </Fragment>
    )
};


export default CondensedEvent;