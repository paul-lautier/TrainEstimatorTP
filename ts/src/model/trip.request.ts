export class Passenger {
    constructor(readonly age: number, readonly discounts: DiscountCard[]){}
}

export class TripRequest {
    constructor(readonly details: TripDetails, readonly passengers: Passenger[]){}
}

export class TripDetails {
    constructor(readonly from: string, readonly to: string, readonly when: Date) {
    }
}

export class InvalidTripInputException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ApiException extends Error {
    constructor() {
        super("Api error");
    }
}

export enum DiscountCard {
    Senior = "Senior",
    TrainStroke= "TrainStroke",
    Couple = "Couple",
    HalfCouple = "HalfCouple",
}