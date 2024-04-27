import parallerWorker from "../libs/worker.js"
import { Button } from "component/buttons"
import myWorker from "./../libs/work.js"
import { useEffect, useState } from "react";
type work = {
    name:string;
    id: number;
    priority:number;
    action: any;
}
async function api(priority:any){
    const url = `https://dummyjson.com/products/${priority}`;
    const res = await fetch(url);
    return res.json();
}
const queue = new parallerWorker(myWorker);
export function ServiceWorker(){
    const [workList,setWorker] = useState<work[]> ([]);
    return <div>
        <div>
            { workList.map(data=><Button text={"API CALL "} count={data.id} priority={data.priority} queue={queue} />) }
            <button onClick={()=>{queue.print()}}> Show </button>
            <button onClick={()=>{queue.exec()}}> Exec </button>
            <button onClick={()=>{
                setWorker((prev) => {
                   return  [ ...prev, { name: "Dummy task (API CALL)", id: prev.length + 1, priority: 1, action: () => {} } ]
                })
                queue.enqueue({fun:api, params:workList.length, callback:(data:any)=>{ console.log("Worker 2  INside Call back =>",data); }});
                }}> Add Work </button> 

            <button onClick={()=>{
                setWorker((prev) => {
                   return  [ ...prev, { name: "Dummy task (API CALL)", id: prev.length + 1, priority: 0, action: () => {} } ]
                })
                queue.enqueue({fun:api, params:workList.length, priority:0, callback:(data:any)=>{ console.log("Worker 2  INside Call back =>",data); }});
                }}> Add PrioWork </button> 
        </div>
        <div>
            
        </div>
    </div>
}
