export class Token{
    constructor(type, value){
        this.type = type;
        this.value = value;
    }

    getType(){return this.type;}
    getValue(){return this.value;}
}