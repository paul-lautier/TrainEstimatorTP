import { InvalidTripInputException, TripRequest } from "./model/trip.request";

export class ValidateInput {
	// This method validates the input trip details
	validateInput(trainDetails: TripRequest) {
		// If the 'from' field in the trip details is empty, throw an InvalidTripInputException
		if (trainDetails.details.from.trim().length === 0) {
			throw new InvalidTripInputException("Start city is invalid");
		}

		// If the 'to' field in the trip details is empty, throw an InvalidTripInputException
		if (trainDetails.details.to.trim().length === 0) {
			throw new InvalidTripInputException("Destination city is invalid");
		}

		// If the 'when' field in the trip details is a date in the past, throw an InvalidTripInputException
		if (
			trainDetails.details.when <
			new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
		) {
			throw new InvalidTripInputException("Date is invalid");
		}
	}
}