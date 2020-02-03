import { useEffect, FC } from 'react';
import ReactDOM from 'react-dom';

const Modal: FC = ({ children }) => {
  const modalRoot = document.getElementById('portal');
  const el = document.createElement('div');

  useEffect(() => {
    console.log('TCL: Modal:FC -> modalRoot', modalRoot);
    modalRoot?.appendChild(el);
    return () => {
      modalRoot?.removeChild(el);
    };
  }, []);

  return ReactDOM.createPortal(children, el);
};

export default Modal;
