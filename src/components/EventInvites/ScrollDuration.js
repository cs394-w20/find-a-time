import React, {useContext, useEffect, useState, Fragment} from "react"
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import DurationChip from "./DurationChip";
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            borderTop:'solid',
            borderBottom:'solid',
            borderTopWidth: '2px',
            borderBottomWidth: '2px',
            alignItems:'center',
            height: '40px',
            width: '100%',
            paddingTop:'10px',
            marginBottom: '25px',
            paddingRight: '6px',
            borderTopColor: '#EBECF0',
            borderBottomColor: '#EBECF0',

        },
        gridList: {
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        title: {
        },
        titleBar: {
            background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
    }),
);

const ScrollDuration = ({durationState}) => {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <GridList className={classes.gridList} cols={3.5}>
                {durationState.durations.map(duration => (
                    <GridListTile key={duration}
                                  style={{width:'100px',marginRight:'5px'}}>
                        <DurationChip duration={duration} durationState={durationState}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

export default ScrollDuration;