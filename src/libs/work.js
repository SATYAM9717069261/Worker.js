class WorkerClass {
    constructor() {
        console.info("Worker initialized");
        this.onmessage = this.onmessage.bind(this);
        self.addEventListener('message', this.onmessage);// eslint-disable-line no-restricted-globals
    }
    modifyFunction(fun,args){
        const functionString = fun;
        const defaultParams = args.split(',');;
        let start = functionString.indexOf("function");
        let end = start;
        let found = false;
        let params = "";
        let resultParams = "" ;
        for(let i = start;i<functionString.length;i++){
            if(functionString[i] == '('){
                resultParams += functionString.substring(0,i+1);
                found = true;
                continue;
            }
            if(functionString[i] == ')'){
                found = false;
                end = i;
                break;
            }
            if(found == true)
                params+=functionString[i];
            
        }
        const splitParams = params.split(',');
        if(splitParams.length == defaultParams.length){
            for(let i = 0;i<splitParams.length;i++){
                resultParams += `${splitParams[i]}=${defaultParams[i]},`
            }
        }
        resultParams += functionString.substring(end);
        return resultParams; 
    }
    onmessage(event) {
        const { cmd, fun, params} = {...event.data};
        if(cmd == "execute"){
            const newFun = this.modifyFunction(fun,params);
            const funCall = (new Function(newFun))();
            if(fun.includes('async')){
                funCall().then(data=>{
                    postMessage(data);
                });
            }else{
                //normal Function 
                const result = funCall()
                console.log("Result =>",result);
                postMessage(result);
            }
        }


        // Handle the received message here
    }
}

export default WorkerClass;
