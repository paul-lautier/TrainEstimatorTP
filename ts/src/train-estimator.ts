import { ApiException, DiscountCard, InvalidTripInputException, TripRequest } from "./model/trip.request";

export class TrainTicketEstimator {
	async estimateTrainTicketPrice(trainDetails: TripRequest): Promise<number> {
		if (trainDetails.passengers.length === 0) {
			return 0;
		}

		if (trainDetails.details.from.trim().length === 0) {
			throw new InvalidTripInputException("Start city is invalid");
		}

		if (trainDetails.details.to.trim().length === 0) {
			throw new InvalidTripInputException("Destination city is invalid");
		}

		if (
			trainDetails.details.when <
			new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
		) {
			throw new InvalidTripInputException("Date is invalid");
		}

		// TODO USE THIS LINE AT THE END
		const fetchTicketWithParams =
			(
				await (
					await fetch(
						`https://sncftrenitaliadb.com/api/train/estimate/price?from=${trainDetails.details.from}&to=${trainDetails.details.to}&date=${trainDetails.details.when}`
					)
				).json()
			)?.price || -1;

		if (fetchTicketWithParams === -1) {
			throw new ApiException();
		}

		const passengersList = trainDetails.passengers;
		let totalTicketPrice = 0;
		let individualTicketPrice = fetchTicketWithParams;
		for (let i = 0; i < passengersList.length; i++) {
			if (passengersList[i].age < 0) {
				throw new InvalidTripInputException("Age is invalid");
			}
			if (passengersList[i].age < 1) {
				continue;
			}
			// Seniors
			else if (passengersList[i].age <= 17) {
				individualTicketPrice = fetchTicketWithParams * 0.6;
			} else if (passengersList[i].age >= 70) {
				individualTicketPrice = fetchTicketWithParams * 0.8;
				if (passengersList[i].discounts.includes(DiscountCard.Senior)) {
					individualTicketPrice -= fetchTicketWithParams * 0.2;
				}
			} else {
				individualTicketPrice = fetchTicketWithParams * 1.2;
			}

			const currentDate = new Date();
			if (trainDetails.details.when.getTime() >= currentDate.setDate(currentDate.getDate() + 30)) {
				individualTicketPrice -= fetchTicketWithParams * 0.2;
			} else if (trainDetails.details.when.getTime() > currentDate.setDate(currentDate.getDate() - 30 + 5)) {
				const date1 = trainDetails.details.when;
				const date2 = new Date();
				//https://stackoverflow.com/questions/43735678/typescript-get-difference-between-two-dates-in-days
				const diff = Math.abs(date1.getTime() - date2.getTime());
				const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

				individualTicketPrice += (20 - diffDays) * 0.02 * fetchTicketWithParams; // I tried. it works. I don't know why.
			} else {
				individualTicketPrice += fetchTicketWithParams;
			}

			if (passengersList[i].age > 0 && passengersList[i].age < 4) {
				individualTicketPrice = 9;
			}

			if (passengersList[i].discounts.includes(DiscountCard.TrainStroke)) {
				individualTicketPrice = 1;
			}

			totalTicketPrice += individualTicketPrice;
			individualTicketPrice = fetchTicketWithParams;
		}

		if (passengersList.length == 2) {
			let hasCoupleDiscount = false;
			let hasMinorPassenger = false;
			for (let i = 0; i < passengersList.length; i++) {
				if (passengersList[i].discounts.includes(DiscountCard.Couple)) {
					hasCoupleDiscount = true;
				}
				if (passengersList[i].age < 18) {
					hasMinorPassenger = true;
				}
			}
			if (hasCoupleDiscount && !hasMinorPassenger) {
				totalTicketPrice -= fetchTicketWithParams * 0.2 * 2;
			}
		}

		if (passengersList.length == 1) {
			let hasCoupleDiscount = false;
			let hasMinorPassenger = false;
			for (let i = 0; i < passengersList.length; i++) {
				if (passengersList[i].discounts.includes(DiscountCard.HalfCouple)) {
					hasCoupleDiscount = true;
				}
				if (passengersList[i].age < 18) {
					hasMinorPassenger = true;
				}
			}
			if (hasCoupleDiscount && !hasMinorPassenger) {
				totalTicketPrice -= fetchTicketWithParams * 0.1;
			}
		}

		return totalTicketPrice;
	}
}
