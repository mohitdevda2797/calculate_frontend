import {useState} from "react";
import axios from "axios";

const executeUrl = 'http://127.0.0.1:8000/execute-operation/'

export default function Operation({operations}) {
    const [selectedOperation, setSelectedOperation] = useState(-1)
    const [result, setResult] = useState(0)

    const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const args = []
        for (let value of formData.values()) {
            args.push(isNaN(value) ? value : parseFloat(value));
        }
        try {
            const {data} = await axios.post(executeUrl, {id: operations[selectedOperation].id, args: args})
            setResult(data.result)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <select className='w-full rounded border-gray-400 my-2' name="operation" id="operation"
                    value={selectedOperation}
                    onChange={(e) => setSelectedOperation(parseInt(e.target.value))}>
                <option value={-1}>Select Operation</option>
                {operations.map(({id, operation_name: op}, index) => (<option key={id} value={index}>{op}</option>))}
            </select>
            <div className="w-full p-4 border border-gray-400 rounded">
                <div className="text-2xl">
                    Arguments
                    {selectedOperation !== -1 && <span className='pl-2 text-lg text-blue-500'>({operations[selectedOperation].example_text})</span>}</div>
                <div className="mt-6">
                    {selectedOperation === -1 ?
                        <div className='text-yellow-600 text-lg'>Select any operation to continue!</div> :
                        <>
                            <form onSubmit={handleForm}>
                                <div className='flex flex-wrap gap-4'>
                                    <Arguments number={operations[selectedOperation].number_of_arguments}
                                               type={operations[selectedOperation].argument_type}/>
                                </div>
                                <button className='my-4 py-2 px-4 bg-blue-400 rounded hover:bg-blue-500'
                                        type='submit'>Submit</button>
                            </form>
                            <div className='text-2xl'>Result: {result}</div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

const Arguments = ({number, type}) => {
    const args = []
    for (let i = 1; i < number + 1; i++) {
        args.push(
            <div className='flex flex-col gap-2' key={i}>
                <label htmlFor={`arg${i}`}>Argument {i}</label>
                <input className='rounded h-10 border-gray-400' type={type} step="0.01" id={`arg${i}`}
                       name={`arg${i}`} required/>
            </div>
        )
    }
    return args;
}