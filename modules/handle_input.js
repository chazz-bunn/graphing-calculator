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
        str.forEach((char) => {
            if(isDigit(char)){
                if(letterBuffer){
                    if(letterBuffer in list_of_variables){
                        // May have to look at things other way around to see variable chain such as "xy"
                        result.push(new Token("Operator", "*"));
                        result.push(new Token("Variable", letterBuffer));
                        letterBuffer = "";
                    }
                }
                numberBuffer += char;
            }
            else if(isLetter(char)){
                if(numberBuffer){
                    result.push(new Token("Literal", numberBuffer));
                    numberBuffer = "";
                }
                letterBuffer += char;
            }
            else if(isOperator(char)){
                result.push(new Token("Operator", char));
            }
            else if(isLeftParenthesis(char)){
                if(letterBuffer){
                    if(letterBuffer in list_of_functions){
                        result.push("Operator", letterBuffer);
                    }
                }
                //result.push(new Token("Left Paranthesis", char));
            }
            else if(isRightParenthesis(char)){
                result.push(new Token("Right Paranthesis", char));
            }
            else if(isComma(char)){
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