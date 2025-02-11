export class InputBox{
    constructor(idx, width, height){
        this.input_canvas = document.createElement('canvas');
        this.input_canvas.tabIndex = 0;
        this.input_canvas.id = "input-canvas-" + idx.toString();
        this.input_canvas.className = "input-canvas";
        this.ctx = this.input_canvas.getContext('2d');

        this.ctx.canvas.height = height;
        this.ctx.canvas.width = width;
        
        this.cursorBlickInterval = 500;
        this.isCursorVisible = true;
        this.is_focused = false;

        this.font_size = 22;
        this.input_str = "";
        this.cursor_index = 0;

        this.input_canvas.addEventListener('keydown', (event)=>{
            if(event.key.length == 1){
                //console.log(event);
                this.input_str += event.key;
                this.cursor_index++;
                this.drawCursor();
            }
            else if(event.key == "ArrowLeft"){
                if(this.cursor_index > 0){
                    this.cursor_index--;
                }
            }
            else if(event.key == "ArrowRight"){
                if(this.cursor_index < this.input_str.length){
                    this.cursor_index++;
                }
            }
        });
        this.input_canvas.addEventListener("focusin", ()=>{
            this.is_focused = true;
        });
        this.input_canvas.addEventListener("focusout", ()=>{
            this.is_focused = false;
            this.drawCursor();
        });
       setInterval(this.toggleCursorVisibility.bind(this), this.cursorBlickInterval);
    }

    toggleCursorVisibility(){
        this.isCursorVisible = !this.isCursorVisible;
        if(this.is_focused){
            this.drawCursor();
        }
        
    }

    drawCursor(){
        //Note: fillText text is anchored at bottom left corner
        //To make appear in middle: height/2 + text_height/2 - (maybe 3 because of bordered bottom *shrug*)
        this.ctx.clearRect(0, 0, this.input_canvas.width, this.input_canvas.height);
        this.ctx.font = this.font_size.toString() + "px Arial";
        this.ctx.fillStyle = "black";
        //Redo all this
        this.ctx.fillText(this.input_str, 4, this.ctx.canvas.height/2 + this.font_size/2 - 3);
        if(this.isCursorVisible && this.is_focused){
            console.log(4 + this.font_size/2*this.cursor_index);
            this.ctx.fillText("|", 4 + this.font_size/2*this.cursor_index, this.ctx.canvas.height/2 + this.font_size/2 - 3);
        }
    }

    getCanvas() {return this.input_canvas;}
}