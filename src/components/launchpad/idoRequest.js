import React from 'react'

import IdoRequestGrid from './settings/idoRequestGrid';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import PropTypes from 'prop-types'

const IDORequest=()=>{
 
  return(<>
    <h3 className='page-title mb-3'>IDO Request</h3>
    <CBreadcrumb>
      <CBreadcrumbItem>
        Launchpad
      </CBreadcrumbItem>
      <CBreadcrumbItem>IDO Request</CBreadcrumbItem>
    </CBreadcrumb>

    <IdoRequestGrid/>
  </>)
}

IDORequest.propTypes = {
  informationProjectView: PropTypes.string,
}

export default IDORequest;