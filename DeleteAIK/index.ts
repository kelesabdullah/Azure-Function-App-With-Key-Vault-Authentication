import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as fs from 'fs'
const {SecretClient} = require("@azure/keyvault-secrets")
const { ClientSecretCredential }=  require("@azure/identity")

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Delete Query Executed');

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

    let responseMessage: string
    let responseStatus: number
    let name = req.body && req.body.name;
    let key = req.body && req.body.key;
    if (name &&key===mySecret.value){
    let data : string
    data = fs.readFileSync('./jdata.json','utf-8')
    const jsonData = JSON.parse(data);

    for (var i=0;i<jsonData.length;i++){
        if (jsonData[i].name===name){
            jsonData.splice(i,1)
        }
    }


    const updatedData = JSON.stringify(jsonData,null,2);
    fs.writeFileSync('./jdata.json',updatedData)

    responseMessage = updatedData
    responseStatus = 200

    }
    else {
        responseMessage = "Bad request baby"
        responseStatus = 400
    };

    context.res={
        status: responseStatus,
        body: responseMessage
    }

};

export default httpTrigger;