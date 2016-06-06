import React, { PropTypes } from 'react';

const Modal = ({ children, onClick, isVisible }) => {
  return (
    <div
      onClick={ onClick }
      style={ Object.assign({}, styles.outer, isVisible ? styles.visible : styles.hidden) }
      className="fixed top-0 left-0 right-0 bottom-0 bg-black">
      <div
        onClick={ e => e.stopPropagation() }
        style={ styles.inner }
        className="absolute bg-white black p2 rounded">
        { children }
      </div>
    </div>
  );
};

Modal.defaultProps = {
  onClick: () => {},
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
};

const styles = {
  visible: {
    visibility: 'visible',
    opacity: 1,
    zIndex: 999,
  },
  hidden: {
    visibility: 'hidden',
    opacity: 0,
    zIndex: -1,
  },
  outer: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    transition: 'all 300ms',
  },
  inner: {
    top: '3.25rem',
    left: '1rem',
    right: '1rem',
    maxWidth: '650px',
    minHeight: '300px',
    margin: '0 auto',
  },
};

export default Modal;
