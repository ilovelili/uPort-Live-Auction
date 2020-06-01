import React from "react";

import guide from "../../guide.md";
import LoginButton from "../util/LoginButton";

const Home = () => {
	return (
		<div>
			<div style={{ justifyContent: "center", textAlign: "center", marginTop: "10%" }}>
				<h1>Welcome to Live Auction</h1>
				<p>User authentication is powered by uPort. Ensure you have the mobile app to enable you log in </p>
				<p>Click on the Button below to Log in. </p>
				<LoginButton />
			</div>
		</div>
	);
};

export default Home;
