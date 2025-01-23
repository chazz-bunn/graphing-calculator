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
                    stack.push(+val2 + +val1);
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
        else if(token.type == "Function"){
            if(token.value != "max" && token.value != 'min'){
                let val = stack.pop();

                switch(token.value){
                    case 'cos':
                        stack.push(Math.cos(val));
                        break;
                    case 'sin':
                        stack.push(Math.sin(val));
                        break;
                    case 'tan':
                        stack.push(Math.tan(val));
                        break;
                    case 'sec':
                        stack.push(1/Math.cos(val));
                        break;
                    case 'csc':
                        stack.push(1/Math.sin(val));
                        break;
                    case 'cot':
                        stack.push(1/Math.tan(val));
                        break;
                    case 'arccos':
                        stack.push(Math.acos(val));
                        break;
                    case 'arcsin':
                        stack.push(Math.asin(val));
                        break;
                    case 'arctan':
                        stack.push(Math.atan(val));
                        break;
                    case 'arcsec':
                        stack.push(Math.acos(1/val));
                        break;
                    case 'arccsc':
                        stack.push(Math.sin(1/val));
                        break;
                    case 'arccot':
                        stack.push(Math.tan(1/val));
                        break;
                    case 'cosh':
                        stack.push(Math.cosh(val));
                        break;
                    case 'sinh':
                        stack.push(Math.sinh(val));
                        break;
                    case 'tanh':
                        stack.push(Math.tanh(val));
                        break;
                    case 'sech':
                        stack.push(1/Math.cosh(val));
                        break;
                    case 'csc':
                        stack.push(1/Math.sinh(val));
                        break;
                    case 'cot':
                        stack.push(1/Math.tanh(val));
                        break;
                    case 'ln':
                        stack.push(Math.log(val));
                        break;
                    case 'log':
                        stack.push(Math.log10(val));
                        break;
                    case "abs":
                        stack.push(Math.abs(val));
                        break;
                }
            }
        }
    });
    return stack.pop();
}