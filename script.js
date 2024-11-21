document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    let centerOffsetXScale = 0.5;
    let centerOffsetYScale = 0.5;

    let grid_zoom = 20;
    let grid_zoom_last = 20;
    let scale = 1;
    let scale_array = [1,2,5];
    let scale_idx = 0;
    let cell_length = 0;

    // Draws the Grid and the graph
    function drawGrid(){
        // Function used for drawing lines
        function drawLine(xa, ya, xb, yb, thickness = 2, color = "black"){
            ctx.strokeStyle = color; 
            ctx.beginPath();
            ctx.lineWidth = thickness;
            ctx.moveTo(xa, ya);
            ctx.lineTo(xb, yb);
            ctx.stroke();
        }

        function f(x){
            return Math.pow(x, 3);
        }

        // Get window size
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        
        // The center
        let centerX = window.innerWidth*centerOffsetXScale;
        let centerY = window.innerHeight*centerOffsetYScale;
        
        // Draw x-axis and y-axis lines respectively
        drawLine(0, centerY, canvas.width, centerY, 2, "black");
        drawLine(centerX, 0, centerX, canvas.height, 2, "black");

        // Determine Cell Size
        // There's an issue when zooming in and grid_zoom becomes 0 or negative and you can no longer see the graph
        if(grid_zoom > 0){
            cell_length = canvas.width/grid_zoom;
        }
        if(grid_zoom < 0){
            cell_length = canvas.width*Math.abs(grid_zoom);
        }

        // Draw the grid lines and unit numbers
        let m = 0;
        ctx.font = "20px Arial";
        ctx.fillText(m.toString(), centerX+5, centerY+20);
        for(let i = 1; i <= Math.floor((canvas.width - centerX)/(cell_length*scale)); i++){
            let x = scale*cell_length*i;
            drawLine(centerX + x, 0, centerX + x, canvas.height, 1, "gray");
            let idx = Math.round(100*scale*i)/100;
            ctx.fillText(idx*i.toString(), centerX + x, centerY+20);
        }
        for(let i = 1; i <= Math.floor(centerX/(cell_length*scale)); i++){
            let x = scale*cell_length*i;
            drawLine(centerX - x, 0, centerX - x, canvas.height, 1, "gray");
            let idx = Math.round(100*scale*i)/100;
            ctx.fillText(-idx.toString(), centerX - x, centerY+20);
        }
        for(let i = 1; i <= Math.floor((canvas.height - centerY)/(cell_length*scale)); i++){
            let y = scale*cell_length*i;
            drawLine(0, centerY + y, canvas.width, centerY + y, 1, "gray");
            let idx = Math.round(100*scale*i)/100;
            ctx.fillText(-idx.toString(), centerX+10, centerY+y-3);
        }
        for(let i = 1; i <= Math.floor(centerY/(cell_length*scale)); i++){
            let y = scale*cell_length*i;
            drawLine(0, centerY - y, canvas.width, centerY - y, 1, "gray");
            let idx = Math.round(100*scale*i)/100;
            ctx.fillText(idx.toString(), centerX+10, centerY-y-3);
        }

        // Graph function using splines
        let step = Math.abs(Math.floor(10000/grid_zoom));
        for(let i = -step*(Math.ceil(centerX/cell_length)); i < step*(Math.ceil((canvas.width - centerX)/cell_length)); i++){
            let xa = cell_length*((i-1)/step)+centerX;
            let ya = -cell_length*f((i-1)/step)+centerY;
            let xb = cell_length*i/step+centerX;
            let yb = -cell_length*f(i/step)+centerY;
            drawLine(xa, ya, xb, yb, 2, "red"); 
        }
    }

    // Detect if window has been resized
    window.addEventListener("resize", () => {
        drawGrid();
    });
    
    // Detect if left click is down and mouse is moving, this will be used for shifting graph
    let held = false;
    canvas.addEventListener("mousemove", (event) => {
        canvas.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                held = true;
            }
        });
        canvas.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                held = false;
            }
        });

        if(held){
            centerOffsetXScale += event.movementX/1000;
            centerOffsetYScale += event.movementY/1000;
            drawGrid();
        }
    });

    canvas.addEventListener("wheel", (event) => {
        grid_zoom += event.deltaY/100;
        

        if(canvas.width/(cell_length*scale) >= 24 && event.deltaY > 0){
            if((scale_idx + 1) % 3 == 0){
                scale_array = scale_array.map(num => num*10);
            }
            scale = scale_array[(scale_idx + 1) % 3];
            scale_idx = (scale_idx + 1) % 3
        }
        if(canvas.width/(cell_length*scale) <= 24 && event.deltaY < 0){
            scale_idx = (scale_idx - 1) % 3;
            if(scale_idx == -1){
                scale_array = scale_array.map(num => num/10);
                scale_idx = 2;
            }
            scale = scale_array[(scale_idx) % 3];
        }
        console.log(scale_idx);
        /* if(grid_zoom >= grid_zoom_last + 5 && event.deltaY > 0) {
            if((scale_idx + 1) % 3 == 0){
                scale_array = scale_array.map(num => num*10);
            }
            scale = scale_array[(scale_idx + 1) % 3];
            scale_idx++;
            grid_zoom_last = grid_zoom_last + 5;
        } */

        /* if(grid_zoom >= 25 && event.deltaY > 0){
            scale = 2;
        }
        if(grid_zoom <= 25 && event.deltaY < 0){
            scale = 1;
        } */

        if(grid_zoom == 0 && event.deltaY < 0){
            grid_zoom = -2;
        }
        if(grid_zoom == 0 && event.deltaY > 0){
            grid_zoom = 2;
        }

        //console.log(grid_zoom);
        //console.log(canvas.width/(cell_length*scale));
        drawGrid();
    });

    drawGrid();
});