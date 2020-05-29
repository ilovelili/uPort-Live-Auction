import React from 'react'
import { requestDisclosure } from '../../uport'

const LoginButton = () => (
  <button onClick={async () => await requestDisclosure({verified: ['sampleVerification']})}>login</button>
)

export default LoginButton