import { BasicWorker, StatusCodes } from "@adonix.org/cloud-spark";

class Intercept extends BasicWorker {
    protected override async get(): Promise<Response> {
        const response = await this.env.ASSETS.fetch(this.request);

        if (response.status === StatusCodes.NOT_FOUND) {
            return this.env.ASSETS.fetch(
                new URL("/404.html", this.request.url)
            );
        }

        return response;
    }
}

export default Intercept.ignite();
