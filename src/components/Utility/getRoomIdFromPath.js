
/**
 * Get roomId from the path
 * @returns {string} the roomId taken from the path
 */
const getRoomIdFromPath = () => {
    return window.location.pathname.split("/")[2]
};

export default getRoomIdFromPath;