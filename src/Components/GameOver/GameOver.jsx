import React, { useState } from "react";
import styles from "./GameOver.module.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

export default function GameOver(props) {
    const [name, setName] = useState("");
    const classes = useStyles();

    const onChange = (e) => {
        setName(e.target.value);
    };

    const onSumbit = (e) => {
        e.preventDefault();
        props.onItemClick();
        props.onStart();
        window.localStorage.setItem(name, props.points);
    };

    return (
        <div className={styles.gameover}>
            <h3>Game Over</h3>
            <h4>
                Your points: <span>{props.points}</span>
            </h4>
            <form className={classes.root} onSubmit={onSumbit}>
                <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    onChange={onChange}
                    className={styles.input}
                />
                <input
                    type="submit"
                    value="Save result"
                    required
                    className={styles.submit}
                />
            </form>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));
