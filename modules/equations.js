export class Equations{
    constructor(canvas_id){
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.width = this.canvas.parentNode.width;
        this.ctx.canvas.height = this.canvas.parentNode.height;
    }

    drawLine(xa, ya, xb, yb, thickness = 2, color = "black"){
        this.ctx.strokeStyle = color; 
        this.ctx.beginPath();
        this.ctx.lineWidth = thickness;
        this.ctx.moveTo(xa, ya);
        this.ctx.lineTo(xb, yb);
        this.ctx.stroke();
    }

    testLine(){
        this.drawLine(10, 0, 10, 100, 5, "red");
    }
}