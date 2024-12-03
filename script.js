document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const equation_box = document.getElementById("equation");
    let f = Function("x", "return undefined;")
    
    let centerOffsetXScale = 0.5;
    let centerOffsetYScale = 0.5;

    let grid_zoom = 20;
    let scale = 1;
    let scale_array = [1,2,5];
    let scale_idx = 0;
    let cell_length = 0;

    let centerX = 0;
    let centerY = 0;

    let mouse_pos_x = 0;
    let mouse_pos_y = 0;
    let mouse_coord_x = 0;
    let mouse_coord_y = 0;

    function graphCurve(){
        // Graph function using splines
        let step = Math.abs(Math.floor(10000/grid_zoom));
        let lower = -step*(Math.ceil(centerX/cell_length));
        let upper = step*(Math.ceil((canvas.width-centerX)/cell_length));
        for(let i = lower; i < upper; i++){
            let xa = cell_length*((i-1)/step)+centerX;
            let ya = -cell_length*f((i-1)/step)+centerY;
            let xb = cell_length*i/step+centerX;
            let yb = -cell_length*f(i/step)+centerY;
            drawLine(ctx, xa, ya, xb, yb, 2, "red"); 
        }
    }

    // Function used for drawing lines
    function drawLine(ctx, xa, ya, xb, yb, thickness = 2, color = "black"){
        ctx.strokeStyle = color; 
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.stroke();
    }

    function setGridVars(){
        // Get window size
        ctx.canvas.width = (5/6)*window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        
        // Determine Cell Size
        cell_length = (grid_zoom > 0) ? canvas.width/grid_zoom : canvas.width*Math.abs(grid_zoom);

        // The center
        centerX = window.innerWidth*centerOffsetXScale;
        centerY = window.innerHeight*centerOffsetYScale;
    }

    // Draws the Grid and the graph
    function drawGrid(){        
        // Draw x-axis and y-axis lines respectively
        drawLine(ctx, 0, centerY, canvas.width, centerY, 2, "black");
        drawLine(ctx, centerX, 0, centerX, canvas.height, 2, "black");

        // Draw the grid lines and unit numbers
        let m = 0;
        ctx.font = "20px Arial";
        ctx.fillText(m.toString(), centerX+5, centerY+20);
        function get_idx(i){
            return (scale*1 < 0.01) ? (scale*i).toExponential(1): Math.round(100*scale*i)/100;
        }
        for(let i = 1; i <= Math.floor((canvas.width-centerX)/(cell_length*scale)); i++){
            let x = scale*cell_length*i;
            drawLine(ctx, centerX+x, 0, centerX+x, canvas.height, 1, "gray");
            let idx = get_idx(i);
            ctx.fillText(idx.toString(), centerX+x, centerY+20);
        }
        for(let i = 1; i <= Math.floor(centerX/(cell_length*scale)); i++){
            let x = scale*cell_length*i;
            drawLine(ctx, centerX-x, 0, centerX-x, canvas.height, 1, "gray");
            let idx = get_idx(i);
            ctx.fillText("-"+idx.toString(), centerX-x, centerY+20);
        }
        for(let i = 1; i <= Math.floor((canvas.height-centerY)/(cell_length*scale)); i++){
            let y = scale*cell_length*i;
            drawLine(ctx, 0, centerY + y, canvas.width, centerY+y, 1, "gray");
            let idx = get_idx(i);
            ctx.fillText("-"+idx.toString(), centerX+10, centerY+y-3);
        }
        for(let i = 1; i <= Math.floor(centerY/(cell_length*scale)); i++){
            let y = scale*cell_length*i;
            drawLine(ctx, 0, centerY-y, canvas.width, centerY - y, 1, "gray");
            let idx = get_idx(i);
            ctx.fillText(idx.toString(), centerX+10, centerY-y-3);
        }
    }

    // Detect if window has been resized
    window.addEventListener("resize", () => {
        setGridVars();
        drawGrid();
        graphCurve();
    });
    
    // Detect if left click is down and mouse is moving, used for shifting graph
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
            setGridVars();
            drawGrid();
            graphCurve();
        }
    });
    canvas.addEventListener("mouseleave", () => {
        held = false;
    });

    // Listens for scroll-wheel, used to zoom in and out on graph
    canvas.addEventListener("wheel", (event) => {
        let prev_scale = scale;
        let rect = canvas.getBoundingClientRect();
        mouse_coord_x = (event.clientX-rect.left-centerX)/(scale*cell_length);
        mouse_coord_y = (centerY-(event.clientY-rect.top))/(scale*cell_length);
        mouse_pos_x = event.clientX-rect.left;
        mouse_pos_y = event.clientY-rect.top;

        grid_zoom += event.deltaY/100;

        // Rescale graph based on zoom levels
        if(canvas.width/(cell_length*scale) >= 20 && event.deltaY > 0){
            if((scale_idx + 1) % 3 == 0){
                scale_array = scale_array.map(num => num*10);
            }
            scale = scale_array[(scale_idx + 1) % 3];
            scale_idx = (scale_idx + 1) % 3
        }
        if(canvas.width/(cell_length*scale) <= 10 && event.deltaY < 0){
            scale_idx = scale_idx - 1
            if(scale_idx == -1){
                scale_array = scale_array.map(num => num/10);
                scale_idx = 2;
            }
            scale = scale_array[scale_idx];
        } 

        // Used to avoid jank when grid_zoom changes sign
        if(grid_zoom == 0 && event.deltaY < 0){
            grid_zoom = -2;
        }
        if(grid_zoom == 0 && event.deltaY > 0){
            grid_zoom = 2;
        }

        setGridVars();
        // d* = (where coordinate will be if zooming from center relative to canvas coord) - (current mouse position relative to canvas coord)
        let dx = centerX+prev_scale*cell_length*mouse_coord_x - mouse_pos_x;
        let dy = centerY-prev_scale*cell_length*mouse_coord_y - mouse_pos_y;
        // Offset center such that mouse position stays over same coordinate position when zooming in/out
        centerX -= dx;
        centerY -= dy;
        // Adjust offset scale variables used for shifting graph
        centerOffsetXScale = centerX/window.innerWidth;
        centerOffsetYScale = centerY/window.innerHeight;
        drawGrid();
        graphCurve();
    });

    equation_box.addEventListener("input", () => {
        console.log(equation_box.value);

        f = Function("x", "return " + equation_box.value);
        setGridVars();
        drawGrid();
        graphCurve();
    });

    setGridVars();
    drawGrid();
    graphCurve();
});