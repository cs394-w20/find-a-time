import React from "react"
import classnames from "classnames"
import "./Button.css"

const Button = ({ onClick, isLoading, title, type, className, ...rest }) => {
  return (
    <button
      onClick={onClick}
      className={classnames("a-button", {
        [`a-button-${type}`]: type,
        [className]: className,
        "a-button-loading": isLoading
      })}
      {...rest}
    >
      {title}
    </button>
  )
}

Button.defaultProps = {
  onClick: () => {},
  type: "primary",
  title: "I am a Button"
}

export default Button
