interface ButtonProps {
  count: number;
  text: string;
  priority: number;
  queue:any;
}


export function Button(props: ButtonProps): JSX.Element{
    // Worker decide
    const {count,text,priority,queue} = {...props};
    return <div>
        <button> {text} {count} </button>
    </div>
}
