import React from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Form from 'react-bootstrap/Form';
const Participant = () => {
  return (
    <>
     <Breadcrumb>
      <Breadcrumb.Item href="#" >Dashboard</Breadcrumb.Item>
      <span className='icon breadcrumb-icon ms-2 me-2'> </span>
      <Breadcrumb.Item href="#" active>Number of participants</Breadcrumb.Item>
    </Breadcrumb>
      <div className='d-flex justify-content-end align-items-center'>
        <Form className="table-search">
           
            <Form.Control className="me-2 header-search" placeholder="Search..." aria-label="Search" />
            <div className='icon-border'><span className='icon search'></span></div></Form>
            <span className='icon filter ms-3'></span>
          </div>
          <div className='mobile-width'>
                <div className='table-view'>
                    <div className='table-header mt-4'>
                        <div className='serial-number'><h6>Serial Number</h6></div>
                        <div className='trsn-code'><h6>Transactrion as</h6></div>
                        <div className='token-number'><h6>Number of Tokens</h6></div>
                        <div className='time-date'><h6>Date and Time</h6></div>
                    </div>
                    <div className='table-body'>
                        <div className='serial-number'><label>1</label></div>
                        <div className='trsn-code'><label>0xc033DeA81738812c136Fd4D4dfE18C5D6FC9ab1e</label></div>
                        <div className='token-number'><label>4</label></div>
                        <div className='time-date'><label>22-02-2023 4:30PM</label></div>
                    </div>
                    <div className='table-body'>
                        <div className='serial-number'><label>2</label></div>
                        <div className='trsn-code'><label>0xc033DeA81738812c136Fd4D4dfE18C5D6FC9ab1e</label></div>
                        <div className='token-number'><label>6</label></div>
                        <div className='time-date'><label>21-02-2023 1:50PM</label></div>
                    </div>
                    <div className='table-body'>
                        <div className='serial-number'><label>3</label></div>
                        <div className='trsn-code'><label>0xc033DeA81738812c136Fd4D4dfE18C5D6FC9ab1e</label></div>
                        <div className='token-number'><label>2</label></div>
                        <div className='time-date'><label>26-09-2022 7:20PM</label></div>
                    </div>
                    <div className='table-body'>
                        <div className='serial-number'><label>4</label></div>
                        <div className='trsn-code'><label>0xc033DeA81738812c136Fd4D4dfE18C5D6FC9ab1e</label></div>
                        <div className='token-number'><label>1</label></div>
                        <div className='time-date'><label>06-08-2022 9:30PM</label></div>
                    </div>
                    <div className='table-body'>
                        <div className='serial-number'><label>5</label></div>
                        <div className='trsn-code'><label>0xc033DeA81738812c136Fd4D4dfE18C5D6FC9ab1e</label></div>
                        <div className='token-number'><label>7</label></div>
                        <div className='time-date'><label>09-02-2023 6:30PM</label></div>
                    </div>
                </div>
                </div>
    
    </>
  )
}

export default Participant;
