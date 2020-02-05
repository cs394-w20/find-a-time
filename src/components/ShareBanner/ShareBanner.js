import React, { useState, useRef } from "react"
import GroupAddIcon from "@material-ui/icons/GroupAdd"
import copy from "copy-to-clipboard"
import "./ShareBanner.scss"

const ShareBanner = () => {
  const [isCopied, setIsCopied] = useState(false)
  const copyContainer = useRef(null)
  const url = window.location.href

  const handleCopyLink = () => {
    setIsCopied(true)
    copy(url)
  }
  return (
    <div className="share-banner__container" ref={copyContainer}>
      <GroupAddIcon className="share-banner__icon" />
      <div className="share-banner__text">
        Share this link to invite people!
      </div>
      {isCopied ? (
        <div className="share-banner__button share-banner__button--copied">
          Copied!
        </div>
      ) : (
        <button className="share-banner__button" onClick={handleCopyLink}>
          Copy Link
        </button>
      )}
    </div>
  )
}

export default ShareBanner
