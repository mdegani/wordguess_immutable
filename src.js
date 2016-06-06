import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import wordGuess from './reducers/gameReducer';
import WordGuess from './WordGuess';

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
        lastState.get('freeCharacters').has(t) ? acc : acc + 1, 0) }
      alphabet = {lastState.get('alphabet')}
      guessesAllowed = { lastState.get('guessesAllowed') }
      rainbow = {lastState.get('rainbow')}
      newGameModalIsVisible = { lastState.get('showNewGameModal')}
      proposedWord = { lastState.get('proposedWord')}
      store = {store}
      />,
    document.getElementById('root')
  );
};

const store = createStore(wordGuess);

store.subscribe(render);

render();
