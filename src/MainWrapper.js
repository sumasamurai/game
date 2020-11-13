import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Item from "./Item";
import Points from "./Points";
import Timer from "./Timer";

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

    function bot() {
        var items = [...document.getElementsByClassName("item")];
        console.log("bot", { items });
        if (items.length) {
            const good = items.filter((f) => f.innerHTML !== "-1");
            const selected = randomFromArray(good.length ? good : items);
            selected.click();
            setTimeout(bot, randomInteger(1, 600));
        }
    }

    return (
        <div className={classes.root}>
            <header>
                <div className="button-group">
                    <Button
                        className="button-white"
                        variant="outlined"
                        onClick={onStart}
                    >
                        Start
                    </Button>
                    <Button
                        className="button-green"
                        variant="outlined"
                        onClick={onStart}
                    >
                        New Game
                    </Button>{" "}

                    {isStarted &&
                     <Button variant="outlined" color="secondary" onClick={bot}>
                     (bot)
                 </Button>
                    }
                     {!isStarted &&
                     <Button variant="outlined" disabled>
                     (bot)
                 </Button>
                    }
                    
                   
                </div>

                <div className="information">
                    <Points points={points} />
                    <h3>
                        Time left:{" "}
                        <span className="timer-count">
                            <Timer>{isStarted ? seconds : "-"}</Timer>
                        </span>
                    </h3>
                </div>
            </header>

           
            <Field isStarted={isStarted} itemClick={itemClick} />
            <footer></footer>
        </div>
    );
}

const itemColors = ["#9446ED", "#fff", "#92FDF2"];
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
        time: randomInteger(0, 10) < 3 ? randomInteger(-1, 1) : 0,
        weight: randomInteger(1, 2),
        style: {
            ...size,
            ...position,
            background: randomFromArray(itemColors),
            position: "absolute",
        },
        handler: () => {},
    };

    if (item.time) {
        item.style.background = "#ffaa0f";
        item.style.boxShadow =
            "0 0 3px #ffa500, 0 0 8px #ffa500, 0 0 10px #ffa500, 0 0 20px #ffa500, 0 0 30px #ff0000, 0 0 5px #ff8d00, 0 0 50px #ff0000";
    }

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
            }}
        >
            <img src="./screen.png" className="screen-pc" alt="" />
            <img src="./screen-mobile.png" className="screen-mobile" alt="" />
            {props.isStarted &&
                items.map((item) => (
                    <Item key={item.id} item={item} handleClick={onItemClick} />
                ))}
        </div>
    );
}
