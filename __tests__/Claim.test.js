// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import ClaimPage from '../components/Claim/ClaimPage';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
import userEvent from '@testing-library/user-event';
 

describe('ClaimPage', ( ) => {
	const bounties = mocks.bounties;
	beforeEach(()=>{
		InitialState.openQClient.reset();
	});
	const test =(bounty )=>{
		it('should render the heading', async() => {
		// ARRANGE
			const user = userEvent.setup();		
			render(<ClaimPage bounty={bounty} />);

			// ACT
			const claimBtn = screen.getByText('Claim');
			await user.click(claimBtn);
			const confirmBtn = await screen.findByText('Yes! Claim!');
			expect(confirmBtn).toBeInTheDocument();
		});
	
	};

	test(bounties[0]);
});