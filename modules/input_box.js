export class InputBox{
    constructor(idx, width, height, box_active = false){
        this.input_canvas = document.createElement('canvas');
        this.input_canvas.id = "input-canvas-" + idx.toString();
        this.input_canvas.className = "input-canvas";
        this.ctx = this.input_canvas.getContext('2d');
        this.font_size = 22;
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
        //Note: fillText text is anchored at bottom left corner
        //To make appear in middle: height/2 + text_height/2 - (maybe 3 because of bordered bottom *shrug*)
        this.ctx.fillStyle = "black";
        this.ctx.font = this.font_size.toString() + "px Arial";
        this.ctx.fillText("|A|AAAAAAAAAA", 4, this.ctx.canvas.height/2 + this.font_size/2 - 3);
        /* if(this.isCursorVisible){
            this.input_canvas.fillText("|", 5, 0);
        } */
    }

    getCanvas() {return this.input_canvas;}
}