import {Component} from 'react';
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/errorBoundary';

import decoration from '../../resources/img/vision.png';

class App extends Component {
    //поднимаем состояния чарлиста
    state ={
        selectedChar: null
    }
    //метод для установки свойства состояния через аргумент
    onCharSelected = (id) =>{
        this.setState({
            selectedChar: id
        })
    }
   render() {
    return (
        <div className="app">
            <AppHeader/>
            <main>
                <ErrorBoundary>
                    <RandomChar/>
                </ErrorBoundary>
                <div className="char__content">
                    {/* из CharList прийдет айдишник и установится в стейт app */}
                    <ErrorBoundary>
                        <CharList onCharSelected={this.onCharSelected}/>
                    </ErrorBoundary>
                    {/* дальше передастся в CharInfo */}
                    <ErrorBoundary>
                        <CharInfo charId={this.state.selectedChar}/>
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )
   }
}

export default App;