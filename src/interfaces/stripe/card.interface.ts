export interface IStripeCard {
    id?: string;
    customer: string;
    brand: string;
    country: string;
    last4: string;
    number: string;
    expMonth: number;
    cvc: string;
    expYear: number
}