import { Variant,Record,Opt,nat64,nat32 } from "azle";

export type AssetClass = Variant< { Cryptocurrency:null; FiatCurrency:null; }>;

export type Asset = Record <{
    symbol: String;
    class: AssetClass;
}>;

// The parameters for the `get_exchange_rate` API call.
export type GetExchangeRateRequest = Record <{
    base_asset: Asset;
    quote_asset: Asset;
    // An optional timestamp to get the rate for a specific time period.
    timestamp: Opt< nat64>;
}>; 

export type ExchangeRateMetadata = Record< {
    decimals: nat32;
    base_asset_num_received_rates: nat64;
    base_asset_num_queried_sources: nat64;
    quote_asset_num_received_rates: nat64;
    quote_asset_num_queried_sources: nat64;
    standard_deviation: nat64;
    forex_timestamp: Opt< nat64>;
}>;

export type ExchangeRate = Record <{
    base_asset: Asset;
    quote_asset: Asset;
    timestamp: nat64;
    rate: nat64;
    metadata: ExchangeRateMetadata;
}>;

export type ExchangeRateError = Variant< {
    // Returned when the canister receives a call from the anonymous principal.
    AnonymousPrincipalNotAllowed: null;
    /// Returned when the canister is in process of retrieving a rate from an exchange.
    Pending: null;
    // Returned when the base asset rates are not found from the exchanges HTTP outcalls.
    CryptoBaseAssetNotFound: null;
    // Returned when the quote asset rates are not found from the exchanges HTTP outcalls.
    CryptoQuoteAssetNotFound: null;
    // Returned when the stablecoin rates are not found from the exchanges HTTP outcalls needed for computing a crypto/fiat pair.
    StablecoinRateNotFound: null;
    // Returned when there are not enough stablecoin rates to determine the forex/USDT rate.
    StablecoinRateTooFewRates: null;
    // Returned when the stablecoin rate is zero.
    StablecoinRateZeroRate: null;
    // Returned when a rate for the provided forex asset could not be found at the provided timestamp.
    ForexInvalidTimestamp: null;
    // Returned when the forex base asset is found.
    ForexBaseAssetNotFound: null;
    // Returned when the forex quote asset is found.
    ForexQuoteAssetNotFound: null;
    // Returned when neither forex asset is found.
    ForexAssetsNotFound: null;
    // Returned when the caller is not the CMC and there are too many active requests.
    RateLimited: null;
    // Returned when the caller does not send enough cycles to make a request.
    NotEnoughCycles: null;
    // Returned when the canister fails to accept enough cycles.
    FailedToAcceptCycles: null;
    /// Returned if too many collected rates deviate substantially.
    InconsistentRatesReceived: null;
    // Until candid bug is fixed, new errors after launch will be placed here.
    Other: Record <{
        // The identifier for the error that occurred.
        code: nat32;
        // A description of the error that occurred.
        description: string;
    }>
}>;

export type GetExchangeRateResult = Variant< {
    // Successfully retrieved the exchange rate from the cache or API calls.
    Ok: ExchangeRate;
    // Failed to retrieve the exchange rate due to invalid API calls, invalid timestamp, etc.
    Err: ExchangeRateError;
}>;