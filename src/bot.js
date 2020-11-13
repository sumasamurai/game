function bot () {
    var items = [ ...document.getElementsByClassName('item') ];

    function randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    function randomFromArray(array) {
        return array[
            randomInteger(0, array.length - 1)
        ];
    }

    if (items.length) {
        var good = items.filter(f => f.innerHTML !== 'T-1');
        var selected = randomFromArray(good.length ? good : items);
        
        selected.click();
        setTimeout(bot, randomInteger(1, 600));
    }
}

bot();