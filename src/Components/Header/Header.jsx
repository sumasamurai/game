import React from "react";
import Button from "@material-ui/core/Button";
import styles from "./Header.module.css";
import Tutorial from "./Tutorial";
import SessionStatus from "./SessionStatus";

export default function Header(props) {
    const {
        isStarted,
        onStart,
        onPauseClick,
        pausedTimeBallance,
        countBot,
        onBotClick,
        points,
        seconds,
    } = props;

    return (
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
                        onClick={onPauseClick}
                    >
                        {pausedTimeBallance ? "Continue" : "Pause"}
                    </Button>
                )}

                {isStarted || pausedTimeBallance ? (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onBotClick}
                    >
                        bot
                        <span className="count-bot"> ({ countBot })</span>
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
    );
}
