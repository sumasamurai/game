import React from "react";

function Points({ points }) {
    return (
        <div className="points">
            <h3>
                Points: <span className="points-count">{points}</span>
            </h3>
        </div>
    );
}

export default Points;
