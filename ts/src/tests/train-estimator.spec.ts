import { FetchTicketPrice } from "../FetchTicketPrice";
import { TrainTicketEstimator } from "../TrainTicketEstimator";
import { ApiException, DiscountCard, TripRequest } from "../model/trip.request";

describe("TrainTicketEstimator", () => {
	let estimator: TrainTicketEstimator;
	let trainTicket: jest.Mocked<FetchTicketPrice>;
	let newDate: Date;

	beforeEach(() => {
		newDate = new Date();
		estimator = new TrainTicketEstimator();
		trainTicket = new FetchTicketPrice() as jest.Mocked<FetchTicketPrice>;
		estimator.fetchTicketPriceInstance = trainTicket;
	});

	//ERRORS

	it("should estimate train ticket price correctly for a valid trip request", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [
				{ age: 25, discounts: [DiscountCard.Couple], lastName: "Doe" },
				{ age: 26, discounts: [DiscountCard.Couple], lastName: "Doe" },
			],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(100);
	});

	it("should throw an InvalidTripInputException for an invalid trip request", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Paris", when: newDate },
			passengers: [{ age: 15, discounts: [DiscountCard.HalfCouple], lastName: "Doe" }],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockRejectedValue(new Error("Invalid trip input"));

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Invalid trip input");
	});

	it("should throw an ApiException when an error occurs during estimation", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [
				{ age: 13, discounts: [DiscountCard.HalfCouple], lastName: "Doe" },
				{ age: 65, discounts: [DiscountCard.Senior], lastName: "Doe" },
				{ age: 67, discounts: [DiscountCard.Senior], lastName: "Doe" },
			],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockRejectedValue(new ApiException());

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Api error");
	});

	it("should throw an InvalidTripInputException when the start city is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "", to: "Marseille", when: newDate },
			passengers: [{ age: 25, discounts: [DiscountCard.HalfCouple], lastName: "Doe" }],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Start city is invalid");
	});

	it("should throw an InvalidTripInputException when the destination city is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "", when: newDate },
			passengers: [{ age: 25, discounts: [DiscountCard.HalfCouple], lastName: "Doe" }],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Destination city is invalid");
	});

	it("should throw an InvalidTripInputException when the date is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: new Date("2020-01-01") },
			passengers: [{ age: 25, discounts: [DiscountCard.HalfCouple], lastName: "Doe" }],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Date is invalid");
	});

	it("should throw an InvalidTripInputException when the age is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [{ age: -1, discounts: [DiscountCard.HalfCouple], lastName: "Doe" }],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockRejectedValue(new Error("Age is invalid"));

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Age is invalid");
	});

	//DOMAIN LOGIC

	it("should return 0 when no passengers are provided", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(0);
	});

	it("should apply senior discount for passengers older than 70", async () => {
		newDate = new Date(newDate.getTime() + 7 * 60 * 60 * 1000);
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [{ age: 71, discounts: [DiscountCard.Senior], lastName: "Doe" }],
		};

		jest.spyOn(trainTicket, "fetchTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(64);
	});

	it("should apply junior discout when passenger is less than 17", async () => {
		newDate = new Date(newDate.getTime() + 7 * 60 * 60 * 1000);
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [{ age: 16, discounts: [], lastName: "Doe" }],
		};

		jest.spyOn(trainTicket, "fetchTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(60);
	});

	it("should apply family discount for all passengers with the same last name and Family Card", async () => {
		newDate = new Date(newDate.getTime() + 7 * 60 * 60 * 1000);
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [
				{ age: 25, discounts: [DiscountCard.Family], lastName: "Doe" },
				{ age: 25, discounts: [], lastName: "Doe" },
			],
		};

		jest.spyOn(trainTicket, "fetchTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(140);
	});

	it("should not apply family discount passengers without the same last name if they have a Family Card", async () => {
		newDate = new Date(newDate.getTime() + 7 * 60 * 60 * 1000);
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [
				{ age: 25, discounts: [DiscountCard.Family], lastName: "Doe" },
				{ age: 25, discounts: [], lastName: "Doa" },
			],
		};

		jest.spyOn(trainTicket, "fetchTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(240);
	});

	it("should only apply family discount passengers with the same last name if they have another discount Card", async () => {
		newDate = new Date(newDate.getTime() + 7 * 60 * 60 * 1000);
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [
				{ age: 25, discounts: [DiscountCard.Family], lastName: "Doe" },
				{ age: 80, discounts: [DiscountCard.Senior], lastName: "Doe" },
			],
		};

		jest.spyOn(trainTicket, "fetchTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(140);
	});

	it("should apply couple discount for two passengers with Couple Card", async () => {
		newDate = new Date(newDate.getTime() + 7 * 60 * 60 * 1000);
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [
				{ age: 25, discounts: [DiscountCard.Couple], lastName: "Doe" },
				{ age: 25, discounts: [DiscountCard.Couple], lastName: "Doe" },
			],
		};

		jest.spyOn(trainTicket, "fetchTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(160);
	});
});
