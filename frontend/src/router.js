import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/home';
import Cadastramento from './pages/cadastramento';
import Pedidos from './pages/pedidos';
import Recebimento from "./pages/recebimento";
import Admin from './pages/admin';
import ProtectedRoute from './components/auth/protectedRoute';
import Fim from './pages/fim';
import NotFound from './pages/notFound';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/cadastramento' element={<Cadastramento/>} />
                <Route element={<ProtectedRoute />}>
                    <Route path='/pedidos' element={<Pedidos/>} />
                    <Route path='/recebimento/:id' element={<Recebimento/>} />
                    <Route path='/finalizado' element={<Fim />} />
                </Route>
                <Route path='/admin' element={<Admin />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
    
}
