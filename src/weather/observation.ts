export interface Observation {
    id: string;
    type: string;
    geometry: Geometry;
    properties: Properties;
}

interface Geometry {
    type: string;
    coordinates: number[];
}

interface Properties {
    id: string;
    type: string;
    elevation: QuantitativeValue;
    station: string;
    stationID: string;
    stationName: string;
    timestamp: Date;
    rawMessage: string;
    textDescription: string;
    icon: string;
    temperature: QuantitativeValue;
    dewpoint: QuantitativeValue;
    windDirection: QuantitativeValue;
    windSpeed: QuantitativeValue;
    windGust: QuantitativeValue;
    barometricPressure: QuantitativeValue;
    seaLevelPressure: QuantitativeValue;
    visibility: QuantitativeValue;
    maxTemperatureLast24Hours: QuantitativeValue;
    minTemperatureLast24Hours: QuantitativeValue;
    precipitationLastHour: QuantitativeValue;
    precipitationLast3Hours: QuantitativeValue;
    precipitationLast6Hours: QuantitativeValue;
    relativeHumidity: QuantitativeValue;
    windChill: QuantitativeValue;
    heatIndex: QuantitativeValue;
    cloudLayers: CloudLayer[];
}

interface QuantitativeValue {
    unitCode: string;
    value: number | null;
    qualityControl?: QualityControl;
}

type QualityControl = {
    Z: "Z";
    C: "C";
    S: "S";
    V: "V";
    X: "X";
    Q: "Q";
    G: "G";
    B: "B";
    T: "T";
};

interface CloudLayer {
    base: QuantitativeValue;
    amount: string;
}
