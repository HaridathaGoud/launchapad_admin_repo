import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Toaster(props) {
  return (
    <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative">
      <ToastContainer position="top-end" className="p-3" >
        <Toast show={props.show} onClose={() => props.onClose(false)}>
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">Minnapad</strong>
          </Toast.Header>
          <Toast.Body>{props?.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Toaster;