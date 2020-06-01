import React from "react";
import { requestDisclosure } from "../../uport";

const LoginButton = () => <button onClick={async () => await requestDisclosure({ verified: ["name", "country"] })}>login</button>;

export default LoginButton;
