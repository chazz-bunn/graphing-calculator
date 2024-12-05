export function handle_input(input_str){
    //parse equation string here
    input_str = input_str.replace("y=", "");
    input_str = input_str.replace("cos(", "Math.cos(");
    input_str = input_str.replace("sin(", "Math.sin(");
    input_str = input_str.replace("tan(", "Math.tan(");
    input_str = input_str.replace("sec(", "(1/Math.cos()");
    input_str = input_str.replace("csc(", "(1/Math.sin()");
    input_str = input_str.replace("cot(", "(1/Math.tan()");

    console.log(input_str);

    return input_str;
}