import {ApiException, DiscountCard, InvalidTripInputException, TripRequest} from "./model/trip.request";

export class calculateIndividualTicketPrice {

    private async calculateIndividualTicketPrice(trainDetails: TripRequest): Promise<number> {
        if (passenger.discounts.includes(DiscountCard.Family)) {
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
                individualTicketPrice -= fetchTicketWithParams * 0.2;
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