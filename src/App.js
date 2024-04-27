import './App.css'; 
import { ServiceWorker } from "./pages/serviceWorker"
import SingleWorker from './pages/singleWorker';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return  (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<ServiceWorker/>} />
                <Route path="/singleWorker" element={<SingleWorker/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
