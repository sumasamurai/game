import React from "react";
import Points from "./Points";
import Timer from "./Timer";

export default function Information(props) {
    return (
        <div className="information">
            <Points points={props.points} />
            <h3>
                Time left:{" "}
                <span className="timer-count">
                    <Timer>{props.seconds ?? "-"}</Timer>
                </span>
            </h3>
        </div>
    );
}
