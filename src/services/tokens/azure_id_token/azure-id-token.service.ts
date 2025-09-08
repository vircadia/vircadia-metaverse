// Initializes the `oauth/azure/id-token` service on path `/oauth/azure/id-token`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../../declarations";
import { AzureIdTokenExchange } from "./azure-id-token.class";

// Add this service to the service type index
declare module "../../../declarations" {
	interface ServiceTypes {
		"oauth/azure/id-token": AzureIdTokenExchange & ServiceAddons<any>;
	}
}

export default function (app: Application): void {
	const options = { paginate: app.get("paginate") } as Partial<any>;
	app.use("/oauth/azure/id-token", new AzureIdTokenExchange(options, app));
}
