import React from "react";
import styles from "./Result.module.css";

export default function Result({ results }) {

    return (
        <section className={styles.result}>
            <h3 className={styles.title}>Result Table</h3>
            <ul className={styles.list}>
                {Object.entries(results).map((row, index) => {
                    const player = row[0];
                    const points = row[1];
                    return (
                        <li key={index}>
                            <span>{player}</span>
                            <span>{points}</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
