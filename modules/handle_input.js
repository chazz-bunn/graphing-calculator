import { tokenize } from "./tokenize.js";

export function handle_input(input_str){

    const operator_table = [
        ["^", 4, "right"],
        ["*", 3, "left"],
        ["/", 3, "left"],
        ["+", 2, "left"],
        ["-", 2, "left"]
    ];


    if(input_str.includes("=")){
        let sides = input_str.split("=");
        if(sides.length == 2){
            let lhs = sides[0];
            let lhs_tokens = tokenize(lhs);
            console.log("***LHS***");
            lhs_tokens.forEach(function(token, index) {  
                console.log(index + "=> " + token.type + "(" + token.value + ")");
            });

            let rhs = sides[1];
            let rhs_tokens = tokenize(rhs);
            console.log("***RHS***");
            rhs_tokens.forEach(function(token, index) {  
                console.log(index + "=> " + token.type + "(" + token.value + ")");
            });
        }
    }
    else{
        let tokens = tokenize(input_str);
        let output = [];
        let operator_stack = [];
        tokens.forEach(function(token, index) {  
            console.log(index + "=> " + token.type + "(" + token.value + ")");
            if(token.type == "Literal"){
                output.push(token);
            }
            else if(token.type == "Function"){
                operator_stack.push(token)
            }
            else if(token.type == "Operator"){
                while(true){
                    if(operator_stack.length > 0){
                        if(operator_stack.at(-1).value != "("){
                            
                        }
                    }
                }
            }


        });
        return tokens;
    }
}