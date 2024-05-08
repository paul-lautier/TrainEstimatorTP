import {DiscountCard, TripRequest} from "./model/trip.request";
import { validateInput } from './ValidateInput';
import { fetchTicketPrice } from './FetchTicketPrice';
import {calculateIndividualTicketPrice} from "./CalculateIndividualTicketPrice";
import { applyDiscounts } from './ApplyDiscounts';


export class estimateTrainTicketPrice {
    validateInputInstance: validateInput;
    fetchTicketPriceInstance: fetchTicketPrice;
    calculateIndividualTicketPriceInstance: calculateIndividualTicketPrice;
    applyDiscountsInstance: applyDiscounts;
    constructor() {
        this.validateInputInstance = new validateInput();
        this.fetchTicketPriceInstance = new fetchTicketPrice();
        this.calculateIndividualTicketPriceInstance = new calculateIndividualTicketPrice();
        this.applyDiscountsInstance = new applyDiscounts();
    }

    async estimateTrainTicketPrice(trainDetails: TripRequest): Promise<number> {
        this.validateInputInstance.validateInput(trainDetails);

        const fetchTicketWithParams = await this.fetchTicketPriceInstance.fetchTicketPrice(trainDetails);

        const familyDiscountPassengers = trainDetails.passengers.filter(passenger => passenger.discounts.includes(DiscountCard.Family));

        if (familyDiscountPassengers.length > 0) {
            const familyLastNames = familyDiscountPassengers.map(passenger => passenger.lastName);
            trainDetails.passengers.forEach(passenger => {
                if (familyLastNames.includes(passenger.lastName)) {
                    passenger.discounts.push(DiscountCard.Family);
                }
            });
        }

        const individualTicketPrices = await Promise.all(trainDetails.passengers.map(passenger =>
            this.calculateIndividualTicketPriceInstance.calculateIndividualTicketPrice(fetchTicketWithParams, passenger, trainDetails)
        ));

        const totalTicketPrice = individualTicketPrices.reduce((total, price) => total + price, 0);

        return this.applyDiscountsInstance.applyDiscounts(totalTicketPrice, fetchTicketWithParams, trainDetails);
    }
}