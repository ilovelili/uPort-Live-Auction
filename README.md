# Simple Auction with React uport box

## Global Packages

Ensure you have the following installed

1. Ganache
2. Truffle
3. MetaMask(optional)

## Set up locally

1. Install package.json

   ```javascript
   npm install
   ```

2. Start gananche-cli and optionally connect to metamask

   ```javascript
   ganache - cli;
   ```

3. Deploy contract

   ```javascript
   truffle deploy
   ```

4. Copy content of `build/contract/Auction.json` to `/src/components/pages/Auction.json`

5. Start project locally

   ```javascript
   npm start
   ```

## Test

To run test, simply run `truffle test`
