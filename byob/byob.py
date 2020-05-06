from flask import request, make_response, render_template, session, Blueprint
import byob.board


game_blueprint = Blueprint('byob', __name__)
games = dict()


@game_blueprint.route('/health', methods=['GET'])
def health_check():
    return make_response({})


@game_blueprint.route('/make-game', methods=['POST'])
def make_game():
    print(request)
    data = request.json
    game_id = data['game_id']
    if game_id in games:
      return make_response(
          {'message': 'game_id "{}" already exists.'.format(game_id)},
            400)
    games[game_id] = byob.board.Game(game_id)
    game = games[game_id]
    session['game_id'] = game_id
    print('made game {}'.format(game.get_state()))
    return make_response(game.get_state())


@game_blueprint.route('/game-state', methods=['POST'])
def game_state():
    data = request.json
    game_id = data['game_id']
    game = games[game_id]
    state = game.get_state()
    if session.get('game_id') is not None and session['game_id'] == game_id:
        state['is_admin'] = True
    return make_response(state)


@game_blueprint.route('/start-timer', methods=['POST'])
def start_timer():
    data = request.json
    game_id = data['game_id']
    game = games[game_id]
    game.start_timer()
    return make_response({})


@game_blueprint.route('/pick-prompt', methods=['POST'])
def pick_prompt():
    data = request.json
    game_id = data['game_id']
    game = games[game_id]
    game.pick_prompt()
    return make_response({})


@game_blueprint.route('/reset-game', methods=['POST'])
def reset_game():
    data = request.json
    game_id = data['game_id']
    # just making a new instance because fuck it.
    games[game_id] = byob.board.Game(game_id)
    return make_response({})


@game_blueprint.route('/', defaults={'path': ''})
@game_blueprint.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')


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
