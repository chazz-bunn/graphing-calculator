export class InputBox{
    constructor(idx, width, height, box_active = false){
        this.input_canvas = document.createElement('canvas');
        this.input_canvas.id = "input-canvas-" + idx.toString();
        this.input_canvas.className = "input-canvas";
        this.ctx = this.input_canvas.getContext('2d');
        this.ctx.canvas.height = height;
        this.ctx.canvas.width = width;
        this.box_active = box_active;
        this.cursorBlickInterval = 500;
        this.isCursorVisible = true;
        //On Click
        window.addEventListener("click", ()=>{
            this.box_active = false;
            this.input_canvas.addEventListener("click", ()=> {
                this.box_active = true;
                console.log("clicked");
            });
        });
        window.addEventListener('keydown', function(event){
            console.log(event);
            //event
        });

       setInterval(this.toggleCursorVisibility, this.cursorBlickInterval);
    }

    toggleCursorVisibility(){
        this.isCursorVisible = !this.isCursorVisible;
        //this.drawCursor();
    }

    drawCursor(){
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.fillText("|AAAAAAAAAAA", 0, 10);
        /* if(this.isCursorVisible){
            this.input_canvas.fillText("|", 5, 0);
        } */
    }

    getCanvas() {return this.input_canvas;}
}