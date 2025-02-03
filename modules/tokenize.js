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

        let div_flag = false;

        function pushResult(token){
            result.push(token);
            //Make a buffer until a certain condition is made, like a plus or minus operator
            if(div_flag){
                if(token.type != "Left Paranthesis"){
                    console.log("divided by ", token);
                    div_flag = false;
                }
            }
        }

        function clearLetterBuffer(beforeOp = false){
            if(list_of_variables.includes(letterBuffer)){
                pushResult(new Token("Variable", letterBuffer));
                if(!beforeOp){
                    pushResult(new Token("Operator", "*"));
                }
                letterBuffer = "";
            }
            else{
                let p_flag = false;
                letterBuffer.split("").forEach((ch, idx) => { 
                    if(list_of_variables.includes(ch)){
                        pushResult(new Token("Variable", ch));
                    }
                    else if(isLetter(ch)){
                        if(p_flag){
                            if(ch == 'i'){
                                pushResult(new Token("Literal", Math.PI))
                            }
                            else{
                                pushResult(new Token("Constant", 'i'));
                                pushResult(new Token("Operator", "*"));
                                pushResult(new Token("Constant", ch));
                            }
                            p_flag = false
                        }
                        else if(ch == 'p'){
                            p_flag = true
                        }
                        else if(ch == 'e'){
                            pushResult(new Token("Literal", Math.exp(1)))
                        }
                        else{
                            pushResult(new Token("Constant", ch));
                        }
                    }
                    if(!p_flag){
                        if(idx < letterBuffer.split("").length - 1 || !beforeOp){
                            pushResult(new Token("Operator", "*"));
                        }
                    }
                });
                letterBuffer = "";
            }
        }

        function clearNumberBuffer(beforeOp = false){
            pushResult(new Token("Literal", numberBuffer));
            if(!beforeOp){
                pushResult(new Token("Operator", "*"));
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
                if(char == '-'){
                    if(result.length == 0){
                        pushResult(new Token("Literal", -1));
                        pushResult(new Token("Operator", "*"));
                    }
                    else if(!numberBuffer && !letterBuffer && result.at(-1).type != "Right Paranthesis"){
                        pushResult(new Token("Literal", -1));
                        pushResult(new Token("Operator", "*"));
                    }  
                }
                else{
                    if(numberBuffer){
                        clearNumberBuffer(true);
                    }
                    else if(letterBuffer){
                        clearLetterBuffer(true);
                    }
                    pushResult(new Token("Operator", char));
                    if(char == "/"){
                        div_flag = true;
                    }
                }
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
                                pushResult(new Token("Variable", letterBuffer[i]));
                                pushResult(new Token("Operator", "*"));
                            }
                            else{
                                if(p_flag){
                                    if(letterBuffer[i] == 'i'){
                                        pushResult(new Token("Literal", Math.PI));
                                    }
                                    else{
                                        pushResult(new Token('Constant', 'p'));
                                        pushResult(new Token("Operator", "*"));
                                        pushResult(new Token("Constant", letterBuffer[i]));
                                    }
                                    p_flag = false;
                                }
                                else if(letterBuffer[i] == 'p'){
                                    p_flag = true;
                                }
                                else if(letterBuffer[i] == 'e'){
                                    pushResult(new Token("Literal", Math.exp(1)));
                                }
                                else{
                                    pushResult(new Token("Constant", letterBuffer[i]));
                                }
                                pushResult(new Token("Operator", "*"));
                            }
                        }
                        pushResult(new Token("Function", letterBuffer.substring(fn_idx)));
                        letterBuffer = "";
                    }
                    else{
                        clearLetterBuffer();
                        pushResult(new Token("Operator", "*"));
                    }
                }
                else if(numberBuffer){
                    clearNumberBuffer();
                }
                pushResult(new Token("Left Paranthesis", char));
            }
            else if(isRightParenthesis(char)){
                if(numberBuffer){
                    clearNumberBuffer(true);
                }
                else if(letterBuffer){
                    clearLetterBuffer(true);
                }
                pushResult(new Token("Right Paranthesis", char));
            }
            else if(isComma(char)){
                if(numberBuffer){
                    clearNumberBuffer(true);
                }
                else if(letterBuffer){
                    clearLetterBuffer(true);
                }
                pushResult(new Token("Function Argument Separator", char));
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