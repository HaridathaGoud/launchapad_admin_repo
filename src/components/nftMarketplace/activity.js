import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "react-bootstrap/Spinner";

const Activity = () => {
  return (
    <>
        <>
          <div className="activity-tab">
            <div className="align-items-center mobile-hide accounts-tabs">
             
              <div className="d-flex justify-content-between w-search">
                <div className="">
                  <Form className="d-flex nav-search">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2 header-search search-width"
                      aria-label="Search"
                    />
                    <i className="icon search"></i>
                  </Form>
                </div>
              </div>
            </div>      
            <InfiniteScroll
            className='infinite-scroll-none'
              dataLength=""
              next=""
              hasMore=""
              loader={<Spinner animation="border" variant="primary" />}
            >
              <div className="responsive-table">
                <table className="table activity-table mt-5">
                  <thead>
                    <tr className="claim-head ">
                      <th  className="pool-data">S.No</th>
                      <th className="pool-data">Name</th>
                      <th className="pool-data">Description</th>
                      <th className="pool-data">Type</th>
                      <th className="pool-data">Date</th>
                    </tr>
                  </thead>
                    <tbody>
                      <>
                          <tr className="black-bg">
                            <td scope="row" className="pool-data">
                            </td>
                            <td className="pool-data">{'--'}</td>
                            <td className="pool-data">{'--'}</td>
                            <td className="pool-data">{'--'}</td>
                            <td className="pool-data">
                              <Moment format="DD-MM-YYYY " className="blue-text">
                                {'--'}
                              </Moment>
                            </td>
                          </tr>
                      </>
                    </tbody>
                  {/* )} */}
                </table>
              </div>
            </InfiniteScroll>
            <div></div>
          </div>
        </>
    
    </>
  );
};
const connectStateToProps = ({ auth }) => {
  return { auth: auth };
};
export default connect(connectStateToProps, (dispatch) => {
  return { dispatch };
})(Activity);
