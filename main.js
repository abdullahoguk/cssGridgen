var gridData = {
    numOfRows:4,
    numOfColumns:6,
    gridGap:".2em",
    rowSize:["1fr","1fr","1fr","1fr"],
    columnSize:["1fr","1fr","1fr","1fr","1fr","1fr"]
}

const gridContainer = document.querySelector(".gridContainer");
const gridWireframe = gridContainer.querySelector(".gridWireframe");
const rowInput = document.querySelector("input#row");
const columnInput = document.querySelector("input#column");

const rowSizeInputsContainer = document.querySelector(".rowSizeInputsContainer");
const columnSizeInputsContainer = document.querySelector(".columnSizeInputsContainer");

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


    gridWireframe.style.gridGap=gridData.gridGap;
    gridWireframe.style.gridTemplateRows = gridData.rowSize.join(" ");
    gridWireframe.style.gridTemplateColumns =  gridData.columnSize.join(" ");
    
    rowInput.value=gridData.numOfRows;
    columnInput.value=gridData.numOfColumns;

    //create row/column size inputs
    //create row inputs
    rowSizeInputsContainer.innerHTML="";
    rowSizeInputsContainer.style.gridTemplateRows=gridData.rowSize.join(" ");

    for(let i=0;i<row;i++){
        input = document.createElement("input");
        input.name=i+1;
        input.value=gridData.rowSize[i];
        input.classList.add("rowSize");
        input.addEventListener("change",changeRowColSize);
        rowSizeInputsContainer.appendChild(input);
    }

    //create column inputs
    columnSizeInputsContainer.innerHTML="";
    columnSizeInputsContainer.style.gridTemplateColumns=gridData.columnSize.join(" ");
    for(let j=0;j<col;j++){
        input = document.createElement("input");
        input.name=j+1;
        input.value=gridData.columnSize[j];
        input.classList.add("columnSize");
        input.addEventListener("change",changeRowColSize);
        columnSizeInputsContainer.appendChild(input);
    }
}

function addRowCol(e){
    let value=Number(e.target.value);
    if(e.target.name == "row"){
        if(value>gridData.numOfRows){
            let extra = value - gridData.numOfRows;
            gridData.rowSize.push(Array(extra).fill("1fr"));
        }
        else{
            gridData.rowSize = gridData.rowSize.slice(0,value);
        }
        gridData.numOfRows = value;
    }

    else if(e.target.name == "column"){
        if(value>gridData.numOfColumns){
            let extra = value - gridData.numOfColumns;
            gridData.columnSize.push(Array(extra).fill("1fr"));        
        }
        else{
            gridData.columnSize = gridData.columnSize.slice(0,value);
        }
        gridData.numOfColumns = value;
    }

    else{
        console.error("Error when adding row or column")
    }
    
    gridWireframe.innerHTML="";
    createGrid(gridData.numOfRows, gridData.numOfColumns );
}

function changeRowColSize(e){
    let key = e.target.classList.contains("rowSize") ? "rowSize": e.target.classList.contains("columnSize") ? "columnSize":"";
    let index = Number(e.target.name);
    gridData[key][index-1]=e.target.value;

    gridWireframe.innerHTML="";
    createGrid(gridData.numOfRows, gridData.numOfColumns);
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
        let [firstRow,firstColumn] = [Number(firstSelectedCell.dataset.row), Number(firstSelectedCell.dataset.column)];
        let [lastRow, lastColumn] = [Number(lastSelectedCell.dataset.row), Number(lastSelectedCell.dataset.column)];
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
        let [firstRow,firstColumn] = [Number(firstSelectedCell.dataset.row), Number(firstSelectedCell.dataset.column)];
        let [lastRow, lastColumn] = [Number(e.target.dataset.row), Number(e.target.dataset.column)];
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
