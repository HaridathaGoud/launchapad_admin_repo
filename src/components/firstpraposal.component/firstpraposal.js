import React from 'react';
import Button from 'react-bootstrap/Button';
import praposalImage from '../../assets/images/dao.png';

function FirstPraposal(props) {
    return (
        <div className='md-d-flex justify-content-center align-items-center'>

            <div className='firstpraposal-card'>
                <div>
                    <img src={praposalImage} width={300} alt=''/>
                    <p className='pra-description mt-4'>Get your community involved in the decision making process.<br />
                        Learn more in our proposal guide.</p>
                  {props.isEligibleForProposal && <Button variant="primary mt-4 filled-btn" onClick={props.handleRedirect}>Create Your First Proposal</Button>}
                </div>
            </div>
        </div>
    )
}
export default FirstPraposal;