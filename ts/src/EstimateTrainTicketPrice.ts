import {DiscountCard, InvalidTripInputException, TripRequest} from "./model/trip.request";

export class estimateTrainTicketPrice {

    async estimateTrainTicketPrice(trainDetails: TripRequest): Promise<number> {
        this.validateInput(trainDetails);

        const fetchTicketWithParams = await this.fetchTicketPrice(trainDetails);

        const familyDiscountPassengers = trainDetails.passengers.filter(passenger => passenger.discounts.includes(DiscountCard.Family));

        if (familyDiscountPassengers.length > 0) {
            const familyLastNames = familyDiscountPassengers.map(passenger => passenger.lastName);
            trainDetails.passengers.forEach(passenger => {
                if (familyLastNames.includes(passenger.lastName)) {
                    passenger.discounts.push(DiscountCard.Family);
                }
            });
        }

        const totalTicketPrice = trainDetails.passengers.reduce((total, passenger) => {
            return total + this.calculateIndividualTicketPrice(fetchTicketWithParams, passenger, trainDetails);
        }, 0);

        return this.applyCoupleDiscounts(totalTicketPrice, fetchTicketWithParams, trainDetails);
    }
}