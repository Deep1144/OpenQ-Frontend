/* eslint-disable */
// import { issueIds } from './mocks/data/issueIds';
import jsonRpcErrors from './JsonRPCErrors';
import axios from 'axios';
import {ethers} from 'ethers';

class MockOpenQClient {
	shouldSleep = 0;
	shouldError = false;

	setSleep(time) {
		this.shouldSleep = time;
	}

	constructor() { }

	async sleep(time) {
		return new Promise(async (resolve, reject) => {
			setTimeout(time),
				resolve();
		});
	}

	reset() {
		this.shouldError = false;
	}

	async getENS(_callerAddress){
		let promise = new Promise (async (resolve) =>{
			await this.sleep(1500);
			resolve("sample.eth");
			
		})
		return promise
	}

	async getAllIssues(library) {
		await sleep();

		return axios.get(`http://localhost:3030/getAllIssues`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueAddresses(library, issues) {
		return axios.get(`http://localhost:3030/getIssueAddresses`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueIsOpen(library, issueId) {
		return true;
	}

	async getIssueIdFromAddress(library, address) {
		return axios.get(`http://localhost:3030/getIssueIdFromAddress/${address}`)
			.then(result => {
				return result.data.issueId;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async mintBounty(library, issueId, organization) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep(1500);
			resolve({ "bountyAddress": "0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e", "txnReceipt": {} });
		});
		return promise;
	}

	async fundBounty(library, _bountyId, _tokenAddress, _value, _depositPeriodDays) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep(4500);

				resolve(({ "bountyAddress": "0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e", "txnReceipt": {} }));
		});
		return promise;
	}

	async balanceOf(library, _callerAddress, _tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
				resolve(ethers.BigNumber.from("6600000000000000000"));
		});
		return promise;
	}

	async approve(library, _bountyAddress, _tokenAddress, _value) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				await this.sleep(1000);
				if(this.shouldError){					
				throw new Error();
				}
				resolve({});
				}
			catch (error) {
				console.log(error)
				reject({
					
					title: 'Internal JSON',
					message: 'Internal JSON-RPC error', 
				data: {
					title: 'Internal JSON',
					message: 'Internal JSON-RPC error'
				}
			});
			}
		});
		return promise;
	}

	
	async userOwnedTokenBalances(library, _callerAddress, tokens) {
		const promise = new Promise(async (resolve) => {
			const tokensInWallet = [];
			tokens.forEach(async (token) => {
				tokensInWallet.push(this.userBalanceForToken(library, token, _callerAddress));
			});
			resolve(Promise.all(tokensInWallet));
		});

		return promise;
	}

	async userBalanceForToken(library, token, _callerAddress) {
		let promise = new Promise(async (resolve) => {
				this.sleep(1500);
				resolve(true);

		});

		return promise;
	}

async refundDeposit(library, _bountyId, _depositId)  {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/txnResponse')
				.then((result) => {
					resolve(result.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	
	handleError(jsonRpcError, data) {
		let errorString = jsonRpcError?.data?.message;
		console.log(errorString);
		if(typeof jsonRpcError === 'string'){
			if (jsonRpcError.includes('Ambire user rejected the request')) { errorString = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.includes('Rejected Request')) { errorString = 'USER_DENIED_TRANSACTION'; }}
		console.log(jsonRpcError);
		if(jsonRpcError.message){
		
			if (jsonRpcError.message.includes('Nonce too high.')) { errorString = 'NONCE_TO_HIGH'; }
			if (jsonRpcError.message.includes('User denied transaction signature')) { errorString = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.message.includes('MetaMask is having trouble connecting to the network')) { errorString = 'METAMASK_HAVING_TROUBLE'; }
			if (jsonRpcError.message.includes('Internal JSON-RPC error')) { errorString = 'INTERNAL_ERROR'; }
			if (jsonRpcError.message.includes('Set a higher gas fee')){ errorString = 'UNDERPRICED_TXN';}
		}	
		if(!errorString){
			errorString='CALL_EXCEPTION';
		}
		for (const error of jsonRpcErrors) {
			const revertString = Object.keys(error)[0];
			if (errorString.includes(revertString)) {
				const title = error[revertString]['title'];
				const message = error[revertString].message(data);
				const link = error[revertString].link;
				const linkText = error[revertString].linkText;
				return { title, message, link, linkText };
			}
		}
		return 'Unknown Error';
	}
}

export default MockOpenQClient;