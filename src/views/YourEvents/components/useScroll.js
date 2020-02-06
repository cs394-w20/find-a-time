import React, {useEffect} from "react";

// scroll listener.
const useScroll = callback =>{
    useEffect(() => {
        window.addEventListener('scroll', callback);
        return () => window.removeEventListener('scroll', callback);
    }, [callback]);
};

export default useScroll;