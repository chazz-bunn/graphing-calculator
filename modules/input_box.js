export class InputBox{
    constructor(idx, width, height){
        this.input_canvas = document.createElement('canvas');
        this.input_canvas.tabIndex = 0;
        this.input_canvas.id = "input-canvas-" + idx.toString();
        this.input_canvas.className = "input-canvas";
        this.ctx = this.input_canvas.getContext('2d');

        this.input_canvas.contentEditable = true;

        this.ctx.canvas.height = height;
        this.ctx.canvas.width = width;

        this.font_size = 22;
        this.ctx.font = this.font_size.toString() + "px Computer Modern Sans Serif";
        this.ctx.fillStyle = "black";

        this.cursor_index = 0;
        this.text_offset = 4;
        this.cursorBlickInterval = 500;
        this.cursor_cutoff = (this.input_canvas.height-this.font_size)/2;

        this.isCursorVisible = true;
        this.is_focused = false;

        this.input_str = "";

        //Idea is to have tags to do things like fractions, subscripts, and superscripts

        this.input_canvas.addEventListener('keydown', (event)=>{
            if(event.key.length == 1){
                if(event.key == "/"){
                    console.log("divide");
                }
                else{
                    this.input_str += event.key;
                    this.cursor_index++;
                    this.isCursorVisible = true;
                    this.drawCursor();
                }
            }
            else{
                switch(event.key) {
                    case "ArrowLeft":
                        if(this.cursor_index > 0){
                            this.cursor_index--;
                            this.isCursorVisible = true;
                            this.drawCursor();
                        }
                        break;
                    case "ArrowRight":
                        if(this.cursor_index < this.input_str.length){
                            this.cursor_index++;
                            this.isCursorVisible = true;
                            this.drawCursor();
                        }
                        break;
                    case "Backspace":
                        if(this.cursor_index > 0){
                            this.input_str = this.input_str.substring(0, this.cursor_index-1) + this.input_str.substring(this.cursor_index, this.input_str.length);
                            this.cursor_index--;
                            this.isCursorVisible = true;
                            this.drawCursor();
                        }
                        break;
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

    drawLine(xa, ya, xb, yb, thickness = 2, color = "black"){
        this.ctx.strokeStyle = color; 
        this.ctx.beginPath();
        this.ctx.lineWidth = thickness;
        this.ctx.moveTo(xa, ya);
        this.ctx.lineTo(xb, yb);
        this.ctx.stroke();
    }

    drawCursor(){
        //Note: fillText text is anchored at bottom left corner
        //To make appear in middle: height/2 + text_height/2 - (maybe 3 because of bordered bottom *shrug*)

        this.ctx.clearRect(0, 0, this.input_canvas.width, this.input_canvas.height);
        
        this.ctx.fillText(this.input_str, this.text_offset, this.ctx.canvas.height/2 + this.font_size/2 - 3);

        if(this.isCursorVisible && this.is_focused){
            let cursor_pos = this.text_offset + this.ctx.measureText(this.input_str.slice(0, this.cursor_index)).width;
            this.drawLine(cursor_pos, this.cursor_cutoff, cursor_pos, this.input_canvas.height-this.cursor_cutoff, 1);
        }
    }

    getCanvas() {return this.input_canvas;}
}