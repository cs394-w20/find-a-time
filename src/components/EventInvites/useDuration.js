import React, {useEffect, useState} from "react";
import moment from "moment-timezone";

const useDuration = () => {
    const [duration, setDuration] = useState(30);
    const durations = [30, 45, 60, 90,120];

    useEffect(()=>{
        setDuration(30)
    },[]);

    return {
        duration,
        setDuration,
        durations,
    }
};

export default useDuration;