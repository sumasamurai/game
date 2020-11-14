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
const timerUpdatingPeriod = 77;
const startTimeBallance = 20;

export default function MainWrapper() {
    const classes = useStyles();

    const getSeconds = (end) => (end - Date.now()) / 1000;
    const startingTimeLeft = startTimeBallance * 1000;

    const [isStarted, setIsStarted] = useState(false);
    const [points, setPoints] = useState(0);
    const [gameover, setGameover] = useState(false)
    const [countBot, setCountBot] = useState(0)
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
                    setGameover(true)
                   
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
                     <Button variant="outlined" color="secondary" onClick={() => {
                         bot()
                        setCountBot(countBot + 1)
                     }}>
                     bot<span className="count-bot"> ({countBot})</span>
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

function ResultTable(props) {

     
    return (
        <nav id="result-table">
            {/* {
                lists
            } */}
        </nav>
    )
}

const getRandomPosition = (wrapperWidth, wrapperHeight, width, height) => {
    return {
        left: randomInteger(0, wrapperWidth - width),
        top: randomInteger(0, wrapperHeight - height),
    };
};


function GameOver() {
    let date = window.localStorage.getItem("date");
// Initialize the date object as a date object again here
date = new Date(date);
date.setDate(date.getDate() + 7);
    return (
        <aside id="gameover">
            {/* <h3>Gameover</h3> */}
            {/* {date} */}
        </aside>
    )
}

const defaultGameItems = [
    {
        type: '+1',
        probability: 10,
        time: 0,
        weight: 1,
        style: { 
            width: 80, 
            height: 80,
            background: '#fff',
            color: '#333',
        },
    },
    {
        type: '+2',
        probability: 8,
        time: 0,
        weight: 2,
        style: { 
            width: 60, 
            height: 60,
            background: '#faa',
            color: '#333',
            opacity: 0.4,
        },
    },
    {
        type: 'T+1',
        probability: 6,
        time: 1,
        weight: 0,
        style: { 
            width: 40, 
            height: 40,
            background: '#ffe',
            color: '#033',
            boxShadow:
            "0 0 3px #ffa500",
        },
    },
    {
        type: 'T-1',
        probability: 4,
        time: -1,
        weight: 0,
        style: { 
            width: 60,
            height: 60,
            background: '#afa',
            color: '#033',
            boxShadow:
            "0 0 3px #ffa500",
        },
    }
];

const getProbability = (items) => {
    const entity = [];
    items.forEach((item) => {
        for (let i=0; i<item.probability; i++) {
            entity.push(item);
        }
    });

    console.log({ entity });
    return entity;
};

const getNewItem = (width, height) => {
    const itemType = randomFromArray(
        getProbability(
            defaultGameItems
        )
    );

    const position = 
        getRandomPosition(
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
            position: 'absolute',
        },
        handler: () => {},
    };

    console.log(item);
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
                 <GameOver />
        </div>
    );
}
