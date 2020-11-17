import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import randomInteger from "./randomInteger";
import Instruction from "./Instruction";
import Result from "./Result";
import GameOver from "./GameOver";
import Points from "./Points";
import Timer from "./Timer";
import Field from "./Field";
import randomFromArray from './randomFromArray';
import styles from './MainWrapper.module.css';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gridGap: "35px",
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
        "& > *": {
            margin: theme.spacing(1),
        },
       
    },
}));

// Timer "fps"
const timerUpdatingPeriod = 70;
const startTimeBallance = 5;
let timerInterval = null;

export default function MainWrapper() {
    const classes = useStyles();
    const [results, setResults] = useState(
        JSON.parse(JSON.stringify(localStorage))
    );
    const getSeconds = (end) => (end - Date.now()) / 1000;
    const startingTimeLeft = startTimeBallance * 1000;
    const [isStarted, setIsStarted] = useState(false);
    const [points, setPoints] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [countBot, setCountBot] = useState(0);
    const [endTime, setEndTime] = useState(Date.now() + startingTimeLeft);
    const [seconds, setSeconds] = useState(getSeconds(endTime));

    const [pausedTimeBallance, setPausedTimeBallance] = useState(0);

    const itemClick = useCallback(
        (item) => {
            if (item.time) {
                setEndTime(endTime + item.time * 10000);
            } else {
                setPoints(points + item.weight);
            }
        },
        [points, endTime]
    );

    useEffect(() => {
        if (!timerInterval && isStarted) {
            timerInterval = setInterval(() => {
                const timeLeft = pausedTimeBallance || getSeconds(endTime);
                if (timeLeft > 0) {
                    setSeconds(() => timeLeft);
                } else {
                    setSeconds(0);
                    clearInterval(timerInterval);
                    setGameOver(true);
                }
            }, timerUpdatingPeriod);
            return () => {
                clearInterval(timerInterval);
                timerInterval = null;
            };
        }
    }, [endTime, isStarted, pausedTimeBallance]);

    const onStart = (e) => {
        setSeconds(startTimeBallance);
        setTimeout(() => {
            setResults(JSON.parse(JSON.stringify(localStorage)));
            setCountBot(0);
            setPoints(0);
            setPausedTimeBallance(0);
            setEndTime(Date.now() + startingTimeLeft);
            setGameOver(false);
            setIsStarted(true);
        }, 50);
    };

    const toggleGameOver = useCallback(() => {
        setGameOver((state) => !state);
    }, []);

    const onPause = (e) => {
        if (pausedTimeBallance) {
            setPausedTimeBallance(0);
            setSeconds(pausedTimeBallance);
        } else {
            const timeLeft = getSeconds(endTime);

            setSeconds(timeLeft);
            setPausedTimeBallance(timeLeft);
        }
    };

    function bot() {
        const items = [...document.getElementsByClassName("item")];

        if (items.length) {
            const good = items.filter((f) => f.innerHTML !== "-1");
            const selected = randomFromArray(good.length ? good : items);
            selected.click();
            setTimeout(bot, randomInteger(1, 600));
        }
    }

    return (
        <div className={classes.root}>
            <header>
                <div className="button-group">
                    <Button
                        className="button-white"
                        variant="outlined"
                        onClick={onStart}
                    >
                        New Game
                    </Button>

                    {!isStarted && (
                        <Button
                            className="button-white"
                            variant="outlined"
                            onClick={onStart}
                        >
                            Start
                        </Button>
                    )}
                    {isStarted && (
                        <Button
                            className="button-green"
                            variant="outlined"
                            onClick={onPause}
                        >
                            {pausedTimeBallance ? "Continue" : "Pause"}
                        </Button>
                    )}

                    {isStarted || pausedTimeBallance ? (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                bot();
                                setCountBot(countBot + 1);
                            }}
                        >
                            bot
                            <span className="count-bot"> ({countBot})</span>
                        </Button>
                    ) : (
                        <Button variant="outlined" disabled>
                            bot(0)
                        </Button>
                    )}
                </div>
                <div className="information">
                    <Points points={points} />
                    <h3>
                        Time left:{" "}
                        <span className="timer-count">
                            <Timer>{seconds ?? "-"}</Timer>
                        </span>
                    </h3>
                </div>
            </header>

            <Instruction />
            <section className={styles.game}>
                <Field
                    isStarted={isStarted}
                    itemClick={itemClick}
                    isPaused={pausedTimeBallance}
                    points={points}
                    gameOver={gameOver}
                    onStart={onStart}
                    onItemClick={toggleGameOver}
                />
                {gameOver && (
                    <GameOver
                        points={points}
                        onItemClick={toggleGameOver}
                        onStart={onStart}
                    />
                )}
            </section>
            <Result results={results} />
        </div>
    );
}
