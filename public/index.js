import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './index.css';
import MainComponent from './product-list-component'
class App extends React.Component {
    render() {
        return (
            <Container>
                <header class="jumbotron">
                    <h1>Products Grid</h1>
                    <p>Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our
            selection of ascii faces in an exciting range of sizes and prices.</p>
                </header>
                <MainComponent />
            </Container>

        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))