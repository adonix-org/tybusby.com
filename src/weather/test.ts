import { Products } from "./products.js";

const hazard = await new Products("HWO", "BGM").get();

if (!hazard) {
    console.log("Product Not Found");
} else {
    console.log(hazard?.id);
}
