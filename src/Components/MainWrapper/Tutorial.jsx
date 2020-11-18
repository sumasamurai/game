import React from "react";
import styles from "./Tutorial.module.css";

export default function Tutorial() {
    return (
        <div className={styles.tutorial}>
            <div className={styles.icon}>!</div>
            <div className={styles.text}>
                Collect points by tapping squares that appear on the screen.
                Avoid T-1 squares that decrease the remaining time.
            </div>
        </div>
    );
}
