import logo from './logo.svg';
import './App.css';
import ChatComponent from './ChatComponent'
import ApiCallAndREceiveProcessStatus from './components/ApiCallAndREceiveProcessStatus'
import TicTacToe from "../src/components/TicTacToe/TicTacToe";
import OnlineLudo from "../src/components/Ludo/OnlineLudo";
import CandyCrush from '../src/components/CandyCrush/CandyCrush';

function App() {
  return (
    <div className="App">
      {/* <ChatComponent /> */}
      {/* <ApiCallAndREceiveProcessStatus/> */}
      {/* <TicTacToe/> <LudoGame/>*/}
      
      <CandyCrush />
      
    </div>
  );
}
export default App;
