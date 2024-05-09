import { DiscountCard, InvalidTripInputException, Passenger, TripRequest } from "./model/trip.request";

export class CalculateIndividualTicketPrice {
	// This method calculates the individual ticket price based on the passenger's details and the trip details
	async calculateIndividualTicketPrice(
		fetchTicketWithParams: number,
		passenger: Passenger,
		trainDetails: TripRequest
	): Promise<number> {
		// Define the child fare and special discount rates
		const CHILD_FARE = 9;
		const SPECIAL_DISCOUNT = 1;

		const familyDiscountPassengers = trainDetails.passengers.filter((passenger) =>
			passenger.discounts.includes(DiscountCard.Family)
		);

		const familyNames = familyDiscountPassengers.map((passenger) => passenger.lastName);

		trainDetails.passengers.forEach((passenger) => {
			if (familyNames.includes(passenger.lastName)) {
				if (!passenger.discounts.includes(DiscountCard.Family)) {
					passenger.discounts.push(DiscountCard.Family);
				}
			}
		});

		if (passenger.discounts.includes(DiscountCard.Family) && familyNames.length > 1) {
			return fetchTicketWithParams * 0.7;
		}

		let individualTicketPrice = fetchTicketWithParams;

		// If the passenger's age is less than 0, throw an error
		if (passenger.age < 0) {
			throw new InvalidTripInputException("Age is invalid");
		}

		// Apply discounts based on the passenger's age
		if (passenger.age <= 17) {
			individualTicketPrice = fetchTicketWithParams * 0.6;
		} else if (passenger.age >= 70) {
			individualTicketPrice = fetchTicketWithParams * 0.8;
			if (passenger.discounts.includes(DiscountCard.Senior)) {
				individualTicketPrice = individualTicketPrice * 0.8;
			}
		} else {
			individualTicketPrice = fetchTicketWithParams * 1.2;
		}

		// Calculate the difference in days and hours between the current date and the trip date
		const currentDate = new Date();
		const dateDifference = trainDetails.details.when.getTime() - currentDate.getTime();
		const daysDifference = dateDifference / (1000 * 3600 * 24);
		const timeDifference = trainDetails.details.when.getTime() - currentDate.getTime();
		const hoursDifference = timeDifference / (1000 * 3600);

		// Apply discounts based on the difference in days and hours
		if (daysDifference >= 5 && daysDifference <= 30) {
			individualTicketPrice -= (20 - daysDifference) * 0.02 * fetchTicketWithParams;
		} else if (daysDifference > 30) {
			individualTicketPrice -= fetchTicketWithParams * 0.8;
		}
		if (hoursDifference <= 6) {
			individualTicketPrice -= fetchTicketWithParams * 0.8;
		}

		// If the passenger's age is between 0 and 4, set the ticket price to the child fare
		if (passenger.age > 0 && passenger.age < 4) {
			individualTicketPrice = CHILD_FARE;
		}

		// If the passenger has a TrainStroke discount, set the ticket price to the special discount
		if (passenger.discounts.includes(DiscountCard.TrainStroke)) {
			individualTicketPrice = SPECIAL_DISCOUNT;
		}

		// Return the individual ticket price
		return individualTicketPrice;
	}
}