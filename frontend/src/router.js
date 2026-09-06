import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/home';
import Cadastramento from './pages/cadastramento';
import Pedidos from './pages/pedidos';
import Recebimento from "./pages/recebimento";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/cadastramento' element={<Cadastramento/>} />
                <Route path='/pedidos' element={<Pedidos/>} />
                <Route path='/recebimento/:id' element={<Recebimento/>} />
            </Routes>
        </BrowserRouter>
    )
    
}