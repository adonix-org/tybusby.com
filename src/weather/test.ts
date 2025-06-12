import { WeatherLocation } from "./location.js";

const weather = await WeatherLocation.create();

console.log(weather.station?.properties.provider);
