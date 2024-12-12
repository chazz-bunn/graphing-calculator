export function handle_input(input_str){

    const list_of_functions = [
        "cos", "sin", "tan", "sec", "csc", "cot",
        "arccos", "arcsin", "arctan", "arcsec", "arccsc", "arccot",
        "cosh", "sinh", "tanh", "sech", "csch", "coth",
        "ln", "log"
    ]

    let list_of_variables = ["x", "y"];

    class Token{
        constructor(type, value){
            this.type = type;
            this.value = value;
        }

        getType(){return this.type;}
        getValue(){return this.value;}
    }

    function isComma(ch) { return (ch === ",");}
    function isDigit(ch) { return /\d/.test(ch);}
    function isLetter(ch) { return /[a-z]/i.test(ch);}
    function isOperator(ch) { return /\+|-|\*|\/|\^/.test(ch);}
    function isLeftParenthesis(ch) { return (ch === "(");}
    function isRightParenthesis(ch) { return (ch == ")");}

    function tokenize(str){
        let result = [];
        str = str.replace(/\s+/g, "");
        str = str.split("");
        let numberBuffer = "";
        let letterBuffer = "";
        str.forEach((char, idx) => {
            if(isDigit(char) || char == "."){
                if(letterBuffer){
                    if(list_of_variables.includes(letterBuffer)){
                        result.push(new Token("Variable", letterBuffer));
                        result.push(new Token("Operator", "*"));
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
                                if(idx < letterBuffer.split("").length - 1){
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
                numberBuffer += char;
            }
            else if(isLetter(char)){
                if(numberBuffer){
                    result.push(new Token("Literal", numberBuffer));
                    result.push(new Token("Operator", "*"));
                    numberBuffer = "";
                }
                letterBuffer += char;
            }
            else if(isOperator(char)){
                if(numberBuffer){
                    result.push(new Token("Literal", numberBuffer));
                    numberBuffer = "";
                }
                if(letterBuffer){
                    if(list_of_variables.includes(letterBuffer)){
                        result.push(new Token("Variable", letterBuffer));
                        result.push(new Token("Operator", "*"));
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
                                if(idx < letterBuffer.split("").length - 1){
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
                    else if(list_of_variables.includes(letterBuffer)){
                        result.push(new Token("Variable", letterBuffer));
                        result.push(new Token("Operator", "*"));
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
                                if(idx < letterBuffer.split("").length - 1){
                                    result.push(new Token("Operator", "*"));
                                }
                            });
                        }
                        else{
                            //Invalid Input
                        }
                        result.push(new Token("Operator", "*"));
                        letterBuffer = "";
                    }
                }
                else if(numberBuffer){
                    result.push(new Token("Literal", numberBuffer));
                    result.push(new Token("Operator", "*"));
                    numberBuffer = "";
                }
                result.push(new Token("Left Paranthesis", char));
            }
            else if(isRightParenthesis(char)){
                if(numberBuffer){
                    result.push(new Token("Literal", numberBuffer));
                }
                else if(letterBuffer){
                    if(list_of_variables.includes(letterBuffer)){
                        result.push(new Token("Variable", letterBuffer));
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
                                if(idx < letterBuffer.split("").length - 1){
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
                result.push(new Token("Right Paranthesis", char));
            }
            else if(isComma(char)){
                /* 
                ************************************
                Only this left to complete tokenizer
                ************************************
                */
                result.push(new Token("Function Argument Separator", char));
            }
        });
        return result;
    }

    //parse equation string here
    /* input_str = input_str.replace("y=", "");
    input_str = input_str.replace("cos(", "Math.cos(");
    input_str = input_str.replace("sin(", "Math.sin(");
    input_str = input_str.replace("tan(", "Math.tan(");
    input_str = input_str.replace("sec(", "1/Math.cos(");
    input_str = input_str.replace("csc(", "1/Math.sin(");
    input_str = input_str.replace("cot(", "1/Math.tan("); */
    let tokens = tokenize(input_str);
    tokens.forEach(function(token, index) {  
        console.log(index + "=> " + token.type + "(" + token.value + ")");
    });
    return input_str;
}