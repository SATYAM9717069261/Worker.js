import myWorker from "./work.js"
function* genfunc(queue){
    let __queueLen = queue.length;
    for(let i = 0;i<__queueLen;i++)
        yield queue[i];
}
class Observer {
    constructor() {
        this._data = null;
        this._listeners = [];
    }
    set data(value) {
        this._data = value;
        this.notifyListeners();
    }
    get data() {
        return this._data;
    }
    addObserver(listener) {
        this._listeners.push(listener);
    }
    removeObserver(listener) {
        this._listeners = this._listeners.filter(l => l !== listener);
    }
    notifyListeners() {
        this._listeners.forEach(listener => {
            listener(this._data);
        });
    }
}

class parallerWorker{
    /**
        *  queue : store List of Worker
        *  worker: worker Instance
        *  runningProcess: Work Details of Running Process
        *  notification: {
            *  CurrentProcess: status,
            *  queueList : queueList
            *  }
        */
    constructor(worker,callback=()=>{}){
        this._queue = new Array();
        const workerCode = worker.toString();
        const blob = new Blob([`new ${workerCode}()`]);
        this._worker = new Worker(URL.createObjectURL(blob));
        this._runningProcess = {};
        this._notification = callback;
    }
    enqueue({fun,params,callback,priority=this._queue.length,name = `WorkerName${this._queue.length}` ,id = this._queue.length}) {
        const _worker = this._worker;
        if(priority != this._queue.length){
            const newList = [{_task: fun,_params:params,_worker:_worker , status :'start',_callback:callback,name:name,id:id}, ...this._queue];
            this._queue = newList; 
        }else{
            this._queue.push({_task: fun,_params:params,_worker:_worker , status :'start',_callback:callback,name:name,id:id}); 
        }
        this._notification({
            currentProcess: this._runningProcess,
            queueList: this._queue,
            WorkerStatus:'ideal',
            currentProcessOutput:{}
        })
        //this.exec();
    }
    getQueelength(){
        return this._queue.length;
    }
    print(){
        console.log("Exec => ",this._startExec,"  Worker=> ", this._worker, " Quee=> ",this._queue);
    }
    exec(){
        this._runningProcess = this._queue[0];
        this._notification(prev=>{
                return {
                    ...prev,...{ 
                        queueList: this._queue,
                        currentProcess:this._runningProcess ,
                        WorkerStatus:'working'
                    }
                }
            })
        const functionString = this._runningProcess._task.toString();
        const currentProcess = this._runningProcess;

        if(this._queue.length != 0){
            currentProcess._worker.postMessage({cmd:"execute", fun:`return (${functionString})`, params: this._runningProcess._params });
            currentProcess._worker.addEventListener(`message`, handleMessageFromWorker);
            this._queue.shift();
        }

        const observer = new Observer();
        observer.addObserver(data => {
            this._runningProcess._callback(data);
            this._notification(prev=>{
                return {
                    ...prev,...{  currentProcessOutput:data.data, WorkerStatus:'working' }
                }
            })
            if(this._queue.length != 0){
                this.exec();
            }else{
                const queueScheduler = setInterval(()=>{
                    this._notification(prev=>{
                        return {
                            ...prev,...{WorkerStatus:'ideal' }
                        }
                    })
                   if(this._queue.length != 0 ){
                       clearInterval(queueScheduler);
                       this.exec();
                   }
                },1000)
            }
            observer.removeObserver();
        });

        function handleMessageFromWorker(msg) {
            observer.data = msg;
            currentProcess._worker.removeEventListener('message',handleMessageFromWorker)
       }

    }

}
export default parallerWorker;

