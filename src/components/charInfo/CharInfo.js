import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';



class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount(){
        this.updateChar();
    }
    componentDidUpdate(prevProps, prevState){
        //елсибы было просто без условия this.updateChar(); мы бы попали в бесконечный цикл пропсов и было бы создано много запросов подряд
        //в таком случае пропс не будет уходить если клиент будет нажимать на одну и ту же карточку персонажа
        //по такой же схеме можно сравнивать стейты
       if(this.props.charId !== prevProps.charId){
            this.updateChar();
       } 
    }

    updateChar = () =>{
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();
        
        this.marvelService
            .getCharacter(charId)
            //вызовится когда придет ответ от сервиса придет в нашу функцию и запишется в состояние
            .then(this.onCharLoaded)
            .catch(this.onError);
        
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false})
    }

    onCharLoading = () =>{
        this.setState({
            loading: true
        })
    }

    onError = () =>{
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state;

        //если не загрузка и не ошибка отображаем скелетон
        const skeleton = char || loading || error ? null : <Skeleton/>;
        //
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) =>{
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return(
        <>
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null: 'Sorry =( There are no comics with this character!!'}
                    {
                        comics.map((item, i) => {
                            //не использовать если приходит много елементов
                            if (i>10) return;
                            //
                            return(
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        })
                    }
                    
                    
                </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;