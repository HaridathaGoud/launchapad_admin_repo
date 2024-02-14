import React from 'react';
import resource from '../../assets/images/resource.png'
export default function Resources() {
    return (
        <>
                        <div className='voting-card resources mt-5'>
                            <div className='d-flex justify-content-between align-items-center px-3 py-2'>
                                <img src={resource}></img>
                                <h1 className='resource-title mb-0 me-5'>No resources were added</h1>
                            </div><hr className='m-0'/>
                            <div className=' px-4 py-2'>
                                <p>Status</p>
                                <p>
                                    <span className='icon-dao success-icon'></span>
                                    <span>Published</span>
                                </p>
                                <div className='published'>
                                <p>2023/04/20 09:29 AM UTC-6</p>
                                <p>
                                    <span>41,751,651</span>
                                    <span className='icon-dao block'></span>
                                </p></div>
                            </div>
                        </div>
        </>
    );
}
