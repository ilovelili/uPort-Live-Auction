import React from "react";
import { connect } from "react-redux";
import AuctionContract from "./Auction.json";
import getWeb3 from "../util/getWeb3";
import Countdown from "react-countdown-now";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			web3: null,
			accounts: null,
			contract: null,
			beneficiary: null,
			highestBid: null,
			highestBidder: null,
			balance: null,
			bid: 0,
			raised: 0,
			auctionDuration: 0,
			error: null,
			authData: this.props.authData ? this.props.authData : null,
		};
		this.makeBid = this.makeBid.bind(this);
		this.getDetails = this.getDetails.bind(this);
	}

	componentDidMount = async () => {
		try {
			const web3 = await getWeb3();
			const accounts = await web3.eth.getAccounts();
			const accouintBal = await web3.eth.getBalance(accounts[0]);
			const accountBalInEther = await web3.utils.fromWei(`${accouintBal}`, "ether");
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = AuctionContract.networks[networkId];
			const instance = new web3.eth.Contract(AuctionContract.abi, deployedNetwork && deployedNetwork.address);
			await this.setState({ web3, accounts, contract: instance, balance: accountBalInEther }, this.getDetails);

			await instance.events
				.HighestBidIncreased(
					{
						fromBlock: 0,
					},
					(error, event) => {
						if (event) {
							let raised = this.state.raised + Number(event.returnValues.amount);
							this.setState({ highestBid: Number(event.returnValues.amount), highestBidder: event.returnValues.bidder, raised });
						}
						console.log(error);
					}
				)
				.on("data", (event) => {
					// you can use this event to show bid history
					console.log("high level");
					console.log(Number(event.returnValues.amount));
					console.log(event.returnValues.bidder); // same results as the optional callback above
				})
				.on("changed", (event) => {
					console.log("changed");
					console.log(event);
					// remove event from local database
				})
				.on("error", (error) => console.error(error));
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	};
	makeBid = async () => {
		const { accounts, contract, bid } = this.state;
		const self = this;
		// try {
		await contract.methods
			.bid()
			.send({ from: accounts[0], value: bid })
			.on("transactionHash", (hash) => {
				console.log(hash);
				self.getDetails();
			})
			.on("confirmation", (confirmation, receipt) => {
				console.log("first", confirmation, receipt);
			})
			.on("receipt", (receipt) => {
				console.log("second", receipt);
			})
			.on("error", (error) => {
				console.log("error");
				alert(error.message);
			});
		// let newraised = raised + bid
		// await this.setState({raised: newraised}, this.getDetails);
		// }
		// catch(error) {
		//   console.log(error);
		//   this.setState({response: error})
		// }
	};
	getDetails = async () => {
		const { contract } = this.state;

		const beneficiary = await contract.methods.beneficiary().call();
		let auctionDuration = await contract.methods.auctionEndTime().call();
		const biddingTime = await contract.methods.biddingTime().call();
		const highestBid = await contract.methods.highestBid().call();
		const highestBidder = await contract.methods.highestBidder().call();
		auctionDuration = (await Number(auctionDuration)) * 1000;
		console.log(auctionDuration.toString());
		this.setState({ beneficiary, auctionDuration, highestBid: Number(highestBid), highestBidder });
	};
	componentDidCatch(error, info) {
		console.log("error");
		console.log(error, info);
	}
	render() {
		const { name, verified } = this.state.authData || {};
		// console.log('DASHBOARD RENDERING', authData);
		const { accounts, beneficiary, highestBid, highestBidder, balance, response, raised, bid, auctionDuration } = this.state;
		return (
			<div>
				<div>
					<h1>Auction</h1>
					<p>
						<strong>Welcome {name}!</strong>
					</p>
					<p>Participate in the auction below before the time runs out</p>
					<p>
						<a style={{ cursor: "pointer" }} onClick={() => window.location.reload()}>
							Click here if you logged in freshly or you feel your data is lagging
						</a>
					</p>
					<div className="row">
						<div className="column">
							<label>Beneficiary</label>
							<blockquote>
								<p>
									<em id="beneficiary">{beneficiary ? beneficiary.substr(0, 12) : "Loading.."}</em>
									<br />
									<br />
								</p>
							</blockquote>
						</div>
						<div className="column">
							<label>Raised</label>
							<blockquote>
								<p>
									<em>
										<span id="raised">{raised}</span>
										<br />
										ETH
									</em>
								</p>
							</blockquote>
						</div>
						<div className="column">
							<label>Time left</label>
							<blockquote>
								<p>
									<em id="timeleft">
										{auctionDuration ? (
											<Countdown date={new Date(auctionDuration)}>
												<em>Time up</em>
											</Countdown>
										) : (
											"Loading.."
										)}
									</em>
									<br />
								</p>
							</blockquote>
						</div>
						<div className="column">
							<label>Highest Bidder</label>
							<blockquote>
								<p>
									<em>
										<span id="highestBidder">{highestBidder ? highestBidder.substr(0, 12) : ""}</span>
										<br />
										<span id="highestBid">{highestBid ? highestBid : 0}</span> ETH
									</em>
								</p>
							</blockquote>
						</div>
						<div className="column">
							<label>Your Account</label>
							<blockquote>
								<p>
									<em id="accountAddress">{accounts ? accounts[0].substr(0, 12) : "Loading.."}</em>
									<br />
									<br />
								</p>
							</blockquote>
						</div>
						<div className="column">
							<label>Balance</label>
							<blockquote>
								<p>
									<em id="accountBalance">{balance ? Math.trunc(balance) : "Loading.."}</em>
									<br />
									ETH
								</p>
							</blockquote>
						</div>
					</div>
					<hr />

					<div className="row">
						<div className="column column-33">
							<label>From Account</label>
							<select id="bidAccount">
								{accounts &&
									accounts.map((account, index) => {
										return (
											<option key={index} value={account}>
												{account}
											</option>
										);
									})}
							</select>
						</div>
						<div className="column column-25">
							<label>Bid Amount</label>
							<input type="number" id="bidAmount" placeholder="28300 ether" onChange={(e) => this.setState({ bid: e.target.value })} />
						</div>
						<div className="column column-25">
							<label>
								<br />
							</label>
							<button
								id="makeBid"
								// disabled={Date.now() > auctionDuration}
								onClick={() => this.makeBid()}
							>
								Bid
							</button>
						</div>
					</div>

					<hr />

					{/* <button id="endAuction" disabled={beneficiary !== accounts}>End Auction</button> */}

					<br />
					<br />

					<div id="response">{response ? response : ""}</div>

					{/* {verified && verified.map((attestation) =>
          <AttestationCard {...attestation} />
        )} */}
				</div>
			</div>
		);
	}
}

const AttestationCard = ({ claim, iss, sub }) => (
	<div className="card">
		<h4>
			subject: <code>{sub}</code>
		</h4>
		<h4>
			issuer: <code>{iss}</code>
		</h4>
		<ExpandJSON obj={claim} />
	</div>
);

const ExpandJSON = ({ obj }) => {
	return (
		<ul className="key">
			{Object.keys(obj).map((key) => (
				<li>
					<b>{key}: </b>
					{Array.isArray(obj[key]) ? (
						"[" + obj[key].map((item) => <ExpandJSON obj={item} />) + "]"
					) : typeof obj[key] === "object" ? (
						<ExpandJSON obj={obj[key]} />
					) : (
						obj[key]
					)}
				</li>
			))}
		</ul>
	);
};

export default connect((state) => ({
	authData: state.user.data,
}))(Dashboard);
