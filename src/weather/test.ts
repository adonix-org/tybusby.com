import { Products } from "./products.js";

const hazard = await new Products("HWO", "LWX").get();

console.log(hazard ?? "Product Not Found");
