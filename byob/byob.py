from flask import Flask, request, make_response
import byob.board


app = Flask(__name__)
games = dict()


@app.route('/make-game', methods=['POST'])
def make_game():
    data = request.json()
    game_id = data['game_id']
    games[game_id] = byob.board.Game(game_id)
    game = games[game_id]
    return make_response(game.get_state())


@app.route('/game-state', methods=['POST'])
def game_state():
    data = request.json()
    game_id = data['game_id']
    game = games[game_id]
    return make_response(game.get_state())


@app.route('/start-timer', methods=['POST'])
def start_timer():
    data = request.json()
    game_id = data['game_id']
    game = games[game_id]
    game.start_timer()
    return make_response({})


@app.route('/pick-prompt', methods=['POST'])
def pick_prompt():
    data = request.json()
    game_id = data['game_id']
    game = games[game_id]
    game.pick_prompt()
    return make_response({})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html')


def get_rules():
    return \
      """
      Classic Rules
      =============

      If you’ve never played before,
      the Classic rule set is the perfect
      place to start.

      SETUP: Everyone has a book
      and sits in a circle. The cards are
      placed face-down in the middle.
      The starting player should also
      have a 1-minute timer.

      GOAL: Get four cards (with 6-8
      players) or five cards (with 3-5).

      PICKING: The starting player
      takes the top card off the deck,
      picks a prompt, and reads it
      aloud.

      SEEKING: Everyone except the
      Picker searches their book for
      text to match the prompt.
      They're seeking for sequential
      text of any length: a single word,
      half of a sentence, a whole
      sentence, multiple sentences.

      TIMER: The first Seeker to find
      matching text announces "I've
      got it," which starts the timer.

      READING: When the timer runs
      out (or every Seeker announces
      "I've got it"), each Seeker reads
      what they’ve found. Seekers who
      didn't find text in time open to a
      random page and read a random
      sentence from it.

      JUDGING: The Picker chooses
      their favorite submission and
      awards that Reader the card.

      ROTATION: After each round,
      the person to the left of the last
      Picker starts the next round.
      ALSO, every time any player
      reaches three cards, everyone
      passes their book one to the left.
      """
