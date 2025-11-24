import { RouteWorker } from "@adonix.org/cloud-spark";

class Router extends RouteWorker {
    protected override get(): Promise<Response> {
        return this.env.ASSETS.fetch(this.request);
    }
}

export default Router.ignite();
