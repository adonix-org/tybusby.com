import { BasicWorker, NotFound, StatusCodes } from "@adonix.org/cloud-spark";

class Intercept extends BasicWorker {
    protected override async get(): Promise<Response> {
        const response = await this.env.ASSETS.fetch(this.request);
        if (response.status === StatusCodes.NOT_FOUND) {
            console.log(response);
            return this.response(NotFound);
        }
        return response;
    }
}

export default Intercept.ignite();
