import { InputBox } from "./input_box.js";

export class InputBoxes{
    constructor(){
        this.input_boxes = [];
        this.input_area = document.getElementById("input-boxes-container");
        this.input_box_width = this.input_area.getBoundingClientRect().width;
        this.input_boxes_idx = 0;
    }

    makeInputBox(){
        let input_box = new InputBox(this.input_boxes_idx, this.input_box_width, 50);
        this.input_boxes.push(input_box);
        this.input_boxes_idx++;
        this.input_area.appendChild(input_box.getCanvas());
        input_box.drawCursor();
    }
}