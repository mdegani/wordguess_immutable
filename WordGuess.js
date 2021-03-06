import React from 'react';
import {Component} from 'react';
import {
  List,
} from 'immutable';
import Modal from './Modal';

import './styles.css';

const rainbowId = (num) => {
  return num % 6;
};

class WordGuess extends Component {

  // componentDidMount() {
  //   window.addEventListener('keypress', this.keyPressed, false);
  // }

  render() {
    const {
      targetWord,
      correctGuesses,
      guessesAllowed,
      badGuesses,
      reveal,
      guessesRemaining,
      alphabet,
      rainbow,
      store,
      newGameModalIsVisible,
      proposedWord,
    } = this.props;
    const loss = badGuesses.size >= guessesAllowed ? true : false;
    const win = guessesRemaining === 0;
    return (
      <div>
      <button
        onClick = { () => {
          store.dispatch({type: 'NEW_GAME_MODAL'});
        }
      }>
        New Game
      </button>
        <progress
          value={badGuesses.size / guessesAllowed}
          className="progress"
          style={{height: '65px', color: '#FF0066', backgroudColor: '#FFFF99'}}>
        </progress>
        <Modal
          isVisible = { newGameModalIsVisible }>
          <div>New Word:</div>
          <input
            value = { proposedWord }
            type="text"
            onChange = {(event) => {
              store.dispatch({
                type: 'CHANGE_PROPOSED_WORD',
                payload: {
                  targetWord: event.target.value,
                },
              });
            }}/>
          <button
            className = "btn btn-primary mb1 bg-blue"
            onClick = {
              () => {
                store.dispatch({
                  type: 'NEW_GAME_FROM_MODAL',
                  payload: {
                    newTargetWord: proposedWord,
                  },
                });
              }
            }> OK!
          </button>
          </Modal>
        <div
          className="flex">
          {win ?
             (<div
              className="mx-auto"
              style={{fontSize: '120px', letterSpacing: '10px'}}>
              { reveal.map((r, i) => {
                return (<span key={i} className={ rainbow.get(rainbowId(i)) } onClick={
                  () => {
                    store.dispatch({
                      type: 'COLOR_SHIFT',
                    });
                  }
                }> { r } </span>);
              }) }
            </div>)
           :
             (
               <div
                className="mx-auto"
                style={{fontSize: '120px', letterSpacing: '10px'}}>
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
            onClick={
              () => {
                store.dispatch({
                  type: 'GUESS_LETTER',
                  payload: {
                    guessedLetter: l,
                  },
                });
              }
            }> { l } </button>
          ) }
        </div>
      </div> }
      </div>
    );
  }
  // keyPressed(e) {
  //   if (e.code.substring(0, 3) === 'Key') {
  //     store.dispatch({
  //       type: 'GUESS_LETTER',
  //       payload: {
  //         guessedLetter: e.code.substring(3, 4),
  //       },
  //     });
  //   }
  // }
}

WordGuess.propTypes = {
  targetWord: React.PropTypes.instanceOf(List),
  correctGuesses: React.PropTypes.instanceOf(Set),
  guessesAllowed: React.PropTypes.number,
  badGuesses: React.PropTypes.instanceOf(Set),
  reveal: React.PropTypes.instanceOf(List),
  guessesRemaining: React.PropTypes.number,
  alphabet: React.PropTypes.array,
  rainbow: React.PropTypes.instanceOf(List),
  newGameModalIsVisible: React.PropTypes.bool,
  proposedWord: React.PropTypes.string,
  store: React.PropTypes.object,
};

export default WordGuess;
