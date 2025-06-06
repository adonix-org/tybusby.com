import { Observation } from "./observation";

const response = await fetch(
    "https://api.weather.gov/stations/KELM/observations/latest",
    {
        method: "GET",
        headers: {
            "User-Agent": "www.tybusby.com (tybusby@gmail.com)",
        },
    }
);

if (response.ok) {
    const observation: Observation = await response.json();
    console.log(observation);
}
