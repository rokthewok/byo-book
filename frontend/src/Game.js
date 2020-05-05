import React from 'react';
import './Lobby.css';
import { withRouter } from 'react-router-dom';

class AdminArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewPrompt = this.handleNewPrompt.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleNewPrompt() {
    fetch('/pick-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({game_id: this.props.game_id})
    }).then(response => {
      if (!response.ok) {
        throw new Error("Couldn't pick a prompt FUCK YOU");
      }
      return response.json();
    }).then(resp_body => {
      // do nothing
    }).catch(error => {
      console.error(error);
    });
  }

  handleReset() {
    fetch('/reset-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({game_id: this.props.game_id})
    }).then(response => {
      if (!response.ok) {
        throw new Error("Couldn't reset game FUCK YOU");
      }
      return response.json();
    }).then(resp_body => {
      // do nothing
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className="AdminArea">
        <form onSubmit={this.handleNewPrompt}>
          <input className="button" type="submit" value="New Prompt" />
        </form>
        <form onSubmit={this.handleReset}>
          <input className="button" type="submit" value="Reset" />
        </form>
      </div>
    );
  }
}

class PromptArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="PromptArea">
        <h1>{this.props.prompt}</h1>
      </div>
    );
  }
}


class Countdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>{this.props.time}</h1>
    );
  }
}

class TimerArea extends React.Component {
  constructor(props) {
    super(props);
    this.onStartTimer = this.onStartTimer.bind(this);
  }

  onStartTimer(event) {
    event.preventDefault();
    fetch('/start-timer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({game_id: this.props.game_id})
    }).then(response => {
      if (!response.ok) {
        throw new Error('We goofed.');
      }
      return response.json();
    }).then(resp_body => {
      // we don't need to do nuffin.
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className="StartTimerButton">
        {this.props.remaining_time === null ?
          <form onSubmit={this.onStartTimer}>
            <input className="button" type="submit" value="Start Timer" />
          </form>
          :
          <Countdown time={this.props.remaining_time} />
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    console.log(this.props.match.params);
    this.refresh();
  }

  refresh() {
    fetch('/game-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({game_id: this.props.match.params.game_id})
      }).then(response => {
        if (!response.ok) {
          throw new Error("We couldn't update, shit");
        }
        return response.json();
      }).then(resp_body => {
        this.setState({
          game_id: resp_body.game_id,
          prompt: resp_body.prompt,
          remaining_time: resp_body.remaining_time
        });
        if (resp_body.is_admin === true) {
          this.setState({is_admin: true});
        }
      }).then(() => {
        setTimeout(() => { this.refresh(); }, 950);
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="Game-body">
        <div> 
          <PromptArea prompt={this.state.prompt} />
        </div>
        <div>
          <TimerArea remaining_time={this.state.remaining_time}
                     game_id={this.props.match.params.game_id} />
        </div>
        <div>
        {this.state.is_admin &&
          <AdminArea game_id={this.props.match.params.game_id} />
        }
        </div>
        <div />
      </div>
    );
  }
}

export default withRouter(Game);
