import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

// Timer "fps"
const timerUpdatingPeriod = 100;
const startTimeBallance = 60;

export default function MainWrapper() {
    const classes = useStyles();

    const getSeconds = (end) => (end - Date.now()) / 1000;
    const startingTimeLeft = startTimeBallance * 1000;

    const [isStarted, setIsStarted] = useState(false);
    const [points, setPoints] = useState(0);
    const [endTime, setEndTime] = useState(Date.now() + startingTimeLeft);
    const [seconds, setSeconds] = useState(getSeconds(endTime));
  
    const itemClick = useCallback(
        (item) => {
            if (item.time) {
                setEndTime(endTime + item.time * 10000);
            } else {
                setPoints(points + item.weight);
            }
        },
        [points, endTime]
    );

    useEffect(() => {
        if (isStarted) {
            const interval = setInterval(() => {
                const timeLeft = getSeconds(endTime);
                if (timeLeft > 0) {
                    setSeconds(() => timeLeft);
                } else {
                    setSeconds(0);
                    clearInterval(interval);
                    alert("You WIN!");
                }
            }, timerUpdatingPeriod);
            return () => clearInterval(interval);
        }
    }, [endTime, isStarted]);

    const onStart = (e) => {
        setSeconds(startTimeBallance);
        setTimeout(() => {
            setIsStarted(true);
        }, 50);
    };

    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={onStart}>
                Старт
            </Button>
            <hr />
            <Points points={points} />
            <Timer>{isStarted ? seconds : "-"}</Timer>
            <Field isStarted={isStarted} itemClick={itemClick} />
        </div>
    );
}

function Points({ points }) {
    return <div>{points}</div>;
}

function Timer(props) {
    return <div>{props.children}</div>;
}

const itemColors = ["rgb(255, 50, 86)", "rgb(115, 33, 98)", "rgb(12, 23, 195)"];

const sizes = [
    { width: 40, height: 40 },
    { width: 60, height: 60 },
    { width: 80, height: 80 },
];

const getRandomPosition = (wrapperWidth, wrapperHeight, width, height) => {
    return {
        left: randomInteger(0, wrapperWidth - width),
        top: randomInteger(0, wrapperHeight - height),
    };
};

const getNewItem = (width, height) => {
    const size = randomFromArray(sizes);
    const position = getRandomPosition(width, height, size.width, size.height);
    const item = {
        id: (Date.now() + Math.random() * 1000).toString(),
        time: randomInteger(0,10) < 3 ? randomInteger(-1, 1) : 0,
        weight: randomInteger(1, 2),
        style: {
            ...size,
            ...position,
            background: randomFromArray(itemColors),
            position: "absolute",
            opacity: randomInteger(40, 900) / 100,
        },
        handler: () => {},
    };

    if (item.time) {
        item.style.background = "#EE0";
    }

    // console.log({item});
    return item;
};

const getNewItems = (max, qty, width, height) => {
    const count = randomInteger(qty > 0 ? 0 : 1, max);
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push(getNewItem(width, height));
    }
    return items;
};

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function randomFromArray(array) {
    return array[randomInteger(0, array.length - 1)];
}

function Field(props) {
    const field = document.getElementById("field");

    let wrapperWidth = document.body.offsetWidth;
    let wrapperHeight = document.body.offsetHeight - 200;
    if (field) {
        wrapperWidth = field.clientWidth;
        wrapperHeight = field.clientHeight;
    }
    console.log({wrapperWidth, wrapperHeight, field });

    const [items, setItems] = useState([]);

    useEffect(() => {
        const field = document.getElementById("field");

    let wrapperWidth = document.body.offsetWidth;
    let wrapperHeight = document.body.offsetHeight - 200;
    if (field) {
        wrapperWidth = field.clientWidth;
        wrapperHeight = field.clientHeight;
    }
    console.log({wrapperWidth, wrapperHeight, field });

        if (!items.length && props.isStarted)
            setTimeout(() => {
                setItems(getNewItems(3, 0, wrapperWidth, wrapperHeight));
            }, 100);
    }, [props.isStarted, items.length]);

    const { itemClick } = props;

    const onItemClick = useCallback(
        (item) => {
            items.splice(items.indexOf(items.find((f) => f.id === item.id)), 1);

            setItems(
                items.concat(
                    getNewItems(2, items.length, wrapperWidth, wrapperHeight)
                )
            );

            itemClick(item);
        },
        [items, itemClick, wrapperWidth, wrapperHeight, setItems]
    );

    return (
        <div
            id="field"
            style={{
                position: "relative",
                backgroundImage: 'url("/space.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <img src="./screen.png"/>
            {props.isStarted &&
                items.map((item) => (
                    <Item key={item.id} item={item} handleClick={onItemClick} />
                ))}
        </div>
    );
}

function Item({ item, handleClick }) {
    let event = {};
    if ('ontouchstart' in document.documentElement) {
        event = { onTouchStart: () => handleClick(item) };
    } else {
        event = { onMouseDown: () => handleClick(item) };
    }

    return (
        <div
            className="item"
            style={item.style}
            { ...event }
        >
            {item.time ? `T${item.time}` : `+${item.weight}`}
        </div>
    );
}

function bot() {
    var items = [...document.getElementsByClassName("item")];

    function randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    function randomFromArray(array) {
        return array[randomInteger(0, array.length - 1)];
    }

    if (items.length) {
        var good = items.filter((f) => f.innerHTML !== "T-1");
        var selected = randomFromArray(good.length ? good : items);

        selected.click();
        setTimeout(bot, randomInteger(1, 600));
    }
}

// bot();
