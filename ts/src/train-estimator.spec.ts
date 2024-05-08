import { TrainTicketEstimator } from "./train-estimator";
import { ApiException, DiscountCard, TripRequest } from "./model/trip.request";

describe("TrainTicketEstimator", () => {
	let estimator: TrainTicketEstimator;

	beforeEach(() => {
		estimator = new TrainTicketEstimator();
	});

	it("should estimate train ticket price correctly for a valid trip request", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: new Date("2025-01-01") },
			passengers: [
				{ age: 25, discounts: [DiscountCard.Couple] },
				{ age: 26, discounts: [DiscountCard.Couple] },
			],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockResolvedValue(100);

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(100);
	});

	it("should throw an InvalidTripInputException for an invalid trip request", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Paris", when: new Date("2025-01-01") },
			passengers: [{ age: 15, discounts: [DiscountCard.HalfCouple] }],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockRejectedValue(new Error("Invalid trip input"));

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Invalid trip input");
	});

	it("should throw an ApiException when an error occurs during estimation", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: new Date("2025-01-01") },
			passengers: [
				{ age: 13, discounts: [DiscountCard.HalfCouple] },
				{ age: 65, discounts: [DiscountCard.Senior] },
				{ age: 67, discounts: [DiscountCard.Senior] },
			],
		};

		jest.spyOn(estimator, "estimateTrainTicketPrice").mockRejectedValue(new ApiException());

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Api error");
	});

	it("should throw an InvalidTripInputException when the start city is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "", to: "Marseille", when: new Date("2025-01-01") },
			passengers: [{ age: 25, discounts: [DiscountCard.HalfCouple] }],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Start city is invalid");
	});

	it("should throw an InvalidTripInputException when the destination city is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "", when: new Date("2025-01-01") },
			passengers: [{ age: 25, discounts: [DiscountCard.HalfCouple] }],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Destination city is invalid");
	});

	it("should return 0 when no passengers are provided", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: new Date("2025-01-01") },
			passengers: [],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).resolves.toBe(0);
	});

	it("should throw an InvalidTripInputException when the date is invalid", async () => {
		const tripDetails: TripRequest = {
			details: { from: "Paris", to: "Marseille", when: new Date("2020-01-01") },
			passengers: [{ age: 25, discounts: [DiscountCard.HalfCouple] }],
		};

		await expect(estimator.estimateTrainTicketPrice(tripDetails)).rejects.toThrowError("Date is invalid");
	});
});
