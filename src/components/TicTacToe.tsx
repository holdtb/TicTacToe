import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Button, Grid, Container } from 'semantic-ui-react';

type Props = { store: GameStore };
type State = {};

@observer
export default class TicTacToe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleResetButton = this.handleResetButton.bind(this);
  }

  _createBoard(board: GameBoard) {
    const rows = board.map((row: Dimension, rowIndex: number) => {
      const cols = row.map((cell, colIndex) => (
        <Grid.Column key={colIndex}>
          <div
            onClick={() => {
              this.props.store.move({ row: rowIndex, col: colIndex });
            }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100px',
              fontSize: '30px',
              cursor: cell.occupant ? 'not-allowed' : 'pointer',
            }}>
            {cell.occupant && cell.occupant.displayValue}
          </div>
        </Grid.Column>
      ));
      return <Grid.Row key={rowIndex}>{cols}</Grid.Row>;
    });
    return (
      <Grid style={{ maxWidth: 400 }} columns={3} celled='internally'>
        {rows}
      </Grid>
    );
  }

  handleResetButton() {
    this.props.store.reset();
  }

  render() {
    return (
      <Container>
        <Button content='reset' onClick={this.handleResetButton} />
        <Grid>
          <Grid.Row>
            <Grid.Column>
              Current player: {this.props.store.currentPlayer.name} (
              {this.props.store.currentPlayer.displayValue}'s)
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this._createBoard(this.props.store.board)}
      </Container>
    );
  }
}

export class GameStore {
  @observable board: GameBoard;
  @observable playerOne: Player;
  @observable playerTwo: Player;

  @observable currentPlayer: Player;

  constructor() {
    this.board = [
      [{ occupant: undefined }, { occupant: undefined }, { occupant: undefined }],
      [{ occupant: undefined }, { occupant: undefined }, { occupant: undefined }],
      [{ occupant: undefined }, { occupant: undefined }, { occupant: undefined }],
    ];
    this.playerOne = { name: 'One', displayValue: 'X' };
    this.playerTwo = { name: 'Two', displayValue: 'O' };
    this.currentPlayer = this.playerOne;
  }

  private checkForRow(move: Move) {
    const row = this.board[move.row];
    return (
      row[0].occupant === this.currentPlayer &&
      row[1].occupant === this.currentPlayer &&
      row[2].occupant === this.currentPlayer
    );
  }

  private checkForCol(move: Move) {
    return (
      this.board[0][move.col].occupant === this.currentPlayer &&
      this.board[1][move.col].occupant === this.currentPlayer &&
      this.board[2][move.col].occupant === this.currentPlayer
    );
  }

  private checkForDiag() {
    return (
      this.board[2][0].occupant === this.currentPlayer &&
      this.board[1][1].occupant === this.currentPlayer &&
      this.board[0][2].occupant === this.currentPlayer
    );
  }

  private checkForRevDiag() {
    return (
      this.board[0][0].occupant === this.currentPlayer &&
      this.board[1][1].occupant === this.currentPlayer &&
      this.board[2][2].occupant === this.currentPlayer
    );
  }

  private checkForWin(move: Move): boolean {
    return (
      this.checkForRow(move) ||
      this.checkForCol(move) ||
      this.checkForDiag() ||
      this.checkForRevDiag()
    );
  }

  private checkForDraw(): boolean {
    return this.board.every(row =>
      row.every(col => {
        return col.occupant;
      })
    );
  }

  @action private switchCurrentPlayer() {
    if (this.currentPlayer == this.playerOne) {
      this.currentPlayer = this.playerTwo;
    } else {
      this.currentPlayer = this.playerOne;
    }
  }

  @action move(move: Move) {
    const cell = this.board[move.row][move.col];

    if (cell.occupant !== undefined) {
      return;
    } else {
      cell.occupant = this.currentPlayer;
    }

    if (this.checkForWin(move)) {
      alert(`Player ${this.currentPlayer.name} wins!`);
      this.reset();
    } else if (this.checkForDraw()) {
      alert(`It's a draw!`);
      this.reset();
    } else {
      this.switchCurrentPlayer();
    }
  }

  @action reset() {
    this.board = [
      [{ occupant: undefined }, { occupant: undefined }, { occupant: undefined }],
      [{ occupant: undefined }, { occupant: undefined }, { occupant: undefined }],
      [{ occupant: undefined }, { occupant: undefined }, { occupant: undefined }],
    ];
  }
}

type Player = {
  name: string;
  displayValue: string;
};

type Cell = {
  occupant: Player | undefined;
};

type Move = {
  row: number;
  col: number;
};

type GameBoard = ArrayFixed<Dimension, 3>;
type Dimension = ArrayFixed<Cell, 3>;
type ArrayFixed<T, L extends number> = [T, ...Array<T>] & { length: L };
