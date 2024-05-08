import {DiscountCard, TripRequest} from "./model/trip.request";

export class applyDiscounts {

    applyDiscounts(totalTicketPrice: number, fetchTicketWithParams: number, trainDetails: TripRequest): number {

        const COUPLE_DISCOUNT = 0.2;
        const HALF_COUPLE_DISCOUNT = 0.1;
        const passengersList = trainDetails.passengers;

        if (passengersList.length === 2) {
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
                totalTicketPrice -= fetchTicketWithParams * COUPLE_DISCOUNT * 2;
            }
        }

        if (passengersList.length === 1) {
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
                totalTicketPrice -= fetchTicketWithParams * HALF_COUPLE_DISCOUNT;
            }
        }

        return totalTicketPrice;
    }
}