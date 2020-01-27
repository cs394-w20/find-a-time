import React from "react"
import classnames from "classnames"
import "./Button.css"

const Button = ({
  onClick,
  children,
  isLoading,
  title,
  type,
  className,
  size,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      className={classnames("a-button", {
        [`a-button-${type}`]: type,
        [`a-button-size--${size}`]: size,
        [className]: className,
        "a-button-loading": isLoading
      })}
      {...rest}
    >
      {children ? children : title}
    </button>
  )
}

Button.defaultProps = {
  onClick: () => {},
  type: "primary",
  size: "m",
  title: "I am a Button"
}

export default Button
