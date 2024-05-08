import { ApiException, DiscountCard, InvalidTripInputException, TripRequest, Passenger } from "./model/trip.request";

const CHILD_FARE = 9;
const SPECIAL_DISCOUNT = 1;
const COUPLE_DISCOUNT = 0.2;
const HALF_COUPLE_DISCOUNT = 0.1;



export class TrainTicketEstimator {
    // async estimateTrainTicketPrice(trainDetails: TripRequest): Promise<number> {
    //     this.validateInput(trainDetails);
    //
    //     const fetchTicketWithParams = await this.fetchTicketPrice(trainDetails);
    //
    //     const familyDiscountPassengers = trainDetails.passengers.filter(passenger => passenger.discounts.includes(DiscountCard.Family));
    //
    //     if (familyDiscountPassengers.length > 0) {
    //         const familyLastNames = familyDiscountPassengers.map(passenger => passenger.lastName);
    //         trainDetails.passengers.forEach(passenger => {
    //             if (familyLastNames.includes(passenger.lastName)) {
    //                 passenger.discounts.push(DiscountCard.Family);
    //             }
    //         });
    //     }
    //
    //     const totalTicketPrice = trainDetails.passengers.reduce((total, passenger) => {
    //         return total + this.calculateIndividualTicketPrice(fetchTicketWithParams, passenger, trainDetails);
    //     }, 0);
    //
    //     return this.applyDiscounts(totalTicketPrice, fetchTicketWithParams, trainDetails);
    // }

    // private validateInput(trainDetails: TripRequest) {
    //     if (trainDetails.passengers.length === 0) {
    //         return 0;
    //     }
    //
    //     if (trainDetails.details.from.trim().length === 0) {
    //         throw new InvalidTripInputException("Start city is invalid");
    //     }
    //
    //     if (trainDetails.details.to.trim().length === 0) {
    //         throw new InvalidTripInputException("Destination city is invalid");
    //     }
    //
    //     if (trainDetails.details.when < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)) {
    //         throw new InvalidTripInputException("Date is invalid");
    //     }
    // }

    // private async fetchTicketPrice(trainDetails: TripRequest): Promise<number> {
    //     const response = await fetch(`https://sncftrenitaliadb.com/api/train/estimate/price?from=${trainDetails.details.from}&to=${trainDetails.details.to}&date=${trainDetails.details.when}`);
    //     const data = await response.json();
    //     const fetchTicketWithParams = data?.price || -1;
    //
    //     if (fetchTicketWithParams === -1) {
    //         throw new ApiException();
    //     }
    //
    //     return fetchTicketWithParams;
    // }

    // private calculateIndividualTicketPrice(fetchTicketWithParams: number, passenger: Passenger, trainDetails: TripRequest): number {
    //     if (passenger.discounts.includes(DiscountCard.Family)) {
    //         return fetchTicketWithParams * 0.7;
    //     }
    //     let individualTicketPrice = fetchTicketWithParams;
    //
    //     if (passenger.age < 0) {
    //         throw new InvalidTripInputException("Age is invalid");
    //     }
    //
    //     if (passenger.age <= 17) {
    //         individualTicketPrice = fetchTicketWithParams * 0.6;
    //     } else if (passenger.age >= 70) {
    //         individualTicketPrice = fetchTicketWithParams * 0.8;
    //         if (passenger.discounts.includes(DiscountCard.Senior)) {
    //             individualTicketPrice -= fetchTicketWithParams * 0.2;
    //         }
    //     } else {
    //         individualTicketPrice = fetchTicketWithParams * 1.2;
    //     }
    //
    //     const currentDate = new Date();
    //     const dateDifference = trainDetails.details.when.getTime() - currentDate.getTime();
    //     const daysDifference = dateDifference / (1000 * 3600 * 24);
    //     const timeDifference = trainDetails.details.when.getTime() - currentDate.getTime();
    //     const hoursDifference = timeDifference / (1000 * 3600);
    //
    //     if (daysDifference >= 5 && daysDifference <= 30) {
    //         individualTicketPrice -= (20 - daysDifference) * 0.02 * fetchTicketWithParams;
    //     } else if (daysDifference > 30) {
    //         individualTicketPrice -= fetchTicketWithParams * 0.8;
    //     }
    //     if (hoursDifference <= 6) {
    //         individualTicketPrice -= fetchTicketWithParams * 0.8;
    //     }
    //
    //     if (passenger.age > 0 && passenger.age < 4) {
    //         individualTicketPrice = CHILD_FARE;
    //     }
    //
    //     if (passenger.discounts.includes(DiscountCard.TrainStroke)) {
    //         individualTicketPrice = SPECIAL_DISCOUNT;
    //     }
    //
    //     return individualTicketPrice;
    // }

    private applyCoupleDiscounts(totalTicketPrice: number, fetchTicketWithParams: number, trainDetails: TripRequest): number {
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