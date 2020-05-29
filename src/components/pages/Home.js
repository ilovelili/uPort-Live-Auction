import React from 'react'

import guide from '../../guide.md'
import LoginButton from '../util/LoginButton';

const Home = () => {


  return (
    <div>
      <div style={{justifyContent: "center", textAlign: "center", marginTop: "10%"}}>
        <h1>Welcome to Live Auction</h1>
        <p>User authentication is powered by uPort. Ensure you have the mobile app to enable you log in </p>
        <p>Click on the Button below to Log in. </p>
        <LoginButton />
        {/* <p>You're all set up with uPort, truffle, and react/redux!  
          This boilerplate contains examples of several of uPort's capabilities,
          all wrapped into familiar react/redux patterns:
        </p> */}
        {/* <div dangerouslySetInnerHTML={{ __html: guide}} /> */}
      </div>
    </div>
  )
}

export default Home
