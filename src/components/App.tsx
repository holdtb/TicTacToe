import React from 'react';
import TicTacToe, { GameStore } from './TicTacToe';

const App: React.FC = () => {
  return <TicTacToe store={new GameStore()} />;
};

export default App;
