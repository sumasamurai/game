import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./MainWrapper.module.css";
import Result from "./Result";
import GameOver from "./GameOver";
import Field from "./Field";
import { randomFromArray, randomInteger } from "./utils";
import Button from "@material-ui/core/Button";
import Tutorial from "./Tutorial";
import SessionStatus from "./SessionStatus";

// Timer "fps"
const timerUpdatingPeriod = 70;
const startTimeBallance = 60;
let timerInterval = null;

export default function MainWrapper() {
    const [results, setResults] = useState(
        JSON.parse(JSON.stringify(localStorage))
    );
    const getSeconds = (end) => (end - Date.now()) / 1000;
    const startingTimeLeft = startTimeBallance * 1000;
    const [isStarted, setIsStarted] = useState(false);
    const [points, setPoints] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [countBot, setCountBot] = useState(0);
    const countRef = useRef(countBot);
    const [endTime, setEndTime] = useState(Date.now() + startingTimeLeft);
    const [seconds, setSeconds] = useState(getSeconds(endTime));
    const [pausedTimeBallance, setPausedTimeBallance] = useState(0);
   
    let botTimer;

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
        countRef.current = 0;

        setTimeout(() => {
            setSeconds(startTimeBallance);
            clearTimeout(botTimer);
            setResults(JSON.parse(JSON.stringify(localStorage)));
            setCountBot(0);
            setPoints(0);
            setPausedTimeBallance(0);
            setEndTime(Date.now() + startingTimeLeft);
            setGameOver(false);
            setIsStarted(true);
        }, 50);
    };

    const onBot = () => {
        setCountBot(countBot + 1);
        countRef.current = countBot + 1;
        bot();
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
        const items = [...document.getElementsByClassName("field_item")];

        if (items.length && countRef.current > 0) {
            const good = items.filter((f) => f.innerHTML !== "-1");
            const selected = randomFromArray(good.length ? good : items);
            selected.click();
            botTimer = setTimeout(bot, randomInteger(1, 600));
        }
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.buttons}>
                    <Button
                        className={styles.button_white}
                        variant="outlined"
                        onClick={onStart}
                    >
                        New Game
                    </Button>

                    {!isStarted && (
                        <Button
                            className={styles.button_white}
                            variant="outlined"
                            onClick={onStart}
                        >
                            Start
                        </Button>
                    )}
                    {isStarted && (
                        <Button
                            className={styles.button_green}
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
                            onClick={onBot}
                        >
                            bot
                            <span className="count-bot"> ({countBot})</span>
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            className={styles.button_disabled}
                            disabled
                        >
                            bot(0)
                        </Button>
                    )}
                </div>
                <Tutorial />
                <SessionStatus points={points} seconds={seconds} />
            </header>
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
