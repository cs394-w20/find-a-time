import React, { useEffect, useState, useContext } from "react"
import moment from "moment"
import { TextField, Button } from "@material-ui/core"
import db from "components/Db/firebaseConnect"
import { UserContext } from "context/UserContext"
import { QueryBuilder, endpoints, methods } from "api"
import GroupDialog from "./GroupDialog"
import "./create.scss"
import normalEmailToFirebaseEmail from "components/Utility/normalEmailToFirebaseEmail"
import {addRoomToUser} from "../../components/Db/AddUserToRoom";

const MAX_DESC_CHARS = 140
const MAX_TITLE_CHARS = 40

const date_types = {
  START: "start",
  END: "end"
}

const time_types = {
  START: "start_time",
  END: "end_time"
}

const Create = ({ history }) => {
  const { user } = useContext(UserContext)
  const today = moment()
  const todayFormatted = moment().format("YYYY-MM-DD")
  const nextWeekFormatted = moment()
    .add(7, "days")
    .format("YYYY-MM-DD")

  /*
  componentDidMount
  */
  useEffect(() => {
    const email = normalEmailToFirebaseEmail(user.email)
    const setIdEventFields = () => {
      setEventFields({
        ...eventFields,
        meta_data: {
          ...eventFields.meta_data,
          room_owner: email,
          room_owner_id: user.id
        }
      })
    }
    setIdEventFields()
  }, [])

  const [eventFields, setEventFields] = useState({
    time_interval: {
      start: todayFormatted,
      end: nextWeekFormatted
    },
    times: {
      start_time: "09:00",
      end_time: "18:00"
    },
    meta_data: {}
  })

  const [dateHasError, setDateHasError] = useState(false)
  const [showDialog, setShowDialog] = useState({
    shouldOpen: false,
    roomId: ""
  })

  const [descChars, setDescChars] = useState(0)
  const [titleChars, setTitleChars] = useState(0)

  const handleDateChange = (e, start_or_end) => {
    const value = moment(e.target.value)
    if (value.isBefore(today) && start_or_end === date_types.START) {
      setDateHasError(true)
      return
    }

    if (dateHasError) {
      setDateHasError(false)
    }

    setEventFields({
      ...eventFields,
      time_interval: {
        ...eventFields.time_interval,
        [start_or_end]: e.target.value
      }
    })
  }

  const handleTimeChange = (e, time) => {
    setEventFields({
      ...eventFields,
      times: {
        ...eventFields.times,
        [time]: e.target.value
      }
    })
  }

  const handleDescriptionChange = e => {
    setEventFields({
      ...eventFields,
      meta_data: {
        ...eventFields.meta_data,
        description: e.target.value
      }
    });

    setDescChars(e.target.value.length);
  }

  const handleTitleChange = e => {
    setEventFields({
      ...eventFields,
      meta_data: {
        ...eventFields.meta_data,
        title: e.target.value
      }
    });

    setTitleChars(e.target.value.length);
  }

  const handleSubmit = async () => {
    let start = moment(eventFields.times.start_time, "HH:mm")
    let times = [];
    let end = moment(eventFields.times.end_time, "HH:mm")

    while (start.isBefore(end)) {
      times.push(start.format("HH:mm"))
      start.add(30, "m")
    }

    console.log('TIMES', times);

    let start_date = moment(eventFields.time_interval.start)
    let dates = [start_date.clone().format("YYYY-MM-DD")]
    let end_date = moment(eventFields.time_interval.end)
    while (!start_date.isSame(end_date)) {
      start_date.add(1, "d")
      dates.push(start_date.format("YYYY-MM-DD"))
    }
    dates.push(end_date.format("YYYY-MM-DD"))
    const dbRef = db.ref("/rooms")
    const newRoom = dbRef.push()

    const timesReduced = times.reduce((o, key) => ({ ...o, [key]: false }), {})

    const allTimes = dates.reduce((acc, curr) => {
      acc[curr] = timesReduced
      return acc
    }, {})

    const email = normalEmailToFirebaseEmail(user.email)
    const params = {
      meta_data: eventFields.meta_data,
      time_interval: eventFields.time_interval,
      hour_interval: eventFields.times,
      data: allTimes,
      users: {
        [email]: {
          picture: user.picture,
          name: user.name,
          id: user.id
        }
      }
    }
    const q = new QueryBuilder()
      .setEndpoint(endpoints.NEW_ROOM)
      .setId(newRoom.key)
      .setMethod(methods.POST)
      .setParams(params)

    await q.runQuery()
    // await db.ref("/rooms/" + newRoom.key).set()

    // add room to a users room
    await addRoomToUser({email:email, roomId:newRoom.key});

    history.push(`/events/${newRoom.key}`)
  }

  return (
    <div className="create-event__container">
      <h1>Create an event</h1>
      <div className="create-event__event-container">
        <TextField
          type="text"
          fullWidth
          variant="outlined"
          label="Event Title"
          onChange={handleTitleChange}
          style={{ margin: 8 }}
          inputProps={{maxLength: MAX_TITLE_CHARS}}
          helperText={(MAX_TITLE_CHARS - titleChars) + " characters left"}
        />
        <TextField
          type="text"
          variant="outlined"
          fullWidth
          label="Event Description"
          onChange={handleDescriptionChange}
          style={{ margin: 8 }}
          inputProps={{ maxLength: MAX_DESC_CHARS }}
          helperText={(MAX_DESC_CHARS - descChars) + " characters left"}
        />
      </div>

      <div className="create-event__group-container">
        <h3 className="create-event__group-title">
          What days could the event be?
        </h3>
        <TextField
          defaultValue={todayFormatted}
          error={dateHasError}
          fullWidth
          helperText={dateHasError && "Date can't be before today!"}
          style={{ margin: 8 }}
          id="startDate"
          margin="dense"
          type="date"
          variant="outlined"
          label="Start Date"
          onChange={e => handleDateChange(e, date_types.START)}
        />
        <TextField
          id="endDate"
          margin="dense"
          type="date"
          style={{ margin: 8 }}
          label="End Date"
          variant="outlined"
          defaultValue={nextWeekFormatted}
          fullWidth
          onChange={e => handleDateChange(e, date_types.END)}
        />
      </div>
      <div className="create-event__group-container">
        <h3 className="create-event__group-title">
          What time could the event be between?
        </h3>
        <TextField
          id="startTime"
          type="time"
          variant="outlined"
          fullWidth
          style={{ margin: 8 }}
          defaultValue="09:00"
          label="Start Time"
          onChange={e => handleTimeChange(e, time_types.START)}
        />
        <TextField
          id="endTime"
          fullWidth
          style={{ margin: 8 }}c
          type="time"
          variant="outlined"
          defaultValue="18:00"
          label="End Time"
          onChange={e => handleTimeChange(e, time_types.END)}
        />
      </div>
      <Button onClick={handleSubmit}>Create Event</Button>
      {showDialog.shouldOpen && <GroupDialog roomId={showDialog.roomId} />}
    </div>
  )
}

export default Create
