import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as fs from 'fs'
const {SecretClient} = require("@azure/keyvault-secrets")
const { ClientSecretCredential }=  require("@azure/identity")

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	context.log('Post Query Executed')
	let key: string
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
	let name = req.body && req.body.name;
	let age = req.body && req.body.age;
	let newUser;
	let responseMessage: string
	let responseStatus: number

	if(name && age &&key===mySecret.value){

	
	newUser = {
		name,
		age,
	};
	const data = fs.readFileSync('./jdata.json','utf-8');
	const jsonData = JSON.parse(data);
	jsonData.push(newUser);
	fs.writeFileSync('./jdata.json', JSON.stringify(jsonData));
	responseMessage = newUser
	responseStatus = 200

}else {
	responseMessage="Bad Requst baby"
	responseStatus=400
}


	context.res = {
		status: responseStatus,
		body: responseMessage

	};
};

export default httpTrigger;
