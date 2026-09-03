import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/home';
import Cadastramento from './pages/cadastramento';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/cadastramento' element={<Cadastramento/>} />
            </Routes>
        </BrowserRouter>
    )
    
}