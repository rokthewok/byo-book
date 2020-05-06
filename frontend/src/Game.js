import React from 'react';
import './Game.css';
import { withRouter } from 'react-router-dom';

class AdminArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewPrompt = this.handleNewPrompt.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleNewPrompt(event) {
    event.preventDefault();
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

  handleReset(event) {
    event.preventDefault();
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
    this.state = {remaining_time: undefined};
    this.countdown = this.countdown.bind(this);
    if (this.props.timer_timestamp !== null &&
          this.props.timer_timestamp !== undefined) {
      this.startTimer();
    }
  }

  startTimer() {
    this.timer = setInterval(this.countdown, 10);
  }

  countdown() {
    let remaining_time = 30000 - (Date.now() - this.props.timer_timestamp);
    if (remaining_time < 0) {
      this.setState({remaining_time: (0.00).toFixed(2)});
      clearInterval(this.timer);
    } else {
      this.setState({'remaining_time': (remaining_time / 1000.0).toFixed(2)});
    }
  }

  render() {
    return (
      <h1 className="timer">{this.state.remaining_time}</h1>
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
      <div className="TimerArea">
        {this.props.timer_timestamp === null ?
          <form onSubmit={this.onStartTimer}>
            <input className="button" type="submit" value="Start Timer" />
          </form>
          :
          <Countdown timer_timestamp={this.props.timer_timestamp} />
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
        console.log(JSON.stringify(resp_body));
        this.setState({
          game_id: resp_body.game_id,
          prompt: resp_body.prompt,
          timer_timestamp: resp_body.timer_timestamp
        });
        if (resp_body.is_admin === true) {
          this.setState({is_admin: true});
        }
      }).then(() => {
        setTimeout(() => { this.refresh(); }, 750);
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="Game-body">
        <PromptArea prompt={this.state.prompt} />
        <TimerArea timer_timestamp={this.state.timer_timestamp}
                   game_id={this.props.match.params.game_id} />
        {this.state.is_admin &&
          <AdminArea game_id={this.props.match.params.game_id} />
        }
      </div>
    );
  }
}

export default withRouter(Game);
