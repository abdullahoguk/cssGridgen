var gridData = {
    numOfRows:4,
    numOfColumns:6,
    gridGap:".3em"
}



const gridContainer = document.querySelector(".gridContainer");
const gridWireframe = gridContainer.querySelector(".gridWireframe");
const rowInput = document.querySelector("input#row");
const columnInput = document.querySelector("input#column");

createGrid(gridData.numOfRows, gridData.numOfColumns );

rowInput.addEventListener("change", addRowCol);
columnInput.addEventListener("change", addRowCol);

var eventState = "none";//none selectStart selectEnd 
var firstSelectedCell="";
var lastSelectedCell="";

function createGrid(row,col){
    for(let i=0;i<row;i++){
        for(let j=0;j<col;j++){
            let cell = document.createElement("div");
            let cellNo = i*row+j+1;
            cell.className = "cell empty";
            cell.style.gridArea=`${i+1}\/${j+1}\/${i+2}\/${j+2}`;
            cell.dataset.no=cellNo;
            cell.dataset.row=i+1;
            cell.dataset.column=j+1;
            cell.innerHTML=`<span>${cellNo}</span>`;

            gridWireframe.appendChild(cell);
            cell.addEventListener("click",selectCell);
            cell.addEventListener("mouseover",cellHover)

        }     
    }
    gridWireframe.style.width="100%";
    gridWireframe.style.height="100%";
    gridWireframe.style.gridGap=gridData.gridGap;
    gridWireframe.style.gridTempalateRows = `repeat(${row},1fr)`;
    gridWireframe.style.gridTempalateColumns = `repeat(${col},1fr)`;
    rowInput.value=gridData.numOfRows;
    columnInput.value=gridData.numOfColumns;
}

function addRowCol(e){
    if(e.target.name == "row"){
        gridData.numOfRows = e.target.value;
    }

    else if(e.target.name == "column"){
        gridData.numOfColumns = e.target.value;
    }

    else{
        console.error("Error when adding row o column")
    }
    
    gridWireframe.innerHTML="";
    createGrid(gridData.numOfRows, gridData.numOfColumns );
}

function selectCell(e){
    if(eventState=="none"){
        calculateSelection();
        e.target.classList.add("selected");
        e.target.classList.add("firstCell");
        
        eventState="selectStart";
        firstSelectedCell=e.target;
    }

    else if(eventState=="selectStart" && !(e.target == firstSelectedCell)){  
        eventState="selectEnd";
        e.target.classList.add("lastCell");
        lastSelectedCell = e.target;
        let [firstRow,firstColumn] = [firstSelectedCell.dataset.row, firstSelectedCell.dataset.column];
        let [lastRow, lastColumn] = [lastSelectedCell.dataset.row, lastSelectedCell.dataset.column];
        calculateSelection(firstRow,firstColumn,lastRow,lastColumn);
        eventState="none";
        firstSelectedCell="";
        lastSelectedCell="";
    }

    // cancel selection when clicked on first selected cell
    else if(eventState=="selectStart"&&e.target == firstSelectedCell){
        if(e.target.classList.contains("firstCell")){
            eventState="none";
            e.target.classList.remove("selected");
            e.target.classList.remove("firstCell");
            e.target.classList.remove("selectable");
        }
    }
}

function cellHover(e){
    if(eventState=="selectStart"&&e.target.classList.contains("cell")){
        let [firstRow,firstColumn] = [firstSelectedCell.dataset.row, firstSelectedCell.dataset.column];
        let [lastRow, lastColumn] = [e.target.dataset.row, e.target.dataset.column];
        calculateSelection(firstRow,firstColumn,lastRow,lastColumn);
    }
}

function calculateSelection(startX,startY,endX,endY){
    var [x1, x2] = endX > startX ? [startX,endX]:[endX,startX];
    var [y1, y2] = endY > startY ? [startY,endY]:[endY,startY];
    var cells = [...document.querySelectorAll(".cell")];
    cells.forEach(function(cell){
        let [cX,cY] = [cell.dataset.row, cell.dataset.column];
        let coordinantCond = cX<=x2&&cX>=x1 && cY<=y2&&cY>=y1;
        if(coordinantCond && eventState=="selectStart"){
           cell.classList.add("selectable");
           cell.classList.remove("selected");
        }
        else if(coordinantCond && eventState=="selectEnd"){
            cell.classList.add("selected");
            cell.classList.remove("selectable");
            cell.classList.remove("firstCell");
            cell.classList.remove("lastCell");
        }

        else{
            cell.classList.remove("selectable");
            cell.classList.remove("selected");
        }
    })
}
