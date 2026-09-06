import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/home';
import Cadastramento from './pages/cadastramento';
import Pedidos from './pages/pedidos';
import Recebimento from "./pages/recebimento";
import Admin from './pages/admin';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/cadastramento' element={<Cadastramento/>} />
                <Route path='/pedidos' element={<Pedidos/>} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/recebimento/:id' element={<Recebimento/>} />
            </Routes>
        </BrowserRouter>
    )
    
}