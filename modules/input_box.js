export class InputBox{
    constructor(idx, width, height, box_active = false){
        this.input_canvas = document.createElement('canvas');
        this.input_canvas.id = "input-canvas-" + idx.toString();
        this.input_canvas.className = "input-canvas";
        this.input_canvas.ctx = this.input_canvas.getContext('2d');
        this.input_canvas.height = height;
        this.input_canvas.width = width;
        this.box_active = box_active;
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
       
    }

    getCanvas() {return this.input_canvas;}
}