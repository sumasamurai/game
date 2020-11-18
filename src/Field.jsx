import React, { useState, useEffect, useCallback } from "react";
import FieldItem from "./FieldItem";
import styles from "./Field.module.css";
import { getRandomPosition, randomInteger, randomFromArray } from "./utils";

export default function Field(props) {
    const field = document.getElementById("field");
    let wrapperWidth = document.body.offsetWidth;
    let wrapperHeight = document.body.offsetHeight - 200;
    
    if (field) {
        wrapperWidth = field.clientWidth;
        wrapperHeight = field.clientHeight;
    }

    const [items, setItems] = useState([]);

    useEffect(() => {
        const field = document.getElementById("field");

        let wrapperWidth = document.body.offsetWidth;
        let wrapperHeight = document.body.offsetHeight - 200;
        if (field) {
            wrapperWidth = field.clientWidth;
            wrapperHeight = field.clientHeight;
        }

        if (!items.length && props.isStarted) 
            setTimeout(() => {
                setItems(getNewItems(3, 0, wrapperWidth, wrapperHeight));
            }, 100);
    }, [props.isStarted, items.length]);

    const { itemClick } = props;

    const onItemClick = useCallback(
        (item) => {
            if (props.isPaused) return;

            items.splice(items.indexOf(items.find((f) => f.id === item.id)), 1);
            setItems(
                items.concat(
                    getNewItems(2, items.length, wrapperWidth, wrapperHeight)
                )
            );

            itemClick(item);
        },
        [
            items,
            itemClick,
            wrapperWidth,
            wrapperHeight,
            setItems,
            props.isPaused,
        ]
    );

    return (
        <div
            id="field"
            className={styles.field}
            style={{
                position: "relative",
            }}
        >
            <img src="./screen.png" className={styles.field_pc} alt="" />
            <img src="./screen-mobile.png" className={styles.field_mobile} alt="" />

            {(items ?? []).map((item) => {
                return (
                    <FieldItem key={item.id} item={item} handleClick={onItemClick} />
                );
            })}
        </div>
    );
}

const getNewItems = (max, qty, width, height) => {
    const count = randomInteger(qty > 0 ? 0 : 1, max);
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push(getNewItem(width, height));
    }
    return items;
};

const getNewItem = (width, height) => {
    const itemType = randomFromArray(getProbability(defaultGameItems));

    const position = getRandomPosition(
        width,
        height,
        itemType.style.width,
        itemType.style.height
    );

    const item = {
        id: (Date.now() + Math.random() * 1000).toString(),
        ...itemType,
        style: {
            ...itemType.style,
            ...position,
            position: "absolute",
        },
        handler: () => {},
    };

    return item;
};

const getProbability = (items) => {
    const entity = [];
    items.forEach((item) => {
        for (let i = 0; i < item.probability; i++) {
            entity.push(item);
        }
    });

    return entity;
};

const defaultGameItems = [
    {
        type: "+1",
        probability: 10,
        time: 0,
        weight: 1,
        style: {
            width: 80,
            height: 80,
            background: "#c6e2ff",
            color: "#333",
        },
    },
    {
        type: "+2",
        probability: 8,
        time: 0,
        weight: 2,
        style: {
            width: 60,
            height: 60,
            background: "#c6e2ff",
            color: "#333",
        },
    },
    {
        type: "T+1",
        probability: 3,
        time: 1,
        weight: 0,
        style: {
            width: 40,
            height: 40,
            color: "#333",
            background: "#ffaa0f",
        },
    },
    {
        type: "T-1",
        probability: 4,
        time: -1,
        weight: 0,
        style: {
            width: 60,
            height: 60,
            background: "#ffaa0f",
            color: "#333",
        },
    },
];
