import { Token } from "./token.js";

export function tokenize(str){
        let result = [];
        str = str.replace(/\s+/g, "");
        str = str.split("");
        let numberBuffer = "";
        let letterBuffer = "";

        const list_of_functions = [
            "cos", "sin", "tan", "sec", "csc", "cot",
            "arccos", "arcsin", "arctan", "arcsec", "arccsc", "arccot",
            "cosh", "sinh", "tanh", "sech", "csch", "coth",
            "ln", "log",
            "max", "min"
        ];
    
        let list_of_variables = ["x", "y"];
    
        function isComma(ch) { return (ch === ",");}
        function isDigit(ch) { return /\d/.test(ch);}
        function isLetter(ch) { return /[a-z]/i.test(ch);}
        function isOperator(ch) { return /\+|-|\*|\/|\^/.test(ch);}
        function isLeftParenthesis(ch) { return (ch === "(");}
        function isRightParenthesis(ch) { return (ch == ")");}

        function clearLetterBuffer(beforeOp = false){
            if(list_of_variables.includes(letterBuffer)){
                result.push(new Token("Variable", letterBuffer));
                if(!beforeOp){
                    result.push(new Token("Operator", "*"));
                }
                letterBuffer = "";
            }
            else{
                let var_chain = true;
                list_of_variables.forEach((var_char) => {
                    if(!(letterBuffer.split("").includes(var_char))){
                        var_chain = false;
                    }
                });

                if(var_chain){
                    letterBuffer.split("").forEach((ch, idx) => {
                        result.push(new Token("Variable", ch));
                        if(idx < letterBuffer.split("").length - 1 || !beforeOp){
                            result.push(new Token("Operator", "*"));
                        }
                    });
                }
                else{
                    //Invalid Input
                }
                letterBuffer = "";
            }
        }

        function clearNumberBuffer(beforeOp = false){
            result.push(new Token("Literal", numberBuffer));
            if(!beforeOp){
                result.push(new Token("Operator", "*"));
            }
            numberBuffer = "";
        }

        str.forEach((char) => {
            if(isDigit(char) || char == "."){
                if(letterBuffer){
                    clearLetterBuffer();
                }
                numberBuffer += char;
            }
            else if(isLetter(char)){
                if(numberBuffer){
                    clearNumberBuffer();
                }
                letterBuffer += char;
            }
            else if(isOperator(char)){
                if(numberBuffer){
                    clearNumberBuffer(true);
                }
                else if(letterBuffer){
                    clearLetterBuffer(true);
                }
                result.push(new Token("Operator", char));
            }
            else if(isLeftParenthesis(char)){
                let fn_idx = -1;
                if(letterBuffer){
                    for(let i = 0; i < list_of_functions.length; i++){
                        if(letterBuffer.endsWith(list_of_functions[i])){
                            fn_idx = letterBuffer.indexOf(list_of_functions[i]);
                            break;
                        }
                    }
                    if(fn_idx > -1){
                        for(let i = 0; i < fn_idx; i++){
                            if(list_of_variables.includes(letterBuffer[i])){
                                result.push(new Token("Variable", letterBuffer[i]));
                                result.push(new Token("Operator", "*"));
                            }
                            else{
                                //Invalid Input
                            }
                        }
                        result.push(new Token("Function", letterBuffer.substring(fn_idx)));
                        letterBuffer = "";
                    }
                    else{
                        clearLetterBuffer();
                        result.push(new Token("Operator", "*"));
                    }
                }
                else if(numberBuffer){
                    clearNumberBuffer();
                }
                result.push(new Token("Left Paranthesis", char));
            }
            else if(isRightParenthesis(char)){
                if(numberBuffer){
                    clearNumberBuffer(true);
                }
                else if(letterBuffer){
                    clearLetterBuffer(true);
                }
                result.push(new Token("Right Paranthesis", char));
            }
            else if(isComma(char)){
                if(numberBuffer){
                    clearNumberBuffer(true);
                }
                else if(letterBuffer){
                    clearLetterBuffer(true);
                }
                result.push(new Token("Function Argument Separator", char));
            }
        });
        if(numberBuffer){
            clearNumberBuffer(true);
        }
        else if(letterBuffer){
            clearLetterBuffer(true);
        }
        return result;
    }