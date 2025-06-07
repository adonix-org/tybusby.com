export class NationalWeatherService {
    private static readonly API_URL: string = "https://api.weather.gov";
    private static readonly HEADERS: {
        "User-Agent": "www.tybusby.com (tybusby@gmail.com)";
        Accept: "application/geo+json";
    };

    constructor() {}

    public static async fetch<T>(resource: string): Promise<T> {
        const response = await fetch(
            `${NationalWeatherService.API_URL}${resource}`,
            {
                headers: this.HEADERS,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data as T;
    }
}
