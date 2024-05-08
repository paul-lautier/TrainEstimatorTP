import { ApiException, TripRequest } from "./model/trip.request";

export class FetchTicketPrice {
	async fetchTicketPrice(trainDetails: TripRequest): Promise<number> {
		const response = await fetch(
			`https://sncftrenitaliadb.com/api/train/estimate/price?from=${trainDetails.details.from}&to=${trainDetails.details.to}&date=${trainDetails.details.when}`
		).then((res) => res.json());

		const fetchTicketWithParams = response.data?.price || -1;

		if (fetchTicketWithParams === -1) {
			throw new ApiException();
		}

		return fetchTicketWithParams;
	}
}
