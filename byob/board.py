import copy
import random
import time


class Game:
    def __init__(self, game_id):
        self._game_id = game_id
        self._prompts = Game._get_prompts()
        self._current_prompt = None
        self._timer_timestamp = None
        self.pick_prompt()

    @staticmethod
    def _get_prompts():
        temp = copy.deepcopy(WORDS)
        random.shuffle(temp)
        return temp

    def pick_prompt(self):
        self._timer_timestamp = None
        if len(self._prompts) == 0:
            self._prompts = Game._get_prompts()

        self._current_prompt = self._prompts.pop()

    def start_timer(self):
        self._timer_timestamp = time.time() * 1000.0

    @property
    def current_prompt(self):
        return self._current_prompt

    def get_state(self):
        state = {
            'game_id': self._game_id,
            'prompt': self._current_prompt,
            'timer_timestamp': self._timer_timestamp
        }
        return state


WORDS = [
    " The moment a bad omen appears in a horror novel ",
    " A hero's catchphrase The title of a murder mystery novel ",
    " A line from a teenager's diary ",
    " A phrase that could inspire revolt ",
    " A sentence in a fortune cookie ",
    " The punchline of a joke ",
    " A phrase you wouldn’t want to hear your grandparents say ",
    " An item on a resume ",
    " The moment in a romance novel when hearts are broken ",
    " A line you never expected to find in a poem ",
    " A one-liner from an action movie ",
    " A line in an eviction notice ",
    " A line from a horoscope ",
    " The award-winning moment in a dramatic film ",
    " Something spoken by an animal in a fairy tale ",
    " A line from a passive -aggressive note ",
    " A passage from a religious text ",
    " The name of a store that sells almost everything ",
    " A pick-up line ",
    " An item in a police report ",
    " The meaning of life is...  ",
    " The moment in a sci-fi novel when a robot behaves unexpectedly ",
    " Something yelled at a broken machine ",
    " Something you could hear Arnold Schwarzenegger say ",
    " Advice for graduating seniors ",
    " Lyrics from a power ballad (e.g. Journey) ",
    " This just in, a line of breaking news!  ",
    " Part of a piece of e-mail spam ",
    " A universal truth ",
    " A political slogan ",
    " Famous last words ",
    " An alien's first words to mankind ",
    " Lyrics from a country-western song (e.g. Johnny Cash) ",
    " Lyrics from a lullaby (e.g. Rock-a-bye Baby) ",
    " Part of a love letter ",
    " The title of a longlost thriller by Alfred Hitchcock ",
    " Words tattooed on someone's body ",
    " The name of a health and beauty product ",
    " The name of a trendy mixed drink ",
    " Text on a warning label ",
    " A phrase that would be extra creepy if you whispered it ",
    " The secret password to a magical cave ",
    " The slogan on a bumper sticker "
    ]
