import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import LoginButton from './LoginButton'
import { VisibleOnlyAuth, HiddenOnlyAuth } from './wrappers'
import { clearUserData } from '../../uport'

import uportLogo from '../../assets/img/uport-logo.svg'

// Header bar with login/logout capability and conditional navigation
const NavBar = ({doLogout}) => {

  const OnlyAuthLinks = VisibleOnlyAuth(() =>
    <React.Fragment>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <button onClick={() => doLogout()}>logout</button>
      </li>
    </React.Fragment>
  )

  const OnlyGuestLinks = HiddenOnlyAuth(() =>
    <React.Fragment>
      <li>
        <LoginButton />
      </li>
    </React.Fragment>
  )

  return (
    <nav style={{height: '7%'}}>
      <Link to="/">
        <img id="logo" alt="uport-logo" src={uportLogo}/>
        <div>Live Auction</div>
      </Link>
      <ul id="nav-right">
      <div><p/></div>
        <OnlyGuestLinks />
        <OnlyAuthLinks />
      </ul>
    </nav>
  )
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    doLogout: clearUserData(dispatch)
  })
)(NavBar)