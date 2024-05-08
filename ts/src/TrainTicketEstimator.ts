import { DiscountCard, TripRequest } from "./model/trip.request";
import { ValidateInput } from "./ValidateInput";
import { FetchTicketPrice } from "./FetchTicketPrice";
import { CalculateIndividualTicketPrice } from "./CalculateIndividualTicketPrice";
import { ApplyDiscounts } from "./ApplyDiscounts";

export class TrainTicketEstimator {
	validateInputInstance: ValidateInput;
	fetchTicketPriceInstance: FetchTicketPrice;
	calculateIndividualTicketPriceInstance: CalculateIndividualTicketPrice;
	applyDiscountsInstance: ApplyDiscounts;
	constructor() {
		this.validateInputInstance = new ValidateInput();
		this.fetchTicketPriceInstance = new FetchTicketPrice();
		this.calculateIndividualTicketPriceInstance = new CalculateIndividualTicketPrice();
		this.applyDiscountsInstance = new ApplyDiscounts();
	}

	async estimateTrainTicketPrice(trainDetails: TripRequest): Promise<number> {
		this.validateInputInstance.validateInput(trainDetails);

		if (trainDetails.passengers.length === 0) {
			return 0;
		}

		const fetchTicketWithParams = await this.fetchTicketPriceInstance.fetchTicketPrice(trainDetails);

		const familyDiscountPassengers = trainDetails.passengers.filter((passenger) =>
			passenger.discounts.includes(DiscountCard.Family)
		);

		if (familyDiscountPassengers.length > 0) {
			const familyLastNames = familyDiscountPassengers.map((passenger) => passenger.lastName);
			trainDetails.passengers.forEach((passenger) => {
				if (familyLastNames.includes(passenger.lastName)) {
					passenger.discounts.push(DiscountCard.Family);
				}
			});
		}

		const individualTicketPrices = await Promise.all(
			trainDetails.passengers.map((passenger) =>
				this.calculateIndividualTicketPriceInstance.calculateIndividualTicketPrice(
					fetchTicketWithParams,
					passenger,
					trainDetails
				)
			)
		);

		const totalTicketPrice = individualTicketPrices.reduce((total, price) => total + price, 0);

		return this.applyDiscountsInstance.applyDiscounts(totalTicketPrice, fetchTicketWithParams, trainDetails);
	}
}
