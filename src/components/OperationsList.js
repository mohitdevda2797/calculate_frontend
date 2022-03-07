import {useRef, useState} from "react";
import axios from "axios";
import {MdDelete, MdEdit, MdCancel} from "react-icons/md";
import {BsInfoCircleFill} from "react-icons/bs";

const url = 'http://127.0.0.1:8000/operations/'

const columns = [
    {field: 'id', headerName: 'ID'},
    {field: 'operation_name', headerName: 'Name'},
    {field: 'argument_type', headerName: 'Arguments Type'},
    {field: 'number_of_arguments', headerName: 'Number of Arguments'},
    {field: 'example_text', headerName: 'Example Text'},
]

export default function OperationsList({operations, fetchData}) {
    const formRef = useRef();
    const [isUpdate, setIsUpdate] = useState(false)
    const [idForUpdate, setIdForUpdate] = useState(null);

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className='border border-gray-400 rounded p-4 col-span-3 md:col-span-1'>
                    <OperationForm fetchData={fetchData} formRef={formRef}
                                   isUpdate={isUpdate} setIsUpdate={setIsUpdate} idForUpdate={idForUpdate}/>
                </div>
                <div className='border border-gray-400 rounded p-4 col-span-3 md:col-span-2 overflow-auto'>
                    <OperationsTable operations={operations} fetchData={fetchData} formRef={formRef} isUpdate={isUpdate}
                                     setIsUpdate={setIsUpdate} setIdForUpdate={setIdForUpdate}/>
                </div>
            </div>
        </>
    )
}

const OperationsTable = ({operations, fetchData, formRef, setIsUpdate, setIdForUpdate}) => {
    const handleDelete = async (id) => {
        try {
            await axios.delete(url + String(id))
            fetchData()
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = async (id) => {
        console.log(formRef.current[1])
        console.log(formRef)
        try {
            const {data} = await axios.get(url + String(id))
            console.log(data)

            setIsUpdate(true);
            setIdForUpdate(id);

            for (let i = 0; i < 5; i++) {
                const elem = formRef.current[i]
                elem.value = data[elem.name]
            }
            formRef.current[1].value = 'number'
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='text-2xl font-semibold mb-4'>Operations Table</div>
            <table>
                <thead>
                <tr>
                    {columns.map(({headerName}) => <th key={headerName}>{headerName}</th>)}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {operations.length !== 0 && operations.map((row, index) => {
                    return (
                        <tr key={index}>
                            {columns.map(({field}, index) => <td key={index}>{row[field]}</td>)}
                            <td>
                                <button className='text-orange-400 px-2' title='Edit Operation'
                                        onClick={() => handleEdit(row.id)}><MdEdit/></button>
                                <button className='text-red-600 px-2' title='Delete Operation'
                                        onClick={() => handleDelete(row.id)}><MdDelete/></button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
    )
}

const OperationForm = ({fetchData, formRef, isUpdate, setIsUpdate, idForUpdate}) => {
    const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const requestData = {}
        for (let [key, value] of formData.entries()) {
            requestData[key] = value;
        }
        console.log(requestData)

        try {
            const {data} = isUpdate ? await axios.put(url + String(idForUpdate) + '/', requestData) : await axios.post(url, requestData)
            console.log(data)

            setIsUpdate(false);
            fetchData();

            formRef.current.reset();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className='flex items-center'>
                <div className='text-2xl font-semibold'>Operation Data</div>
                <div className='flex px-2'>
                    ({isUpdate ?
                    <div className='flex items-center'>
                        <div className="pr-1">Update</div>
                        <MdCancel onClick={() => {
                            setIsUpdate(false);
                            formRef.current.reset();
                        }}/></div> :
                    'Create'})
                </div>
            </div>
            <div className="flex flex-col bg-blue-500 text-white text-sm font-bold px-3 py-3 rounded my-4"
                 role="alert">
                <div className="flex items-center gap-2 mb-1">
                    <BsInfoCircleFill/>
                    Instructions:
                </div>
                <ul className="list-disc ml-4">
                    <li>Code should have a function named 'op'.</li>
                    <li>It should return a single value.</li>
                    <li>Function should accept args as the single argument and args values can be used inside
                        function body.
                    </li>
                </ul>
            </div>
            <form onSubmit={handleForm} ref={formRef}>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='operation_name'>Operation Name</label>
                        <input className='rounded h-10 border-gray-400' type='text' id='operation_name'
                               name='operation_name' required/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='argument_type'>Arguments Type</label>
                        <select className='rounded h-10 border-gray-400' id='argument_type'
                                name='argument_type' required>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                        </select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='number_of_arguments'>Number of Arguments</label>
                        <input className='rounded h-10 border-gray-400' defaultValue={1} min={1} max={10} type='number'
                               id='number_of_arguments'
                               name='number_of_arguments' required/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='example_text'>Example Text</label>
                        <input className='rounded h-10 border-gray-400' type='text' id='example_text'
                               name='example_text' required/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='example_text'>Operation Code</label>
                        <textarea className='rounded border-gray-400' id='operation_code'
                                  name='operation_code' rows={5} required/>
                    </div>
                    <button className='py-2 px-4 bg-blue-400 rounded hover:bg-blue-500'
                            type='submit'>Submit
                    </button>
                </div>
            </form>
        </>
    )
}