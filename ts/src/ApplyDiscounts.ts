import { DiscountCard, Passenger, TripRequest } from "./model/trip.request";

export class ApplyDiscounts {
    // This method applies discounts to the total ticket price based on the passengers details
    applyDiscounts(totalTicketPrice: number, fetchTicketWithParams: number, trainDetails: TripRequest): number {
        // Define the discount rates
        const COUPLE_DISCOUNT = 0.2;
        const HALF_COUPLE_DISCOUNT = 0.1;

        // Get the list of passengers
        const passengersList = trainDetails.passengers;

        // Helper function to check if a passenger is a minor
        const isMinorPassenger = (passenger: Passenger) => passenger.age < 18;

        // If there are two passengers, check if they have a couple discount
        if (passengersList.length === 2) {
            let hasCoupleDiscount = false;

            // Loop through the passengers to check if any of them has a couple discount
            for (let i = 0; i < passengersList.length; i++) {
                if (passengersList[i].discounts.includes(DiscountCard.Couple)) {
                    hasCoupleDiscount = true;
                }
            }

            // If there is a couple discount and the passengers are not minors, apply the discount
            if (hasCoupleDiscount && !isMinorPassenger) {
                totalTicketPrice -= fetchTicketWithParams * COUPLE_DISCOUNT * 2;
            }
        }

        // If there is only one passenger, check if they have a half couple discount
        if (passengersList.length === 1) {
            let hasCoupleDiscount = false;

            // Loop through the passengers to check if any of them has a half couple discount
            for (let i = 0; i < passengersList.length; i++) {
                if (passengersList[i].discounts.includes(DiscountCard.HalfCouple)) {
                    hasCoupleDiscount = true;
                }
            }

            // If there is a half couple discount and the passenger is not a minor, apply the discount
            if (hasCoupleDiscount && !isMinorPassenger) {
                totalTicketPrice -= fetchTicketWithParams * HALF_COUPLE_DISCOUNT;
            }
        }

        // Return the total ticket price after applying the discounts
        return totalTicketPrice;
    }
}