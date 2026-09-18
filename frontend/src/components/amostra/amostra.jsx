import './amostra.scss'

export default function Amostra({ produtos }){
    return(
        <div className="amostra">
            <div className="imgs">
                <img src={produtos[0]?.imagem} alt={produtos[0].nome} />
                <img src={produtos[1]?.imagem} alt={produtos[1].nome} />
            </div>
            <div className="imgs">
                <img src={produtos[2]?.imagem} alt={produtos[2].nome} />
                <img src={produtos[3]?.imagem} alt={produtos[3].nome} />
            </div>
        </div>
    )
}