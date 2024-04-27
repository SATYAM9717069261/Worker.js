import style from "./singleWorker.module.css"
import parallerWorker from "../libs/worker";
import myWorker from "./../libs/work.js"
import { useState, useEffect, useRef } from "react";
import { addPriorityWork, addSingleWork } from "../libs/Addworks/addSingleWork";

async function api(priority){
    const url = `https://dummyjson.com/products/${priority}`;
    const res = await fetch(url);
    return res.json();
}

const queue = new parallerWorker(myWorker)
function SingleWorker(){
    const [status,setStatus] = useState({
        queueList:[],
        currentProcess:{}
    });
    useEffect(()=>{
        queue._notification = setStatus;
    },[])
    return <div className={style.mainContainer}>
            <Header queue={queue} status={status}/>
            <div className={`flexRow ${style.body}`}>
                <div className=" flexCol flex-3" style={{padding:"0 47px"}}>
        {/*<WorkList status={status}/> */}
              <Description/>
                    <WorkerProcess status={status}/>   
                    <Output status={status}/>
                </div>
                <Queue status={status}/>
            </div>
        </div>
}
function Header({queue}){
    const [showAddWork,setShowAddWork] = useState({status:false, priority:0});
    return <div className={`flexRow border ${style.header}`}>
        {showAddWork.status && <AddWorkerDetails queue={queue} setShowAddWork={setShowAddWork} showAddWork={showAddWork}/>}
           <button onClick={()=>setShowAddWork(prev=>{
               return { status: !prev.status, priority:1}
           })}> Add Work </button>
            <button onClick={()=> setShowAddWork(prev=>{
               return { status: !prev.status, priority:0}
           })
           }> Add High Priority Work </button>
        <button onClick={()=>{
                queue.exec();
            }}> Start Worker </button>
         {/*    <button onClick={()=>{
                queue.print();
            }}>Show Info </button> **/}
        </div>
}
function AddWorkerDetails({queue ,setShowAddWork ,showAddWork, callback}){
    const name = useRef(null);
    const code = useRef(null);
    const params = useRef(null); 
    const submit = ()=>{
        if( showAddWork.priority  == 0)
            addPriorityWork({ workdetails:{ name: name.current.value , funParameters:params.current.value ,action :code.current.value } ,queue:queue })
        else
            addSingleWork({ workdetails:{ funParameters:params.current.value ,action :code.current.value , name:name.current.value} ,queue:queue })
        setShowAddWork(prev=>{ return { status: !prev.status, priority:0} })
    }
    return <div className={`flex center ${style.Popup}`}> 
        <div>
            <div className="flex">
               <span> Name </span>
               <input ref={name} type="text" placeholder="Work Name"/>
            </div>

            <div className="flex">
                <span> JS Code </span>
                <textarea style={{ height: "127px", width: "466px"}} ref={code} placeholder="JS Code which is Run inside Worker Thread" ></textarea>
            </div>
            <div className="flex">
                <span> Params </span>
                <textarea ref={params} placeholder="JS Code which is Run inside Worker Thread"></textarea>
            </div>
        <div> <button onClick={()=>submit()}> Submit </button> </div>
        </div>
        </div>
}

function Queue({status}){
    const [labelList,setlabelList] = useState([]);
    useEffect(()=>{
        setlabelList(status.queueList);
    },[status.queueList]);
    return <div className={`flexCol flex-1 border ${style.queue}`}>
        {
            labelList.map((data,i)=>{
                return <label key={i} className="flex center border"> {data.name} </label>
            })
        }
        </div>
}

function WorkList({status}){
    console.log(" status =>",status);
    return <div className="flexRow" style={{flexWrap:"wrap"}}>
           <SingleWork status={status}/> 
           <SingleWork status={status}/> 
           <SingleWork status={status}/> 
           <SingleWork status={status}/> 
           <SingleWork status={status}/> 
    </div>
}

function SingleWork({status}){
    return <div className={`flexCol ${style.singleWork}`}>
               <div className={`flexRow ${style.title}`}>
                    <div className="flexRow">
                        <span> Name </span>:
                        <span> Status </span>
                    </div>
                        <span> Edit </span>
                </div>
                <div> 
                    <Output status={{}} /> 
                </div>
        </div>
}




function Description(){
    const [showMore,setShowMore] = useState(false);
        return <div> 
        {showMore ? <CompleteDescription setShowMore={setShowMore}/>:
            <>
    <div className={style.description}>
        <h2>Motivation Behind the Project:</h2>
        <p>One of the limitations of running JavaScript in the browser is its single-threaded nature, which can cause
            the UI to become unresponsive during heavy computations or I/O operations. Suppose you need to develop a JSON
            Viewer with advanced data extraction and viewing capabilities, akin to SQL operations. This requires
            significant computational resources, potentially causing the browser to freeze. To address this challenge,
            we've developed TaskQueue.js, a versatile solution utilizing web workers to offload intensive tasks from the
            main UI thread.</p>
        </div>
            <button style={{float:"right", height:"41px", width: "86px"}} onClick={()=>{
                setShowMore(prev => !prev);
                }}> More... </button>
            </>
        }
    </div>
}
function CompleteDescription({setShowMore}){
    const codeStyle = {
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        fontSize: '90%',
    };       
        return <div> 
        <div>
    <div>
        <h1>Asynchronous Task Management</h1>

        <h2>Motivation Behind the Project:</h2>
        <p>One of the limitations of running JavaScript in the browser is its single-threaded nature, which can cause
            the UI to become unresponsive during heavy computations or I/O operations. Suppose you need to develop a JSON
            Viewer with advanced data extraction and viewing capabilities, akin to SQL operations. This requires
            significant computational resources, potentially causing the browser to freeze. To address this challenge,
            we've developed TaskQueue.js, a versatile solution utilizing web workers to offload intensive tasks from the
            main UI thread.</p>
        <h2>How TaskQueue.js Works:</h2>
        <ol>
            <li>
                <strong>Add Tasks with Ease:</strong>
                <ul>
                    <li>Define a task by providing its name, function, and parameters.</li>
                    <li>Tasks are then added to a queue, awaiting execution by available workers.</li>
                </ul>
            </li>
            <li>
                <strong>Efficient Task Execution:</strong>
                <ul>
                    <li>Workers pick tasks from the queue sequentially, ensuring one task per worker at a time.</li>
                    <li>Priority tasks are always placed at the top of the queue, ensuring they are executed promptly.</li>
                </ul>
            </li>
        </ol>

        <h2>Sample Usage:</h2>
        <ul>
            <li>
                <strong>Synchronous Task:</strong>
                <ul>
                    <li><strong>Name:</strong> <code>add</code></li>
                    <li><strong>Function:</strong>
                        <pre>
                        <code style={codeStyle}>
                        function add(a, b) &#123;
                            return a + b;
                          &#125;
                    </code></pre>
                    </li>
                    <li><strong>Parameters:</strong> <code>1, 2</code></li>
                </ul>
            </li>
            <li>
                <strong>Asynchronous Task (API Call):</strong>
                <ul>
                    <li><strong>Name:</strong> <code>APICall</code></li>
                    <li><strong>Function:</strong>
                        <pre><code style={codeStyle}> async function api(priority)  &#123;
                            const url = 'https://dummyjson.com/products/'+priority;
                            const res = await fetch(url);
                            return res.json();
                            &#125;
                            </code>
                        </pre>
                    </li>
                    <li><strong>Parameters:</strong> <code>12</code></li>
                </ul>
            </li>
        </ul>

        <h2>Next Phase:</h2>
        <p>We are currently enhancing TaskQueue.js to dynamically scale based on workload. When all existing workers are
            occupied, new workers will be dynamically created to handle queued tasks, ensuring optimal task execution and
            responsiveness.</p>
        </div>
            <button style={{float:"right", height:"41px", width: "86px"}} onClick={()=>{
                setShowMore(prev => !prev);
            }}> Go back </button>
    </div>
        </div>
}
function WorkerProcess({status}){
    // add animation so that visualy show worker is doing something
    console.log(" stat +>",status.WorkerStatus);
    return <div className={`flex center border ${style.workerProcess}`}>
            <span>
               Current Process Details : { status.WorkerStatus == 'ideal' ? 'ideal':status.currentProcess.name}
            </span>
        </div>
}
function Output({status}){
    return <div className={`flexCol center boder flex-1 ${style.output}`}>
        <label>Output of Worker </label>
        <textarea value={JSON.stringify(status?.currentProcessOutput) ?? "" }></textarea>
    </div>
}
export default SingleWorker
