import { MyCanvas } from "./modules/my_canvas.js";
import { handle_input } from "./modules/handle_input.js";

document.addEventListener("DOMContentLoaded", () => {
    const grid = new MyCanvas("myCanvas");
    const equation_box = document.getElementById("equation");
    // Detect if window has been resized
    window.addEventListener("resize", () => {
        grid.setVarsDrawGridDrawCurve();
    });
    
    // Detect if left click is down and mouse is moving, used for shifting graph
    let held = false;
    grid.getCanvas().addEventListener("mousemove", (event) => {
        grid.getCanvas().addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                held = true;
            }
        });
        grid.getCanvas().addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                held = false;
            }
        });

        if(held){
            grid.setCenterOffset(event.movementX/1000, event.movementY/1000);
            grid.setVarsDrawGridDrawCurve();
        }
    });
    grid.getCanvas().addEventListener("mouseleave", () => {
        held = false;
    });
    
    // Listens for scroll-wheel, used to zoom in and out on graph
    grid.getCanvas().addEventListener("wheel", (event) => {
        grid.setGridZoom(event.clientX, event.clientY, event.deltaY);
    });
    
    equation_box.addEventListener("input", () => {
        grid.setEquation(handle_input(equation_box.value));
        grid.setVarsDrawGridDrawCurve();
    }); 

    grid.setVarsDrawGridDrawCurve();
});