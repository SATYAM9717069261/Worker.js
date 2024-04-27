export function addSingleWork({workdetails,queue,callback}){
    const {name,id,funParameters,action} = workdetails;
    queue.enqueue({name:name, fun:action, params:funParameters, callback:(data)=>{ console.log("Worker 2  INside Call back =>",data); }});
}
export function addPriorityWork({workdetails,queue}){
    const {name,id,funParameters,action} = workdetails;
    queue.enqueue({fun:action,name:name, priority:0, params:funParameters, callback:(data)=>{ console.log("Worker 2  INside Call back =>",data); }});
}
