const ValidateTextFields=(fields)=>{
        let notNull=0;
        Object.keys(fields).map(key=>{
            if(fields[key]!=""){
                notNull++;
            }
            else{
                notNull--;
            }
        })

        if(notNull==Object.keys(fields).length){
            return true;
        }
        else{
            return false;
        }
    }


module.exports=ValidateTextFields;