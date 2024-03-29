import { useGlobalContext } from '../GlobalContext.jsx';
import { Link } from 'react-router-dom';
import Footer from './Footer.jsx';

function Historico() {
  const { itensDaLoja, isLoggedIn, comprasDoUser } = useGlobalContext();

  return (
    <div>
      <div className='favoritados historicoItens'>
        <h1 className='favTitle'>Meus pedidos ⌛</h1>
        {!isLoggedIn ? (
          <div className='ifNotLogged'>
            <h2>Você precisa logar para acessar essa página.</h2>
            <h4>
              <Link to='/login'>Login/Register</Link>
            </h4>
          </div>
        ) : isLoggedIn === true && comprasDoUser.length > 0 ? (
          comprasDoUser
            .map((compra, index) => {
              return (
                <div key={index} className='historicoLista'>
                  <h3>
                    Data e horário da compra: {compra.detalhes.dataDaCompra}
                  </h3>

                  {compra.itens.map((itemToPost, indexToPost) => {
                    return (
                      <div key={indexToPost}>
                        {itensDaLoja.map((readyToPost, readyIndex) => {
                          return readyToPost._id === itemToPost._id ? (
                            <Link
                              key={readyIndex}
                              className='linkLindo'
                              to={'/' + readyToPost._id}
                            >
                              <div className='readyItem'>
                                <div className='imgBox v2'>
                                  <img
                                    className='img'
                                    src={readyToPost.productImg}
                                    alt=''
                                  />
                                </div>
                                <div className='descri'>
                                  <h2>{readyToPost.productTitle}</h2>
                                </div>
                                <h4>Quantidade: {itemToPost.quantidade}</h4>
                                <h4 className='segundaInfo'>
                                  Preço por unidade: {itemToPost.preco} R$
                                </h4>
                              </div>
                            </Link>
                          ) : null;
                        })}
                      </div>
                    );
                  })}

                  <h1 className='precoTotalHist'>
                    Preço total:{' '}
                    {compra.detalhes.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                    .
                  </h1>
                </div>
              );
            })
            .reverse()
        ) : isLoggedIn === true && comprasDoUser.length === 0 ? (
          <div className='ifNotLogged'>
            <h2>Parece que você ainda não comprou nada.</h2>
            <h4>
              Aproveite e encomende seus itens preferidos através da{' '}
              <Link to='/'>página principal</Link>
            </h4>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}
export default Historico;
