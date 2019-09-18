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


function createGrid(row,col){
    for(let i=0;i<row;i++){
        for(let j=0;j<col;j++){
            let cell = document.createElement("div");
            let cellNo = i*row+j+1;
            cell.className = "cell";
            cell.style.gridArea=`${i+1}\/${j+1}\/${i+2}\/${j+2}`;
            cell.dataset.no=cellNo;
            cell.innerHTML=`<span>${cellNo}</span>`;

            gridWireframe.appendChild(cell);
            cell.addEventListener("click",selectCell);

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
    console.log(e)
    gridWireframe.innerHTML="";
    createGrid(gridData.numOfRows, gridData.numOfColumns );
}

function selectCell(e){
    e.target.classList.toggle("selected");
    window.addEventListener("mousemove", mouseMoveNextSelect)
}

function mouseMoveNextSelect(e){
    
}