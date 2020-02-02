import React, { useState, useEffect, useRef } from "react"
import { PropTypes } from "prop-types"
import "./popover.scss"

/*

In order to use this component, you must utilize render props (See -> https://reactjs.org/docs/render-props.html)
(or see an example in NavBar.js)

Import this component then do the following:
    1. You must pass the click handler, handlePopoverClick, to the target
    2. You must create a ref in the parent component for your target component and pass it to this Popover component
        2a. If your target component is a _React_ component, you have to forward the ref like so: 
            const Avatar = React.forwardRef(({ picture, handlePopoverClick }, ref) => {
                return (
                    <div onClick={handlePopoverClick}>
                    <img
                        src={picture}
                        alt="user"
                        className="nav-bar__user-avatar"
                        ref={ref}
                    />
                    </div>
                )
            })
    3. pass whatever you want to be inside the popover into this component as innerComponent

If you need an example, go to Navbar and look at the avatar
*/

const POPOVER_MARGIN = 10

const Popover = props => {
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick)

    return () => document.removeEventListener("mousedown", handleOutsideClick)
  })

  useEffect(() => {
    if (popOverRef.current && props.target.current) {
      const popoverBox = popOverRef.current.getBoundingClientRect()
      const targetBox = props.target.current.getBoundingClientRect()
      const y = props.target.current.y + targetBox.height + POPOVER_MARGIN
      const x = props.target.current.x - popoverBox.width / 2
      setCoords({ x, y })
    }
  }, [props.target])
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ x: null, y: null })

  const popOverRef = useRef()

  const handleOutsideClick = e => {
    if (
      popOverRef.current &&
      !popOverRef.current.contains(e.target) &&
      props.target.current &&
      !props.target.current.contains(e.target) &&
      isOpen
    ) {
      setIsOpen(false)
    }
  }

  const handlePopoverClick = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }
  return (
    <div className="popover__wrapper">
      {props.children({ handlePopoverClick })}
      <div
        ref={popOverRef}
        className="popover__container"
        style={{
          top: coords.y,
          left: coords.x,
          visibility: isOpen ? "visible" : "hidden"
        }}
      >
        {props.innerComponent}
      </div>
    </div>
  )
}

Popover.propTypes = {
  target: PropTypes.object,
  innerComponent: PropTypes.element
}

export default Popover
