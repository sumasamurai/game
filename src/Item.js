import React from "react";

function Item({ item, handleClick }) {

    let event = {};
    if ("ontouchstart" in document.documentElement) {
        event = { onTouchStart: () => handleClick(item) };
    } else {
        event = { onMouseDown: () => handleClick(item) };
    }

    return (
        <div
            className="item scale-in-center "
            style={item.style}
            {...event}
            onClick={() => { handleClick(item); }}
        >
            {item.time ? `T${item.time}` : `+${item.weight}`}
        </div>
    );
}

export default Item;
