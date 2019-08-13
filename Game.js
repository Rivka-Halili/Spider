function Game() {

    function setCards() {
        var cards = [];
        for (var i = 0; i < 13; i++)
            for (var j = 0; j < 8; j++) {
                cards.push({ type: (i + 1), num: `${i}:${j}`, isopen: false, draggable: false });
            }
        return cards;
    }

    const randCard = function (aviableCards) {
        var idx = Math.floor(Math.random() * aviableCards.length);
        const card = aviableCards.splice(idx, 1);
        return card[0];
    }
    function createColumns(aviableCards) {
        var columns = [];
        for (var i = 0; i < 6; i++) {
            const columnCards = [];
            for (var j = 0; j < 5; j++) {
                const isLast = j == 4;
                const card = randCard(aviableCards);
                card.isopen = isLast;
                card.draggable = isLast;
                columnCards.push(card);
            }
            columns.push(columnCards)
        }
        for (var i = 0; i < 4; i++) {
            const columnCards = [];
            for (var j = 0; j < 6; j++) {
                const isLast = j == 5;
                const card = randCard(aviableCards);
                card.isopen = isLast;
                card.draggable = isLast; ``
                columnCards.push(card);
            }
            columns.push(columnCards)
        }
        return columns;

    }

    function createPiles(aviableCards) {
        var piles = [];
        for (var i = 0; i < 5; i++) {
            const pileCards = [];
            for (var j = 0; j < 10; j++) {
                const card = randCard(aviableCards);
                card.isopen = true;
                card.draggable = true;
                pileCards.push(card);

            }
            piles.push(pileCards)
        }

        return piles;
    }

    function findFullSeries(column) {
        let countSeries = 0;
        const reverseColumn = [...column].reverse();
        if (reverseColumn.length < 13)
            return false;
        const isSeria = reverseColumn.reduce((isSeria, card, index) => {
            if (index < 13) {
                return isSeria && card.isopen && index + 1 === card.type;
            }
            return isSeria;
        }, true);
        return isSeria;
    }


    const cards = setCards();
    var aviableCards = [...cards];
    const columns = createColumns(aviableCards);
    const piles = createPiles(aviableCards);

    this.findFullSeries = findFullSeries;
    this.columns = columns;
    this.piles = piles;
};







