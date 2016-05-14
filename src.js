const { createStore } = Redux;

const {
  fromJS,
  Map,
  Set,
  List,
} = Immutable;

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
});

const rainbowId = (num) => {
  return num % 6;
};

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
      let newWord = window.prompt('New word (letters and spaces only):');
      return state.merge({
        guessedLetters: new Set(),
        targetWord: new List(newWord.toUpperCase().split('')).filter(nw => {
          return state.get('allowedCharacters').has(nw);
        }),
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
    case 'COLOR_SHIFT':
      return state.merge({
        rainbow : state.get('rainbow')
          .unshift(state.get('rainbow').last())
          .setSize(state.get('rainbow').size)
      })
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
      alphabet,
      rainbow,
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
          className="progress"
          style={{height:'65px', color:'#FF0066', backgroudColor: '#FFFF99'}}>
        </progress>
        <div
          className="flex">
          {win ?
             (<div
              className="mx-auto"
              style={{fontSize:'120px', letterSpacing: '10px'}}>
              { reveal.map((r,i) => {
                return (<span key={i} className={ rainbow.get(rainbowId(i)) } onClick={
                  () => {
                    store.dispatch({
                      type: 'COLOR_SHIFT',
                    })
                  }
                }> { r } </span>);
              }) }
            </div>)
           :
             (
               <div
                className="mx-auto"
                style={{fontSize:'120px', letterSpacing: '10px'}}>
                { reveal }
              </div>
            )
          }

        </div>
        { win ? (<div> Good job! </div>) : null }
        { loss ? (<div>
          Sorry, try again.  The word was
          <b> { targetWord }</b>.
          </div>) : null }
        {loss || win ? null :
<div
  className="flex">
          <div className="flex-container">
        { alphabet.map((l, i) =>
           <button
            className={ badGuesses.has(l) ?
                'flex-item bg-red' :
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
          } }> { l } </button>
        ) }
        </div>
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
        lastState.get('guessedLetters').has(t) ||
        lastState.get('freeCharacters').has(t) ? t : '-') }
      guessesRemaining = { lastState.get('targetWord').reduce((acc, t) =>
        lastState.get('guessedLetters').has(t) ||
        lastState.get('freeCharacters').has(t) ? acc : acc + 1 , 0) }
      alphabet = {lastState.get('alphabet')}
      guessesAllowed = { lastState.get('guessesAllowed') }
      rainbow = {lastState.get('rainbow')}
      />,
    document.getElementById('root')
  )
}

store.subscribe(render);
render();
