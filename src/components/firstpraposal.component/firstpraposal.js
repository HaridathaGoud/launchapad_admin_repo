import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import praposalImage from '../../assets/images/dao.png'
import { useSelector } from 'react-redux';

function FirstPraposal(props) {
    const UserInfo = useSelector(state => state.oidc?.profile?.profile)

    return (<>
        <Container className='dao-container d-flex justify-content-center align-items-center'>

            <div className='firstpraposal-card'>
                <div>
                    <img src={praposalImage} width={300} />
                    <p className='pra-description mt-4'>Get your community involved in the decision making process.<br />
                        Learn more in our proposal guide.</p>
                  {(UserInfo?.role=="Admin" && props?.votingOwner) && <Button variant="primary mt-4" onClick={props.handleRedirect}>Create Your First Proposal</Button>}
                </div>
            </div>
        </Container>
    </>)
}
export default FirstPraposal;