import { DiscountCard, TripRequest } from "./model/trip.request";
import { ValidateInput } from "./ValidateInput";
import { FetchTicketPrice } from "./FetchTicketPrice";
import { CalculateIndividualTicketPrice } from "./CalculateIndividualTicketPrice";
import { ApplyDiscounts } from "./ApplyDiscounts";

export class TrainTicketEstimator {
	// Instances of the classes used in the estimation process
	validateInputInstance: ValidateInput;
	fetchTicketPriceInstance: FetchTicketPrice;
	calculateIndividualTicketPriceInstance: CalculateIndividualTicketPrice;
	applyDiscountsInstance: ApplyDiscounts;

	constructor() {
		// Initialize the instances in the constructor
		this.validateInputInstance = new ValidateInput();
		this.fetchTicketPriceInstance = new FetchTicketPrice();
		this.calculateIndividualTicketPriceInstance = new CalculateIndividualTicketPrice();
		this.applyDiscountsInstance = new ApplyDiscounts();
	}

	async estimateTrainTicketPrice(trainDetails: TripRequest): Promise<number> {
		// Validate the input trip details
		this.validateInputInstance.validateInput(trainDetails);

		// If there are no passengers, return 0 as the ticket price
		if (trainDetails.passengers.length === 0) {
			return 0;
		}

		// Fetch the ticket price based on the trip details
		const fetchTicketWithParams = await this.fetchTicketPriceInstance.fetchTicketPrice(trainDetails);

		// Filter the passengers who have a family discount
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

		// Calculate the individual ticket prices for all passengers
		const individualTicketPrices = await Promise.all(
			trainDetails.passengers.map((passenger) =>
				this.calculateIndividualTicketPriceInstance.calculateIndividualTicketPrice(
					fetchTicketWithParams,
					passenger,
					trainDetails
				)
			)
		);

		// Sum up the individual ticket prices to get the total ticket price
		const totalTicketPrice = individualTicketPrices.reduce((total, price) => total + price, 0);

		// Apply discounts to the total ticket price and return it
		return this.applyDiscountsInstance.applyDiscounts(totalTicketPrice, fetchTicketWithParams, trainDetails);
	}
}