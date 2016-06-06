import {
  Map,
  Set,
  List,
} from 'immutable';

const initialState = new Map({
  guessedLetters: new Set(),
  targetWord: new List('COMPUTER'.split('')),
  guessesAllowed: 7,
  gameEnded: false,
  message: '',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  allowedCharacters: new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('')),
  rainbow: new List(['red', 'orange', 'yellow', 'green', 'blue', 'purple']),
  freeCharacters: new Set([' ']),
  proposedWord: '',
  showNewGameModal: false,
});

const wordGuess = (state = initialState, action) => {
  switch (action.type) {
  case 'GUESS_LETTER':
    if (state.get('gameEnded')) {
      return state;
    } else if (action.payload.guessedLetter.length === 1) {
      return state.update('guessedLetters', g => {
        return g.add(action.payload.guessedLetter);
      });
    }
    return state;
  // case 'CLEAR_GAME':
  //   const newWord = window.prompt('New word (letters and spaces only):');
  //   return state.merge({
  //     guessedLetters: new Set(),
  //     targetWord: new List(newWord.toUpperCase().split('')).filter(nw => {
  //       return state.get('allowedCharacters').has(nw);
  //     }),
  //     gameEnded: false,
  //     message: '',
  //   });
  case 'NEW_GAME_MODAL':
    return state.merge({
      showNewGameModal: true,
    });
  case 'NEW_GAME_FROM_MODAL':
    const newWord = action.payload.newTargetWord;
    return state.merge({
      guessedLetters: new Set(),
      targetWord: new List(newWord.toUpperCase().split('')).filter(nw => {
        return state.get('allowedCharacters').has(nw);
      }),
      gameEnded: false,
      message: '',
      showNewGameModal: false,
    });
  case 'END_GAME':
    return state.merge({
      gameEnded: true,
    });
  case 'SET_TARGET_WORD':
    return state.set('targetWord',
      action.payload.targetWord.split(''));
  case 'COLOR_SHIFT':
    return state.merge({
      rainbow: state.get('rainbow')
        .unshift(state.get('rainbow').last())
        .setSize(state.get('rainbow').size),
    });
  case 'CHANGE_PROPOSED_WORD':
    console.log('change!');
    return state.set('proposedWord',
      action.payload.targetWord);
  default:
    return state;
  }
};

export default wordGuess;
