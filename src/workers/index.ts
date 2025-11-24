import { BasicWorker } from "@adonix.org/cloud-spark";

class Intercept extends BasicWorker {
    protected override async get(): Promise<Response> {
        return await this.env.ASSETS.fetch(this.request);
    }
}

export default Intercept.ignite();
