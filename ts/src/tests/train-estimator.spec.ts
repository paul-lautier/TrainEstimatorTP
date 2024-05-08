import { TrainTicketEstimator } from "../TrainTicketEstimator";
import { ApiException, DiscountCard, TripRequest } from "../model/trip.request";

describe("TrainTicketEstimator", () => {
	let estimator: TrainTicketEstimator;
	const newDate = new Date();

	beforeEach(() => {
		estimator = new TrainTicketEstimator();
	});

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

	it("should return 0 when no passengers are provided", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: newDate },
			passengers: [],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(0);
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
});
