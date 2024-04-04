import React from "react";
import Toast from 'react-bootstrap/Toast';
import PropTypes from 'prop-types';

const ToasterMessage = (props) => {
    return (
        <div className="text-center toster-component">
            <Toast show={props?.isShowToaster} 
                position='bottom-center'
                bg='Success'
                delay={3000} autohide
            >
                <Toast.Body><span className="icon success me-2"></span>{props?.success}</Toast.Body>
            </Toast>
        </div>
    )
}
ToasterMessage.propTypes = {
    isShowToaster: PropTypes.string,
    success: PropTypes.string,
  }
export default ToasterMessage;