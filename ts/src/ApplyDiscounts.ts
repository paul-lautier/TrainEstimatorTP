import { DiscountCard, Passenger, TripRequest } from "./model/trip.request";

export class ApplyDiscounts {
	applyDiscounts(totalTicketPrice: number, fetchTicketWithParams: number, trainDetails: TripRequest): number {
		const COUPLE_DISCOUNT = 0.2;
		const HALF_COUPLE_DISCOUNT = 0.1;
		const passengersList = trainDetails.passengers;

		const isMinorPassenger = (passenger: Passenger) => passenger.age < 18;

		if (passengersList.length === 2) {
			let hasCoupleDiscount = false;

			for (let i = 0; i < passengersList.length; i++) {
				if (passengersList[i].discounts.includes(DiscountCard.Couple)) {
					hasCoupleDiscount = true;
				}
			}

			if (hasCoupleDiscount && !isMinorPassenger) {
				totalTicketPrice -= fetchTicketWithParams * COUPLE_DISCOUNT * 2;
			}
		}

		if (passengersList.length === 1) {
			let hasCoupleDiscount = false;

			for (let i = 0; i < passengersList.length; i++) {
				if (passengersList[i].discounts.includes(DiscountCard.HalfCouple)) {
					hasCoupleDiscount = true;
				}
			}

			if (hasCoupleDiscount && !isMinorPassenger) {
				totalTicketPrice -= fetchTicketWithParams * HALF_COUPLE_DISCOUNT;
			}
		}

		return totalTicketPrice;
	}
}
