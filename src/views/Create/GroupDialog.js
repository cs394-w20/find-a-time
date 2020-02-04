import React, { useEffect, useState, useContext } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core"
import { FileCopy } from "@material-ui/icons"
import { Link } from "react-router-dom"

const GroupDialog = ({ roomId }) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Group Created</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              Room ID: {roomId}
              <Button>
                <FileCopy />
              </Button>
              <Button>
                <Link to={`/events/${roomId}`}>Go to Group</Link>
              </Button>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GroupDialog
