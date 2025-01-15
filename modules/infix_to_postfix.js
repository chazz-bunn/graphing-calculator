export function infix_to_postfix(tokens){
    let output = [];
    let operator_stack = [];

    const operator_table = [
        ["^", 4, "right"],
        ["*", 3, "left"],
        ["/", 3, "left"],
        ["+", 2, "left"],
        ["-", 2, "left"]
    ];

    tokens.forEach(function(token, index) {  
        if(token.type == "Literal" || token.type == "Variable" || token.type == "Constant"){
            output.push(token);
        }
        else if(token.type == "Function"){
            operator_stack.push(token);
        }
        else if(token.type == "Operator"){
            while(true){
                if(operator_stack.length > 0){
                    if(operator_stack.at(-1).value != "("){
                        let p1 = [0, "right"];
                        let p2 = [0, "right"];
                        operator_table.forEach(function(op_prop){
                            if(op_prop.at(0) == operator_stack.at(-1).value){
                                p2 = [op_prop.at(1), op_prop.at(2)];
                            }
                            if(op_prop.at(0) == token.value){
                                p1 = [op_prop.at(1), op_prop.at(2)];
                            }
                        });
                        if(p2.at(0) > p1.at(0)){
                            output.push(operator_stack.pop());
                        }
                        else if(p2.at(0) == p1.at(0)){
                            if(p1.at(1) == "left"){
                                output.push(operator_stack.pop());
                            }
                            else{
                                break;
                            }
                        }
                        else{
                            break;
                        }
                    }
                    else{
                        break;
                    }
                }
                else{
                    break;
                }
            }
            operator_stack.push(token);
        }
        else if(token.type == "Function Argument Separator"){
            while(operator_stack.at(-1).value != "("){
                output.push(operator_stack.pop());
            }
        }
        else if(token.type == "Left Paranthesis"){
            operator_stack.push(token);
        }
        else if(token.type == "Right Paranthesis"){
            while(true){
                if(operator_stack.length == 0){
                    console.log("Mismatched Parantheses error");
                    break;
                }
                else if(operator_stack.at(-1).type == "Left Paranthesis"){
                    break;
                }
                else{
                    output.push(operator_stack.pop());
                }
            }
            if(operator_stack.at(-1).type != "Left Paranthesis"){
                console.log("Mismatched Parantheses error");
            }
            else{
                operator_stack.pop();
            }
            if(operator_stack.at(-1).type == "Function"){
                output.push(operator_stack.pop());
            }
        }
    });
    while(true){
        if(operator_stack.length == 0){
            break;
        }
        else{
            output.push(operator_stack.pop());
        }
    }
    
    return output;
}