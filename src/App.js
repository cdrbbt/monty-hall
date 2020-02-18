import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.gameSetUp(3)
    this.state = {
      selectedDoor: null,
      otherDoor: null,
      gameState: 0,
      switch: false,
      win: false,
      switchGames: 0,
      stayGames: 0,
      switchWin: 0,
      stayWin: 0
    }
  }

  gameSetUp(numberOfDoors) {
    this.numberOfDoors = numberOfDoors
    this.prize = Math.floor(Math.random() * numberOfDoors)
  }

  resetGame = () => {
    this.gameSetUp(this.numberOfDoors);
    const blankState = {
      selectedFoor:null,
      otherDoor: null,
      gameState: 0,
      switch:false,
      win:false
    }
    this.setState(blankState)
  }

  generateInstructions() {
    switch (this.state.gameState) {
      case 0: return "Choose a door! Afterwards all of the other doors except one will be revealed."
      case 1: return "You may keep your initial choice or switch."
      case 2: return this.state.win ? "Congratulations you won!" : "Unfortunately it was the wrong door"
      default: return "Something went horribly wrong"
    }
  }



  //Generates callback for initial door selection
  selectFirstDoor = (door) => {
    return () => {
      console.log(door)
      let otherDoor
      if (door === this.prize) {
        let i = Math.floor(Math.random() * (this.numberOfDoors - 1))
        otherDoor = i < door ? i : i + 1
      } else {
        otherDoor = this.prize
      }
      this.setState({ selectedDoor: door, gameState: 1, otherDoor })
    }
  }

  //Generate callback for switch or stay choice
  selectSecondDoor = (door) => {
    return () => {
      const newState = {}
      newState.win = (door === this.prize)
      if (door === this.state.selectedDoor) {
        newState.stayGames = this.state.stayGames + 1
        if (newState.win) newState.stayWin = this.state.stayWin +1
      } else {
        newState.switchGames = this.state.switchGames + 1
        if (newState.win) newState.switchWin = this.state.switchWin +1
      }
      newState.gameState = 2
      this.setState(newState)
    }
  }

  //Creates an array of doors with the same state
  uniformDoors(callback, open) {
    const doors = []
    for (let i = 0; i < this.numberOfDoors; i++) {
      doors.push(<Door num={i} onClick={callback(i)} key={i} open={open} />)
    }
    return doors
  }

  generateDoors = () => {
    switch (this.state.gameState) {
      case 0: return this.uniformDoors(this.selectFirstDoor, false)
      case 1: return this.generateDoorsSecondChoice()
      case 2: return this.generateDoorsGameEnd()
      default:
    }
  }

  generateDoorsSecondChoice = () => {
    let doors = this.uniformDoors(()=>null, true)
    doors[this.state.selectedDoor] = <Door 
    onClick={this.selectSecondDoor(this.state.selectedDoor)}
    key={this.state.selectedDoor}
    num={this.state.selectedDoor}
    open={false}/>

    doors[this.state.otherDoor] = <Door 
    onClick={this.selectSecondDoor(this.state.otherDoor)}
    key={this.state.otherDoor}
    num={this.state.otherDoor}
    open={false}/>

    return doors
  }

  generateDoorsGameEnd = () => {
    let doors = this.uniformDoors(()=>null, true)
    doors[this.prize] = <Door 
    key={this.prize}
    num={this.prize}
    open={false}/>
    return doors
  }

  render() {
    const doors = this.generateDoors()
    return (
      <div>
        <h1>The Monty Hall Game</h1>
        <p>{this.generateInstructions()}</p>
        <button onClick={this.resetGame}>Reset</button>
        {doors}
      </div>
    )
  }
}


class Door extends React.Component {
  render() {
    return (
      <div className={this.props.open? "open": "closed"}>
        <button onClick={this.props.onClick}>{this.props.num}</button>
      </div>
    )
  }
}

class GameOptions extends React.Component {

}

export default App;
