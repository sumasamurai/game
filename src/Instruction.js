import React from 'react'
import styles from './Instruction.module.css'

export default function Instruction() {

    return (
        <div className={styles.instruction}>
            <div className={styles.icon}>!</div>
        <div className={styles.text}>Collect points by tapping squares that appear on the screen. Avoid T-1 squares that decrease the remaining time.</div>
        </div>
    )
}
