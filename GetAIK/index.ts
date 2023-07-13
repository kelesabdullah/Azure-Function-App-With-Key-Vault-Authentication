import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as fs from 'fs'
const {SecretClient} = require("@azure/keyvault-secrets")
const { ClientSecretCredential }=  require("@azure/identity")


const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	context.log("Get Query Executed")
	let data: string
	let key: string;
	key = req.body && req.body.key;

	const secretData = fs.readFileSync('./secret.json','utf-8')
	const secretJson = JSON.parse(secretData)
	const tenant_id = secretJson.tenant_id
	const client_id = secretJson.client_id
	const secret_id = secretJson.client_secret

	const keyVaultUri = `Your Key Vault URL`
	const credential = new ClientSecretCredential(
		tenant_id,
		client_id,
		secret_id
	  );
    const secretClient = new SecretClient(keyVaultUri,credential)
    const mySecret = await secretClient.getSecret("your key value name")
	let responseStatus: number;
	let responseMessage: string;

	if (key && key===mySecret.value) {
		data = fs.readFileSync('./jdata.json','utf-8')
		const jsonData = JSON.parse(data);
		const jsonstring = JSON.stringify(jsonData,null,2);
		responseStatus = 200;
		responseMessage = jsonstring;
	} else {
		responseStatus = 400;
		responseMessage = "Bad request bebegiiimmm";
	}
	context.res = {
		status: responseStatus,
		body: responseMessage
	};
};


export default httpTrigger;
