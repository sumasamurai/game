import React from "react";
import styles from "./Result.module.css";

export default function Result({ results }) {
   
    return (
        <section className={styles.result}>
            <h3 className={styles.title}>Result Table</h3>
            <ul className={styles.list}>
            {Object.entries(results).map((item, index) => {
                let key = item[0];
                let value = item[1];
                return (
                    <li key={index}>
                        <span>{key}</span>
                        <span>{value}</span>
                    </li>
                );
            })}
            </ul>
        </section>
    );
}
