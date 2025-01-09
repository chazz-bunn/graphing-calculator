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
        console.log("Regular Tokens")
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
                    //console.log("while 1")
                    if(operator_stack.length > 0){
                        if(operator_stack.at(-1).value != "("){
                            let p1 = [0, "right"]
                            let p2 = [0, "right"]
                            operator_table.forEach(function(symbol, precedence, associativity){
                                if(symbol == operator_stack.at(-1).value){
                                    p2 = [precedence, associativity]
                                }
                                if(symbol == token.value){
                                    p1 = [precedence, associativity]
                                }
                            });
                            if(p2.at(0) > p1.at(0)){
                                output.push(operator_stack.pop())
                            }
                            else if(p2.at(0) == p1.at(0)){
                                if(p1.at(1) === "left"){
                                    output.push(operator_stack.pop())
                                }
                                break
                            }
                            else{
                                break
                            }
                        }
                        else{
                            break
                        }
                    }
                    else{
                        break
                    }
                }
                operator_stack.push(token)
            }
            else if(token.type == "Function Argument Separator"){
                while(operator_stack.at(-1).value != "("){
                    //console.log("while 2")
                    output.push(operator_stack.pop())
                }
            }
            else if(token.type == "Left Paranthesis"){
                operator_stack.push(token)
            }
            else if(token.type == "Right Paranthesis"){
                while(true){
                    //console.log("while 3")
                    if(operator_stack.length == 0){
                        console.log("Mismatched Parantheses error")
                        break
                    }
                    else if(operator_stack.at(-1).type == "Left Paranthesis"){
                        break
                    }
                    else{
                        output.push(operator_stack.pop())
                    }
                }
                if(operator_stack.at(-1).type != "Left Paranthesis"){
                    console.log("Mismatched Parantheses error")
                }
                else{
                    operator_stack.pop()
                }
            }
        });
        while(true){
            //console.log("while 4")
            if(operator_stack.length == 0){
                break
            }
            else{
                output.push(operator_stack.pop())
            }
        }
        console.log("RPN tokens")
        output.forEach(function(token, index) {  
            console.log(index + "=> " + token.type + "(" + token.value + ")");
        });
        return tokens;
    }
}