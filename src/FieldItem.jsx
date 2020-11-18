import React from "react";
import "./FieldItem.css";

function FieldItem(props) {
    const { item, handleClick } = props;

    let event = {};
    if ("ontouchstart" in document.documentElement) {
        event = { onTouchStart: () => handleClick(item) };
    } else {
        event = { onMouseDown: () => handleClick(item) };
    }

    return (
        <div
            className="field_item"
            style={item.style}
            {...event}
            onClick={() => {
                handleClick(item);
            }}
        >
            {item.time ? `T${item.time}` : `+${item.weight}`}
        </div>
    );
}

export default FieldItem;
