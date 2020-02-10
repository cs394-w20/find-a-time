import React, { useState, useContext,useEffect } from "react"
import Calendar from 'react-calendar'
import moment from "moment"
import {DATE_FORMAT} from "../../constants";
import { makeStyles } from "@material-ui/core/styles"
import './MonthDayNavigator.scss'



const MonthDayNavigator = ({time_interval, dateClickCallBack})=>{
    const [endTime,setEndTime ] = useState(null);
    const [startTime,setStartTime ] = useState(null);
    const [hasTime,setHasTime ] = useState(false);
    const [activeDate, setActiveDate] = useState(null);


    useEffect(()=>{
        if (time_interval!==undefined){
            const start = moment(time_interval.start, DATE_FORMAT).toDate();
            const end = moment(time_interval.end, DATE_FORMAT).toDate();

            setHasTime(true);
            setStartTime(start);
            setEndTime(end);
            setActiveDate(new Date())

        }else{
            setHasTime(false);
        }
    },[time_interval]);


    const onDateClick=(value,event) =>{
        setActiveDate(value);
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
                onChange={onDateClick}
                activeStartDate={activeDate}
                value={activeDate}
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