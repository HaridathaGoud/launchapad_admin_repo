import React from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useNavigate } from "react-router-dom";
const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  return (
    <CDropdown variant="nav-item" className='view-profile '>

      <CDropdownToggle placement="bottom-end" className="py-0 d-flex align-items-center" caret={false}>
        <span className='icon user-profile'></span>
      </CDropdownToggle>
      <CDropdownMenu className="profile-menu" placement="bottom-end">
        <CDropdownItem onClick={() => navigate('/profile')} className="d-flex">
          <span className='icon user-profile me-2'></span>
          Profile
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" className="d-flex" >
          <span className='icon logout me-2'></span>
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
