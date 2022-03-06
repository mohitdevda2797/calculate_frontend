import './App.css';
import Navbar from "./components/Navbar";
import Operation from "./components/Operation";
import OperationsList from "./components/OperationsList";
import {useEffect, useState} from "react";
import axios from "axios";

const url = 'http://127.0.0.1:8000/operations'

function App() {
    const [operations, setOperations] = useState([])

    const fetchData = async () => {
        const {data} = await axios.get(url)
        console.log(data)
        setOperations(data)
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <Navbar/>
            <div className='my-4 mx-8 flex flex-col gap-4'>
                <div><Operation operations={operations}/></div>
                <div><OperationsList operations={operations} setOperations={setOperations} fetchData={fetchData}/></div>
            </div>
        </>
    );
}

export default App;
