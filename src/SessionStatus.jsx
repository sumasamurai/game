import React from "react";
import styles from "./SessionStatus.module.css";

export default function SessionStatus(props) {
    return (
        <div className={styles.session_status}>
            <Points points={props.points} />
            <h3>
                Time left:
                <span className={styles.timer_count}>
                    <Countdown>{props.seconds ?? "-"}</Countdown>
                </span>
            </h3>
        </div>
    );
}

function Points({ points }) {
    return (
        <div className="points">
            <h3>
                Points: <span className={styles.points_count}>{points}</span>
            </h3>
        </div>
    );
}

const Countdown = (props) => {
    return <div>{props.children}</div>;
};
