import { useState, useEffect } from 'react';
import { useItensDaLoja, useFavoritos, useSetFavoritos } from '../LoginContext.jsx';
import { Link } from 'react-router-dom';

function Catalog(props) {
    //fake data provisória
    const storeModel = useItensDaLoja();
    
    //lista de todos departamentos
    const [catalogList, setCatalogList] = useState([]);
    //nomes de classe repetidos são ignorados
    storeModel.forEach((item)=>{
        if (!catalogList.includes(item.class) /* && item.status==='promoção' */) {
            setCatalogList([...catalogList, item.class]);
        }
    })

    //lista de promoções
    const [catalogListPromo, setCatalogListPromo] = useState([]);
    //nomes de classe repetidos são ignorados
    storeModel.forEach((item)=>{
        if (!catalogListPromo.includes(item.class) && item.status==='promoção') {
            setCatalogListPromo([...catalogListPromo, item.class])
        }
    })

    //lista de mais comprados
    const [catalogMaisComprados, setCatalogMaisComprados] = useState([]);
    //nomes de classe repetidos são ignorados³
    storeModel.forEach((item)=>{
        if (!catalogMaisComprados.includes(item.class) && item.numDeCompras >= 1){
            setCatalogMaisComprados([...catalogMaisComprados, item.class])
        }
    })
    
    //qual sessão de compras está selecionada?
    const [selectedList, setSelectedList] = useState('TODOS')
    function filterList(e) {
        setSelectedList(e.target.innerHTML)
    }

    //favHeart
    const fav = useFavoritos();
    const setFav = useSetFavoritos();

    function favoritar(e, itemId){
        if (!fav.includes(itemId)){
            setFav((prevData)=>{
                return [
                    ...prevData, 
                    itemId
                ]
            });
        }
        e.target.style.transform = 'scale(0.9)';
        e.target.style.color = 'red';
    }
    
    function itemHtmlGenerator(item, index) {
        return (
            <Link key={index} to={item._id}>
            <div className="itemToBuy">
            <span onClick={(e)=>{e.preventDefault(); favoritar(e, item._id);}} className="favoriteHeart">♥</span>
            
            {
                item.status==='promoção'? <img className="promoHot" src="https://i.pinimg.com/originals/c8/cb/ff/c8cbffccee47e8d229aaf97f08cb1e2b.png" alt="hotPromo" />
                : null
            }
            
            <div className="productImgDiv">
              <img className="itemImg" src={item.productImg} alt="" />
            </div>
            <div className="productContent">
              <h4>{item.productTitle.length >= 66 ?
                item.productTitle.slice(0, 66)+'...':
                item.productTitle
              }</h4>
            </div>
            <div className="prices">
              <h2 className="price">R$ {item.productPrice}</h2>
              <h5 className="priceComplement">À vista no PIX</h5>
            </div>
              <div className="estoque">
                <p>({item.estoque} em estoque)</p>
              </div>
              {props.catalogIs==='mais comprados' ?
              <p className="numDeVendas">Vendido {item.numDeCompras} vezes</p>
              : null
              }
              
            </div></Link>
        )
    }
    //altura da bolinha do menu
    const [bolinhaHeight, setBolinhaHeight] = useState(139);
    //sempre que o menu voltar, a bolinha e a tag obviamente devem voltar pro inicial TODOS
    useEffect(() => {
        const topDoUl = document.querySelector('.classificações ul').getBoundingClientRect().top
        const topDoLi = document.querySelectorAll('.classificações ul li')[0].getBoundingClientRect().top
        setBolinhaHeight(topDoUl - topDoLi + 13)
        setSelectedList('TODOS')
    }, [props.catalogIs]);
    //tentando colocar as ultimas 20 compras aparecendo

    //colocar maiores numeros de compra do maior pro menor (organização)
    let maisCompradosPreco = []
    storeModel.forEach((item)=>{
        if (item.numDeCompras >= 1){
            maisCompradosPreco.push(item.numDeCompras)
        }
    })
    maisCompradosPreco.sort((a, b)=>{
        return b - a;
    });

    //mudar lugar da bolinha clicando nos menus e nao na ul õ_õ
    function bolinhaAltura(e){
        //só vai pegar se clicar no LI uwu
        if (e.target.constructor.name === 'HTMLLIElement'){
            setBolinhaHeight(Math.round(e.target.getBoundingClientRect().top - e.currentTarget.getBoundingClientRect().top + 13))
        }
    }

    return (
        <div className="itensCatalogo">
            <div className="bolinhaMenu" style={{top: bolinhaHeight + 'px'}}>
                <span>●</span>
            </div>
            <div className="classificações">
                <ul onClick={bolinhaAltura}>
                    <li onClick={filterList}>TODOS</li>
                    {   //render pra abas de todos departamentos
                        props.catalogIs==='normal' ?
                        catalogList.map((item, index)=>{
                            return <li className="liNormal" onClick={filterList} key={index} >{item}</li>
                        })
                        : props.catalogIs==='promoção' ?
                        //render pra abas de promoção
                        catalogListPromo.map((item, index)=>{
                            return props.catalogIs==='promoção' ?
                            <li onClick={filterList} key={index} >{item}</li>
                            : null
                        })
                        : props.catalogIs==='mais comprados' ?
                        catalogMaisComprados.map((item, index)=>{
                            return <li onClick={filterList} key={index} >{item}</li>
                        })
                        : null
                    }
                </ul>
            </div>
            <div className="ecommerceItensDiv">
                {props.catalogIs==='promoção'?
                storeModel.map((item, index)=>{
                    return item.status==='promoção' && item.class === selectedList?
                    //se estiver em promoção
                    itemHtmlGenerator(item, index)
                    //mostrar todos que estiverem em promoção
                    : selectedList === 'TODOS' && item.status==='promoção' ?
                    itemHtmlGenerator(item, index)
                    : null 
                })
                :props.catalogIs==='normal'?
                storeModel.map((item, index)=>{
                    return item.class === selectedList ?
                    //mostrar apenas itens de determinada classe
                    itemHtmlGenerator(item, index)
                    :
                    //mostrar todos itens
                    selectedList === 'TODOS' ?
                    itemHtmlGenerator(item, index)
                    : null
                })
                :props.catalogIs==='mais comprados' ?
                    maisCompradosPreco.map((item)=>{
                        return storeModel.map((itemZ, indexZ)=>{
                        return item === itemZ.numDeCompras ?
                            itemZ.class === selectedList ?
                            itemHtmlGenerator(itemZ, indexZ)
                            :
                            selectedList === 'TODOS' ?
                            itemHtmlGenerator(itemZ, indexZ)
                            : null
                        : null
                        })
                    })
                : null
                }
            </div>
        </div>
    )
}
export default Catalog;