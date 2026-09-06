import './header.scss'
import logo from '../../assets/images/logo.avif'

export default function Header() {
    return(
        <header className='header'>
            <div className='logo'>
                <img src={logo} alt="Logo do Frei" />
                <h1>INSTITUTO SOCIAL
                    <br />
                    NOSSA SENHORA
                    <br /> 
                    DE FÁTIMA</h1>
            </div>
        </header>
    )
    
}