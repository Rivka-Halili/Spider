/// <reference path="game.js" />
const game = new Game();
console.log(game);
const { columns, piles } = game;//destruct



const createDomCard = crd => {

    const cardSpan = document.createElement('span');
    if (crd.isopen) {
        //cardSpan.innerText = crd.type
        cardSpan.classList.add("card" + crd.type);
    }

    else {
        cardSpan.classList.add("closed");
    }
    cardSpan.classList.add("card");
    cardSpan.setAttribute("ondragstart", "onDragstart(event)");
    cardSpan.setAttribute("draggable", crd.draggable);
    cardSpan.setAttribute("id", "darg" + crd.num);

    return cardSpan;
}

const createDomColumn = function (clm, clmIndex) {
    const clmDiv = document.createElement('div');
    clmDiv.id = clmIndex;
    clmDiv.className = 'column'
    clmDiv.setAttribute("ondragover", "onDragover(event)");
    clmDiv.setAttribute("ondrop", "onDrop(event)");

    // const lastCard = clm[clm.length - 1];

    clm.forEach(crd => {
        const domCard = createDomCard(crd);

        clmDiv.appendChild(domCard);
    })

    return clmDiv;


};

const createDomPile = function () {
    const pileDiv = document.createElement('div');
    pileDiv.className = 'pile';
    return pileDiv;


};


const drawBoard = function (columns, piles) {
    const columnsDiv = document.getElementById('columns');
    columnsDiv.innerHTML = '';
    columns.forEach((clm, clmIndex) => {
        const cardDom = createDomColumn(clm, clmIndex);
        columnsDiv.appendChild(cardDom);
    });

    const pilesDiv = document.getElementById('piles');
    pilesDiv.innerHTML = '';
    piles.forEach((pile, pileIndex) => {
        const pileDiv = createDomPile();



        pilesDiv.appendChild(pileDiv);
    });
    if (piles.length) {
        pilesDiv.setAttribute("onclick", "divide()");
    }
    else {
        pilesDiv.setAttribute("onclick", "");
    }
    //piles.forEach(createDomColumn);

}

drawBoard(columns, piles);

function onDragover(event) {
    event.preventDefault();
}
function onDragstart(event) {
    event.dataTransfer.setData("draggedElementId", event.target.id);
}

const getCardbyCardDomElement = function (element, columns) {
    const columnDiv = element.parentElement;
    const cardIndex = Array.prototype.indexOf.call(columnDiv.children, element);
    const column = columns[columnDiv.id];
    return column[cardIndex];
}

const enableDrag = function (column) {
    const reverseColumn = [...column].reverse();

    reverseColumn.forEach((card, index) => {

        if (!card.isopen) {
            return;
        }
        if (index == 0) {
            card.draggable = true;
        }
        else {
            const prevCard = reverseColumn[index - 1]
            if (!prevCard.draggable) {
                card.draggable = false;
                return;
            }
            if (prevCard.type + 1 == card.type) {
                card.draggable = true;
            }
            else {
                card.draggable = false;
            }
        }
    })

}

async function onDrop(event) {

    const target = event.target.closest('.column');
    var draggedId = event.dataTransfer.getData("draggedElementId");
    var draggedCard = document.getElementById(draggedId);
    const sourceColumnDiv = draggedCard.parentElement;

    const sourceColumn = columns[sourceColumnDiv.id];
    const sourceCard = getCardbyCardDomElement(draggedCard, columns)

    const isEmptyTargetColumn = !target.lastChild;
    let targetCard;
    if (!isEmptyTargetColumn) {
        targetCard = getCardbyCardDomElement(target.lastChild, columns);
    }


    const sourceCardIndex = Array.prototype.indexOf.call(sourceColumnDiv.children, draggedCard);
    if (isEmptyTargetColumn || sourceCard.type + 1 === targetCard.type) {

        target.appendChild(draggedCard);

        //move card
        const draggedObject = sourceColumn.splice(sourceCardIndex, sourceColumn.length)
        console.log(draggedObject);
        draggedObject.forEach(drg => {
            columns[target.id].push(drg)
        })


        //open last card
        if (sourceColumn.length>0){
        const sourceLastCard = sourceColumn[sourceColumn.length - 1];
        //if (!sourceLastCard.isopen)
        sourceLastCard.isopen = true;
        }
        

        enableDrag(sourceColumn);
        drawBoard(columns, piles);
        if (game.findFullSeries(columns[target.id])) {
            const targetColumn = columns[target.id];
            const card = targetColumn[(targetColumn.length) - 14];
            await remove(targetColumn, target, 13);
            if(card!=undefined)
            card.isopen = true;
            await wait(card);
            card.isopen = true;
            drawBoard(columns, piles);

        }
        drawBoard(columns, piles);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function divide() {
    const columnsDiv = document.getElementById('columns');
    const pile = piles.pop();
    for (var i = 0; i < columns.length; i++) {
        const crd = pile[i];

        // createDomColumn(columns[i],i)
        const crdDom = createDomCard(crd);
        columnsDiv.children[i].appendChild(crdDom);

        columns[i].push(crd);
        enableDrag(columns[i]);
        await sleep(50)
    }

    drawBoard(columns, piles);
    //  enableDrag();
}

function disableDragging() {
    columns.forEach(clm => {
        clm.forEach(crd => {
            crd.draggable = false;
            crd.setAttribute("draggable", false);
        })
    })
}


async function remove(column, columnDom, n) {
    if (n > 0) {
        column.pop();
        drawBoard(columns, piles);
        await sleep(50);
        remove(column, columnDom, n - 1);
    }

}

async function wait(Card) {
    //alert(Card + "1");
    await sleep(700);
    //CardId.isopen = true;
    //alert(Card + "1");
}

