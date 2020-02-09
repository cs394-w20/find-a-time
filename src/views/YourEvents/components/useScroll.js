import React, {useEffect, useState} from "react";
import moment from "moment-timezone";
import {DATE_FORMAT} from "../../../constants";

// Returns the month given a text date
const getMonth = (date) => {
    return moment(date, DATE_FORMAT).format("MMMM");
};


/**
 * useScroll has a scroll listener that fires off anytime the user scroll,
 * it then compares the y-position of all the elements in the scroll box and then
 * finds the element closest to the top of the scroll box. With this information
 * it gets the month for this element and it returns it. This way the month updates
 * as the user scrolls.
 * @param baseRef - the ref of the scroll box (the thing that contains the scroll objects)
 */
const useScroll = ({baseRef}) => {
    const [cardRefs, setCardRefs] = useState({theRefs: {}});
    const [month, setMonth] = useState();

    /**
     * Adds the ref of a room s.t useScroll can watch the position of the ref in the scroll container
     */
    const addRef = ({ref, roomId, start}) => {
        const _refs = Object.assign({}, cardRefs);
        _refs.theRefs[roomId] = {ref, start};
        setCardRefs(_refs);
    };

    /**
     * Removes a ref that useScroll is watching
     */
    const removeRef = ({roomId}) => {
        const _refs = Object.assign({}, cardRefs);
        delete _refs.theRefs[roomId];
        setCardRefs(_refs)
    };

    useEffect(() => {
        if (Object.keys(cardRefs.theRefs).length !== 0) {
            updateMonth();
        } else {
            setMonth('');
        }
    }, [cardRefs]);

    /**
     * This is the main method for useScroll it compares all the children elements
     * position in the scrollbox and updates the month to correspond to the children
     * closest to the top of the scrollbox
     */
    const updateMonth = () => {

        let obj;
        let yValue;
        let dist;

        const domRefs = cardRefs.theRefs;
        let keys = Object.keys(cardRefs.theRefs);
        let baseRefY = baseRef.current.getBoundingClientRect().y;
        let closest = {roomId:null, dist: Infinity};

        // finds the ref that is at the top of the scrollbox
        for (let i in keys){
            obj = domRefs[keys[i]];
            yValue = obj.ref.current.getBoundingClientRect().y;

            dist = Math.abs(yValue-baseRefY);
            if (dist < closest.dist){
                closest = {roomId: keys[i], dist:dist }
            }
        }

        // sets the currMonth to the month in the ref at the top of the scrollbox
        const roomIdOfClosestEle =closest["roomId"];
        const closestEle = {...domRefs[roomIdOfClosestEle]};

        let currMonth = getMonth(closestEle.start);
        if (month !==currMonth){
            setMonth(currMonth)
        }
    };

    // Sets the onScroll listener to the scroll box
    useEffect(() => {
        baseRef.current.addEventListener('scroll', updateMonth);
        return () => window.removeEventListener('scroll', updateMonth);
    }, [baseRef]);

    return {
        addRef,
        removeRef,
        month
    }
};

export default useScroll;