import * as React from 'react';
//import * as ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import DeckApp from "./xfDeck";

class App extends React.Component {
    componentDidMount(){
      api.send("toMain", "My custom Message")
    }

    render() {
      return (
      <div>
        <DeckApp/>
      </div>

      )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <App></App>
    </div>
  </React.StrictMode>
);

