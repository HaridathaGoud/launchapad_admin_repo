import { Card } from 'react-bootstrap';
import Placeholder from 'react-bootstrap/Placeholder';
import Col from 'react-bootstrap/Col';
const DaoCardShimmer = (count) => {
    let countList = [0];
    if (count) {
        for (let i = 1; i < count; i++) {
            countList.push(i)
        }
    }
    const html = <div style={{width:300,height: 60, borderRadius: 8 }} >
        {countList.map((item) => (
                < div key={item}>
                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={12} className='cardimg-placeholder' />
                </Placeholder>
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                        <Placeholder xs={6} />
                    </Placeholder>
                </Card.Body>
            </div>  
        ))}
    </div>;
    return html;

};

const ProposalCardShimmer = (count) => {
    let countList = [0];
    if (count) {
        for (let i = 1; i < count; i++) {
            countList.push(i)
        }
    }
    const html = <div >
        {countList.map((item) => (
            <Col key={item} xs={12} className=' align-items-center justify-content-between'>
                <>
                <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={4} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow" className="text-end">
                            <Placeholder xs={4} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={12} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={12} />
             </Placeholder>
             </>
             </Col>
        ))}
    </div>;
    return html;

};
const PublishProposal = (count) => {
    let countList = [0];
    if (count) {
        for (let i = 1; i < count; i++) {
            countList.push(i)
        }
    }
    const html = <div >
        {countList.map((item) => (
            <Col key={item} xs={12} className=' align-items-center justify-content-between'>
                <>
                <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={4} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow" className="text-end">
                            <Placeholder xs={4} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={12} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={12} />
             </Placeholder>
             </>
             </Col>
        ))}
    </div>;
    return html;

};

const votingShimmer = (count) => {
    let countList = [0];
    if (count) {
        for (let i = 1; i < count; i++) {
            countList.push(i)
        }
    }
    const html = <div >
        {countList.map((item) => (
            <Col key={item} xs={12} className=' align-items-center justify-content-between'>
                <>
                <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={4} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow" className="text-end">
                            <Placeholder xs={4} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={12} />
                            </Placeholder>
                            <Placeholder xs={6} as='span' animation="glow">
                            <Placeholder xs={12} />
             </Placeholder>
             </>
             </Col>
        ))}
    </div>;
    return html;

};

let shimmers={ DaoCardShimmer,ProposalCardShimmer,PublishProposal,votingShimmer}
export default shimmers;

