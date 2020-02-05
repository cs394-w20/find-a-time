import React from "react"
import QRCode from "qrcode.react"
import {getRoomIdFromPath} from "../Utility";
import {HOST_NAME} from "../../constants";

const EventPageQRCode = () =>{
    const url = new URL("events/"+getRoomIdFromPath(),HOST_NAME);

    console.log(url.href);

    return (
        <div >
            <div>Or Scan this QR code</div>
            <QRCode value={url.href} />
        </div>
    );
};

export default EventPageQRCode;