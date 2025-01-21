import { postfix_eval } from "./postfix_eval.js";

export class MyCanvas{
    constructor(canvas_id){
        this.f = Function("x", "return undefined;");
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext("2d");
        //this.ctx = this.canvas.getContext("2d", {alpha:false});
        /* this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height); */
        this.centerOffsetXScale = 0.5;
        this.centerOffsetYScale = 0.5;

        this.grid_zoom = 20;
        this.scale = 1;
        this.scale_array = [1,2,5];
        this.scale_idx = 0;
        this.cell_length = 0;

        this.centerX = 0;
        this.centerY = 0;
    }

    get_idx(i){return (this.scale*1 < 0.01) ? (this.scale*i).toExponential(1): Math.round(100*this.scale*i)/100;}

    getCanvas(){return this.canvas;}

    getScale(){return this.scale;}

    // Function used for drawing lines
    drawLine(xa, ya, xb, yb, thickness = 2, color = "black"){
        this.ctx.strokeStyle = color; 
        this.ctx.beginPath();
        this.ctx.lineWidth = thickness;
        this.ctx.moveTo(xa, ya);
        this.ctx.lineTo(xb, yb);
        this.ctx.stroke();
    }

    setGridVars(){
        // Get window size
        this.ctx.canvas.width = (5/6)*window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        
        // Determine Cell Size
        this.cell_length = (this.grid_zoom > 0) ? this.canvas.width/this.grid_zoom : this.canvas.width*Math.abs(this.grid_zoom);

        // The center
        this.centerX = window.innerWidth*this.centerOffsetXScale;
        this.centerY = window.innerHeight*this.centerOffsetYScale;
    }

    drawGrid(){        
        // Draw x-axis and y-axis lines respectively
        this.drawLine(0, this.centerY, this.canvas.width, this.centerY, 2, "black");
        this.drawLine(this.centerX, 0, this.centerX, this.canvas.height, 2, "black");

        // Draw the grid lines and unit numbers
        let m = 0;
        this.ctx.font = "20px Arial";
        this.ctx.fillText(m.toString(), this.centerX+5, this.centerY+20);
        for(let i = 1; i <= Math.floor((this.canvas.width-this.centerX)/(this.cell_length*this.scale)); i++){
            let x = this.scale*this.cell_length*i;
            this.drawLine(this.centerX+x, 0, this.centerX+x, this.canvas.height, 1, "gray");
            let idx = this.get_idx(i);
            this.ctx.fillText(idx.toString(), this.centerX+x, this.centerY+20);
        }
        for(let i = 1; i <= Math.floor(this.centerX/(this.cell_length*this.scale)); i++){
            let x = this.scale*this.cell_length*i;
            this.drawLine(this.centerX-x, 0, this.centerX-x, this.canvas.height, 1, "gray");
            let idx = this.get_idx(i);
            this.ctx.fillText("-"+idx.toString(), this.centerX-x, this.centerY+20);
        }
        for(let i = 1; i <= Math.floor((this.canvas.height-this.centerY)/(this.cell_length*this.scale)); i++){
            let y = this.scale*this.cell_length*i;
            this.drawLine(0, this.centerY+y, this.canvas.width, this.centerY+y, 1, "gray");
            let idx = this.get_idx(i);
            this.ctx.fillText("-"+idx.toString(), this.centerX+10, this.centerY+y-3);
        }
        for(let i = 1; i <= Math.floor(this.centerY/(this.cell_length*this.scale)); i++){
            let y = this.scale*this.cell_length*i;
            this.drawLine(0, this.centerY-y, this.canvas.width, this.centerY - y, 1, "gray");
            let idx = this.get_idx(i);
            this.ctx.fillText(idx.toString(), this.centerX+10, this.centerY-y-3);
        }
    }

    setEquation(eq_string){
        this.f = Function("x", "return " + "x" + ";");
    }

    graphCurve(tokens){
        // Graph function using splines
        function test(x){
            return Math.tan(x);
        }

        let step = Math.abs(Math.floor(10000/this.grid_zoom));
        let lower = -step*(Math.ceil(this.centerX/this.cell_length));
        let upper = step*(Math.ceil((this.canvas.width-this.centerX)/this.cell_length));

        for(let i = lower; i < upper; i++){
            let xa = this.cell_length*((i-1)/step)+this.centerX;
            let ya = -this.cell_length*postfix_eval(tokens, (i-1)/step)+this.centerY;
            let xb = this.cell_length*i/step+this.centerX;
            let yb = -this.cell_length*postfix_eval(tokens, i/step)+this.centerY;
            if( (ya >= 0 && yb >= 0) && (ya <= this.canvas.height && yb <= this.canvas.height)){
                this.drawLine(xa, ya, xb, yb, 2, "red"); 
            }
        }
    }

    setCenterOffset(centerOffsetXScale, centerOffsetYScale){
        this.centerOffsetXScale += centerOffsetXScale;
        this.centerOffsetYScale += centerOffsetYScale;
    }

    setGridZoom(x_pos, y_pos, zoom, tokens){
        let prev_scale = this.getScale();
        let rect = this.canvas.getBoundingClientRect();
        let mouse_coord_x = (x_pos-rect.left-this.centerX)/(this.scale*this.cell_length);
        let mouse_coord_y = (this.centerY-(y_pos-rect.top))/(this.scale*this.cell_length);
        let mouse_pos_x = x_pos-rect.left;
        let mouse_pos_y = y_pos-rect.top;

        this.grid_zoom += zoom/100;

        // Rescale graph based on zoom levels
        if(this.canvas.width/(this.cell_length*this.scale) >= 20 && zoom > 0){
            if((this.scale_idx + 1) % 3 == 0){
                this.scale_array = this.scale_array.map(num => num*10);
            }
            this.scale = this.scale_array[(this.scale_idx + 1) % 3];
            this.scale_idx = (this.scale_idx + 1) % 3
        }
        if(this.canvas.width/(this.cell_length*this.scale) <= 10 && zoom < 0){
            this.scale_idx = this.scale_idx - 1
            if(this.scale_idx == -1){
                this.scale_array = this.scale_array.map(num => num/10);
                this.scale_idx = 2;
            }
            this.scale = this.scale_array[this.scale_idx];
        } 

        // Used to avoid jank when grid_zoom changes sign
        if(this.grid_zoom == 0 && zoom < 0){
            this.grid_zoom = -2;
        }
        if(this.grid_zoom == 0 && zoom > 0){
            this.grid_zoom = 2;
        }

        this.setGridVars();
        // d* = (where coordinate will be if zooming from center relative to canvas coord) - (current mouse position relative to canvas coord)
        let dx = this.centerX+prev_scale*this.cell_length*mouse_coord_x - mouse_pos_x;
        let dy = this.centerY-prev_scale*this.cell_length*mouse_coord_y - mouse_pos_y;
        // Offset center such that mouse position stays over same coordinate position when zooming in/out
        this.centerX -= dx;
        this.centerY -= dy;
        // Adjust offset scale variables used for shifting graph
        this.centerOffsetXScale = this.centerX/window.innerWidth;
        this.centerOffsetYScale = this.centerY/window.innerHeight;
        this.drawGrid();
        this.graphCurve(tokens);
    }

    setVarsDrawGridDrawCurve(tokens){
        this.setGridVars();
        this.drawGrid();
        this.graphCurve(tokens);
    }
}