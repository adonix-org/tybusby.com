import { Products } from "./products.js";

const hazard = await new Products("HWO", "BGM").get();

console.log(hazard ?? "Product Not Found");
