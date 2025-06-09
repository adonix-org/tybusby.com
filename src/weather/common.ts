export interface QuantitativeValue {
    unitCode: string;
    value: number | null;
    qualityControl?: QualityControl;
}

type QualityControl = "Z" | "C" | "S" | "V" | "X" | "Q" | "G" | "B" | "T";
