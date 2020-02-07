import React, {useEffect, useState} from "react";
import moment from "moment-timezone";
import {DATE_FORMAT} from "../../../constants";

// Returns the month given a text date
const getMonth = (date) =>{
    return moment(date, DATE_FORMAT).format("MMMM");
};


// scroll listener.
const useScroll = ({ baseRef}) =>{
    const [cardRefs, setCardRefs] = useState({});
    const [month, setMonth] = useState();

    const addRef = ({ref, roomId, title,start}) =>{
        cardRefs[roomId]={ref,title,start};
        setCardRefs(cardRefs);
    };

    const removeRef = ({roomId}) =>{
        console.log(roomId)
        delete cardRefs[roomId];
        console.log(cardRefs)
        setCardRefs(cardRefs)

    };


    useEffect(()=>{
        console.log("ffff")
    },[cardRefs]);


    const scrollCallBack = () =>{
        let obj;
        let yValue;
        let dist;

        let keys = Object.keys(cardRefs);
        let baseRefY = baseRef.current.getBoundingClientRect().y;
        let closest = {roomId:null, dist: Infinity};

        // finds the ref that is at the top of the scrollbox
        for (let i in keys){
            obj = cardRefs[keys[i]];
            yValue = obj.ref.current.getBoundingClientRect().y;

            dist = Math.abs(yValue-baseRefY);
            if (dist < closest.dist){
                closest = {roomId: keys[i], dist:dist }
            }
        }

        // sets the currMonth to the month in the ref at the top of the scrollbox
        let currMonth = getMonth(cardRefs[closest["roomId"]].start);
        if (month !==currMonth){
            setMonth(currMonth)
        }

    };

    useEffect(() => {
        baseRef.current.addEventListener('scroll', scrollCallBack);
        return () => window.removeEventListener('scroll', scrollCallBack);
    }, [baseRef]);

    return {
        addRef,
        removeRef,
        month
    }
};

export default useScroll;