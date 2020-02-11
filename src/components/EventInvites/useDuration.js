import React, {useEffect, useState} from "react";
import moment from "moment-timezone";

const useDuration = ({startTime}) => {
    const [duration, setDuration] = useState(30);
    const durations = [30, 45, 60, 90,120];
    const [endTime, setEndTime] = useState(startTime.add('m',duration));

    useEffect(()=>{
        setEndTime(startTime.add('m',duration));
    },[duration]);

    useEffect(()=>{
        setDuration(30)
    },[]);

    return {
        duration,
        setDuration,
        durations,
        endTime
    }
};

export default useDuration;