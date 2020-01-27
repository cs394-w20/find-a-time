import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { Button, Dialog, DialogTitle, DialogContent,
         DialogContentText, Container, TextField } from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";

function GroupDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = ()=> {
    setOpen(false);
  };

  return(
    <div>
      <Button onClick={handleClickOpen}>Create Group</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        >
        <DialogTitle>Group Created</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              Room ID: 343 <Button><FileCopy /></Button>
            <Button><Link to="/">Go to Group</Link></Button>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Create() {

  return(
    <div>
      <Container maxWidth="lg">
        <h1>Create a Group</h1>
        <h3>Potential Dates: <TextField
                              id="startDate"
                              type="date"
                              /> to <TextField
                               id="endDate"
                               type="date"
                               /></h3>
        <h3>Potential Times: <TextField
                              id="startTime"
                              type="time"
                              /> to <TextField
                               id="endTime"
                               type="time"
                               /></h3>
        <GroupDialog />
      </Container>
    </div>
  );
}

export default Create;
