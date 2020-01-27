/**
 * firebase can't store strings that contain "." so we can't store a email as a key as it is.
 *  rather replace all the "." with a "_" then store. This function does the reverse conversion
 */
const firebaseEmailToNormalEmail = (firebaseEmail)=>{
    return firebaseEmail.replace(/_/g, '.');
};

export default firebaseEmailToNormalEmail;