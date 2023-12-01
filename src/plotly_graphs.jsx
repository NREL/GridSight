import * as React from 'react';
//import * as ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import PlotlyApp from "./PlotlyApp";


class App extends React.Component {
    render() {
      return (
        <PlotlyApp></PlotlyApp>
      )
    }
}





const root = ReactDOM.createRoot(document.getElementById('plotly_root'));
root.render(
  <React.StrictMode>
    <div>
      <App></App>
    </div>
  </React.StrictMode>
);
