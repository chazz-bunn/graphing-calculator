import { infix_to_postfix } from "./infix_to_postfix.js";
import { tokenize } from "./tokenize.js";

export function handle_input(input_str){
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
        let rpn = infix_to_postfix(tokens);
        return rpn;
    }
}