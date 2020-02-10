import React, { useState, useContext,useEffect } from "react"
import Calendar from 'react-calendar'
import moment from "moment"
import {DATE_FORMAT} from "../../constants";
import { makeStyles } from "@material-ui/core/styles"
import './MonthDayNavitgator.scss'



const MonthDayNavigator = ({time_interval, dateClickCallBack})=>{
    const [endTime,setEndTime ] = useState(null);
    const [startTime,setStartTime ] = useState(null);
    const [hasTime,setHasTime ] = useState(false);
    const [activeStartDate, setActiveStartDate] = useState(null);


    useEffect(()=>{
        if (time_interval!==undefined){
            let start = moment(time_interval.start, DATE_FORMAT).toDate();
            let end = moment(time_interval.end, DATE_FORMAT).toDate();

            setHasTime(true);
            setStartTime(start);
            setEndTime(end);
            setActiveStartDate(start)

        }else{
            setHasTime(false);
        }
    },[time_interval]);


    const onDateClick=(value,event) =>{
        setActiveStartDate(value);
        dateClickCallBack(moment(value).format(DATE_FORMAT));
    };


    return (
        <div >
            {hasTime?
            <Calendar
                calendarType="US"
                maxDetail="month"
                minDetail="month"
                defaultView = "month"
                maxDate={endTime}
                minDate={startTime}
                activeStartDate={activeStartDate}
                onChange={onDateClick}
                value={startTime}
            />
            :
            <Calendar
                calendarType="US"
                maxDetail="month"
                minDetail="month"
                defaultView = "month"
                tileDisabled={({activeStartDate, date, view }) =>true}
            />
            }
        </div>
        )
};




export default MonthDayNavigator;