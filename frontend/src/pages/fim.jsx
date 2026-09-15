import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header/header';
import { encerrarSessao } from '../auth/session';
import '../css/fim.scss';

export default function Fim() {
    const navigate = useNavigate();
    const location = useLocation();
    const cliente = location.state?.cliente || 'cliente';

    useEffect(() => {
        const redirecionamento = setTimeout(() => {
            encerrarSessao();
            navigate('/', { replace: true });
        }, 15000);

        return () => clearTimeout(redirecionamento);
    }, [navigate]);

    function voltarInicio() {
        encerrarSessao();
        navigate('/', { replace: true });
    }

    return (
        <div className="page-fim">
            <Header />
            <main className="mensagem-final">
                <h1>Obrigado, <span className='cliente3'>{cliente}</span>, pela preferência!</h1>
                <p>Volte sempre.</p>
                <span className='msg'>Você voltará ao início em instantes.</span>
                <button type="button" onClick={voltarInicio}>
                    VOLTAR AO INÍCIO
                </button>
            </main>
        </div>
    );
}
