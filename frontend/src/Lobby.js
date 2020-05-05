import React from 'react';
import './Lobby.css';
import { withRouter } from 'react-router-dom';

class CreateGameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {gameNameInput: ''};
    this.handleChangeGameNameInput = this.handleChangeGameNameInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeGameNameInput(event) {
    this.setState({gameNameInput: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.gameNameInput !== '') {
      fetch('/make-game', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({game_id: this.state.gameNameInput})})
        .then(response => {
          if (!response.ok) {
            throw new Error('We dun goofed.');
          }
          return response.json();
        }).then(resp_body => {
          console.log(resp_body)
          let game_id = resp_body.game_id;
          this.props.history.push(''.concat('/', game_id));
        }).catch(error => {
          console.error('FUCK');
          console.error(error);
        });
    }
  }

  render() {
    return (
      <div className="Lobby-form">
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.gameNameInput}
              onChange={this.handleChangeGameNameInput} />
        <input className="button" type="submit" value="Create Game" />
      </form>
      </div>
      );
  }
}

class Lobby extends React.Component {

  render() {
    return (
      <div className="Lobby-body">
        <div className="Lobby-header">
          <h1>Bring Your Own Book</h1>
        </div>
        <div />
          <CreateGameForm history={this.props.history}/>
        <div />
      </div>
    );
  }
}

export default withRouter(Lobby);
