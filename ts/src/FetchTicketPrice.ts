import { ApiException, TripRequest } from "./model/trip.request";

export class FetchTicketPrice {
	// This method fetches the ticket price based on the trip details
	async fetchTicketPrice(trainDetails: TripRequest): Promise<number> {
		// Send a GET request to the API endpoint with the trip details as query parameters
		const response = await fetch(
			`https://sncftrenitaliadb.com/api/train/estimate/price?from=${trainDetails.details.from}&to=${trainDetails.details.to}&date=${trainDetails.details.when}`
		).then((res) => res.json());

		// Extract the price from the response data
		const fetchTicketWithParams = response.data?.price || -1;

		// If the price is -1, throw an ApiException
		if (fetchTicketWithParams === -1) {
			throw new ApiException();
		}

		// Return the fetched ticket price
		return fetchTicketWithParams;
	}
}