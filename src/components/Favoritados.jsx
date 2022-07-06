import NavBar from './NavBar.jsx';
//trocar pelo context certo que vou fazer
import { useItensDaLoja, useFavoritos, useSetFavoritos, useSetCarrinhoItens, useCarrinhoItens } from '../LoginContext.jsx';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Favoritados(){
    const todosItens = useItensDaLoja();
    const fav = useFavoritos();
    const setFav = useSetFavoritos();
    const carrinhoItens = useCarrinhoItens();
    const setCarrinhoItens = useSetCarrinhoItens();
    
    //efeitos nos botoes
    useEffect(() => {
        const botaoAnimation = document.querySelectorAll('.favButComum');
        botaoAnimation.forEach((item)=>{
            item.addEventListener('mousedown', ()=>{
                item.style.transform = 'scale(0.97)';
            });
            document.addEventListener('mouseup', ()=>{
                item.style.transform = 'scale(1)';
            });
        });
    }, [carrinhoItens]);

    //deletar favoritos
    function favDelete(e){
        const idToDelete = e.currentTarget.name;
            setFav(
                fav.filter((item)=>{
                    return item !== idToDelete
            })
        );
    }
    //copiar item para o carrinho

    function favToCart(e){
        const itemId = e.currentTarget.name;
        
        setCarrinhoItens((prevItens)=>{
            const carFilter = prevItens.filter((item)=>{
                return item._id !== itemId
            })
            return [...carFilter, { _id: itemId, quantidade: 1 }]
        })
        e.currentTarget.style.background = 'grey';
        e.currentTarget.innerText = 'Sucess!';
    }

    return (
        <div>
            <NavBar />
            <div className="favoritados">
                <h1 className="favTitle">Favoritos ❤️</h1>
                    
                    {   
                        fav.length >= 1 ? 
                            todosItens.map((item, index)=>{
                                return (
                                    fav.includes(item._id)?
                                    <div key={index} className="listaDeItens">
                                        <div className="favButtons">
                                            <button name={item._id} onClick={favDelete} className="favExcluir favButComum">
                                                Excluir dos favoritos
                                            </button>
                                            <button name={item._id} onClick={
                                                (e)=>{
                                                    favToCart(e); 
                                                }
                                            } className="favAddCart favButComum">
                                                <h5>Colocar no carrinho</h5>
                                            </button>
                                        </div>
                                                
                                        <div className="item">
                                            <div className="imgBox">
                                                <img className="img" src={item.productImg} alt="" />
                                            </div>
                                            <div className="descri">
                                                <h5 className="desH5">{
                                                    item.productTitle.length >= 48 ?
                                                    item.productTitle.slice(0, 48) + '...'
                                                    : item.productTitle.slice(0, 48)
                                                    }</h5>
                                                <h5 className="price">{item.productPrice}</h5>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                )
                            })
                        : 
                        <div className="ifNotLogged">
                            <h2>Parece que você ainda não favoritou nenhum item.</h2>
                            <h4>Aproveite e favorite seus itens preferidos através da <Link to="/">página principal</Link></h4>
                        </div>
                    }
                
            </div>
        </div>
    )
}
export default Favoritados;