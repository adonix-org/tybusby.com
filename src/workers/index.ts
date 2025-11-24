import { BasicWorker, NotFound } from "@adonix.org/cloud-spark";

class Intercept extends BasicWorker {
    protected override async get(): Promise<Response> {
        const response = await this.env.ASSETS.fetch(this.request);
        if (response.ok) {
            return response;
        }

        return this.response(NotFound);
    }
}

export default Intercept.ignite();
