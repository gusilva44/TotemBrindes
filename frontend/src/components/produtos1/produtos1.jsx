import './produtos1.scss'
import { produtos } from '../../data/produtos'

export default function Amostra (){
    return(
        <div className="amostra">
            <div className="imgs">
                <img src={produtos[0].img} alt="Chaveiro" />
                <img src={produtos[1].img} alt="Imã de Geladeira" />
            </div>
            <div className="imgs">
                <img src={produtos[2].img} alt="Figurinha de Software" />
                <img src={produtos[3].img} alt="Figurinhas de Hardware " />
            </div>
        </div>
    )
}