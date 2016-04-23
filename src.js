const { createStore } = Redux;

const {
  fromJS,
  Map,
  Set,
  List,
} = Immutable;

const initialState = new Map({
  guessedLetters: new Set(),
  targetWord: new List('computer'.split('')),
  guessesAllowed: 7,
  gameEnded: false,
  message: '',
  alphabet: 'abcdefghijklmnopqrstuvwxyz'.split('')
});

const wordGuess = (state = initialState, action) => {
  switch (action.type) {
    case 'GUESS_LETTER':
      if(action.payload.guessedLetter.length === 1) {
        return state.update('guessedLetters', g => {
          return g.add(action.payload.guessedLetter);
        });
      }
      return state;
    case 'CLEAR_GAME':
      let newWord = window.prompt('New word:');
      return state.merge({
        guessedLetters: new Set(),
        targetWord: new List(newWord.split('')),
        gameEnded: false,
        message: '',
      });
    case 'END_GAME':
      return state.merge({
        gameEnded: true,
      })
    case 'SET_TARGET_WORD':
      return state.set('targetWord',
        action.payload.targetWord.split(''));
    default:
      return state;
  }
};

const store = createStore(wordGuess);

const { Component } = React;

class WordGuess extends Component {
  render() {
    const {
      targetWord,
      guesses,
      incorrectGuesses,
      correctGuesses,
      guessesAllowed,
      badGuesses,
      reveal,
      guessesRemaining,
      processGuess,
      alphabet
    } = this.props;
    const loss = badGuesses.size >= guessesAllowed ? true : false;
    const win = guessesRemaining === 0;
    return (
      <div>
      <button
        onClick = { () => { store.dispatch(
          {type: 'CLEAR_GAME',}
        )}
      }>
        New Game
      </button>
        <progress
          value={badGuesses.size / guessesAllowed}
          className="progress blue bg-yellow">
        </progress>
        <div
          className="flex">
          <div
            className="mx-auto"
            style={{fontSize:'120px'}}>
            { reveal }
          </div>
        </div>
        { win ? (<div> Good job! </div>) : null }
        { loss ? (<div>
          Sorry, try again.  The word was
          <b>{ targetWord }</b>.
          </div>) : null }
        {loss || win ? null :
<div
  className="flex">
          <ul className="flex-container">
        { alphabet.map((l, i) =>
           <li
            className={ badGuesses.has(l) ?
                'flex-item bg-orange' :
                correctGuesses.has(l) ?
                'flex-item bg-lime' :
                'flex-item' }
            key={i}
            onClick={ () => { store.dispatch({
              type: 'GUESS_LETTER',
              payload:{
                guessedLetter: l
              }
            })
          } }> { l } </li>
        ) }
        </ul>
      </div> }
      </div>
    );
  }
}

const render = () => {
  const lastState = store.getState();
  ReactDOM.render(
    <WordGuess
      targetWord = { lastState.get('targetWord') }
      guesses = { lastState.get('guessedLetters').toJS() }
      correctGuesses = { lastState.get('guessedLetters')
        .intersect(lastState.get('targetWord')) }
      badGuesses = { lastState.get('guessedLetters')
        .subtract(lastState.get('targetWord'))}
      incorrectGuesses = { lastState.get('guessedLetters')
        .subtract(lastState.get('targetWord')).toJS()
        + '(' + lastState.get('guessedLetters')
        .subtract(lastState.get('targetWord')).size + ')' }
      reveal  = { lastState.get('targetWord').map(t =>
        lastState.get('guessedLetters').has(t) ? t : '-') }
      guessesRemaining = { lastState.get('targetWord').reduce((acc, t) =>
        lastState.get('guessedLetters').has(t) ? acc : acc + 1 , 0) }
      alphabet = {lastState.get('alphabet')}
      guessesAllowed = { lastState.get('guessesAllowed') }
      />,
    document.getElementById('root')
  )
}

store.subscribe(render);
render();
