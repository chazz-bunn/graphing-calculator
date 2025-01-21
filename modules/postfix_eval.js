export function postfix_eval(tokens, x){
    let stack = [];

    tokens.forEach(token => {
        if(token.type == "Literal"){
            stack.push(token.value);
        }
        else if(token.type == "Variable"){
            stack.push(x);
        }
        else if(token.type == "Operator"){
            let val1 = stack.pop();
            let val2 = stack.pop();

            switch(token.value){
                case '+':
                    stack.push(val2+val1);
                    break;
                case '-':
                    stack.push(val2-val1);
                    break;
                case '*':
                    stack.push(val2*val1);
                    break;
                case '/':
                    stack.push(val2/val1);
                    break;
                case '^':
                    stack.push(Math.pow(val2, val1));
                    break;
            }
        }
    });
    return stack.pop();
}