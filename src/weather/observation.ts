/*
 * Copyright (C) 2025 Ty Busby
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

type QualityControl = "Z" | "C" | "S" | "V" | "X" | "Q" | "G" | "B" | "T";

interface CloudLayer {
    base: QuantitativeValue;
    amount: string;
}
