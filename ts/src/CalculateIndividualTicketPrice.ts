import { DiscountCard, InvalidTripInputException, Passenger, TripRequest } from "./model/trip.request";

export class CalculateIndividualTicketPrice {
	async calculateIndividualTicketPrice(
		fetchTicketWithParams: number,
		passenger: Passenger,
		trainDetails: TripRequest
	): Promise<number> {
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

		if (passenger.age < 0) {
			throw new InvalidTripInputException("Age is invalid");
		}

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

		const currentDate = new Date();
		const dateDifference = trainDetails.details.when.getTime() - currentDate.getTime();
		const daysDifference = dateDifference / (1000 * 3600 * 24);
		const timeDifference = trainDetails.details.when.getTime() - currentDate.getTime();
		const hoursDifference = timeDifference / (1000 * 3600);

		if (daysDifference >= 5 && daysDifference <= 30) {
			individualTicketPrice -= (20 - daysDifference) * 0.02 * fetchTicketWithParams;
		} else if (daysDifference > 30) {
			individualTicketPrice -= fetchTicketWithParams * 0.8;
		}
		if (hoursDifference <= 6) {
			individualTicketPrice -= fetchTicketWithParams * 0.8;
		}

		if (passenger.age > 0 && passenger.age < 4) {
			individualTicketPrice = CHILD_FARE;
		}

		if (passenger.discounts.includes(DiscountCard.TrainStroke)) {
			individualTicketPrice = SPECIAL_DISCOUNT;
		}

		return individualTicketPrice;
	}
}
