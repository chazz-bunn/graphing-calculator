import { Token } from "./token.js";
import { list_of_functions } from "./list_of_functions.js";

export function tokenize(str){
        let result = [];
        str = str.replace(/\s+/g, "");
        str = str.split("");
        let numberBuffer = "";
        let letterBuffer = "";
    
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
                let p_flag = false;
                letterBuffer.split("").forEach((ch, idx) => { 
                    if(list_of_variables.includes(ch)){
                        result.push(new Token("Variable", ch));
                    }
                    else if(isLetter(ch)){
                        if(p_flag){
                            if(ch == 'i'){
                                result.push(new Token("Literal", Math.PI))
                            }
                            else{
                                result.push(new Token("Constant", 'i'));
                                result.push(new Token("Operator", "*"));
                                result.push(new Token("Constant", ch));
                            }
                            p_flag = false
                        }
                        else if(ch == 'p'){
                            p_flag = true
                        }
                        else if(ch == 'e'){
                            result.push(new Token("Literal", Math.exp(1)))
                        }
                        else{
                            result.push(new Token("Constant", ch));
                        }
                    }
                    if(!p_flag){
                        if(idx < letterBuffer.split("").length - 1 || !beforeOp){
                            result.push(new Token("Operator", "*"));
                        }
                    }
                });
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
                        let p_flag = false
                        for(let i = 0; i < fn_idx; i++){
                            if(list_of_variables.includes(letterBuffer[i])){
                                result.push(new Token("Variable", letterBuffer[i]));
                                result.push(new Token("Operator", "*"));
                            }
                            else{
                                if(p_flag){
                                    if(letterBuffer[i] == 'i'){
                                        result.push(new Token("Literal", Math.PI));
                                    }
                                    else{
                                        result.push(new Token('Constant', 'p'));
                                        result.push(new Token("Operator", "*"));
                                        result.push(new Token("Constant", letterBuffer[i]));
                                    }
                                    p_flag = false;
                                }
                                else if(letterBuffer[i] == 'p'){
                                    p_flag = true;
                                }
                                else if(letterBuffer[i] == 'e'){
                                    result.push(new Token("Literal", Math.exp(1)))
                                }
                                else{
                                    result.push(new Token("Constant", letterBuffer[i]));
                                }
                                result.push(new Token("Operator", "*"));
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