import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

export async function serB2BApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: any,
	qs?: IDataObject,
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('serB2BApi');

	let options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: uri || `${credentials.domain}/api/v1${endpoint}`,
		json: true,
	};

	options = Object.assign({}, options, option);

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'serB2BApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function serB2BApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: any,
	query?: IDataObject,
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	let page = 1;
	const limit = 100;

	query = query || {};

	do {
		query.limit = limit;
		query.page = page;

		responseData = await serB2BApiRequest.call(this, method, endpoint, body, query);

		if (Array.isArray(responseData)) {
			returnData.push(...responseData);
		} else if (responseData.data && Array.isArray(responseData.data)) {
			returnData.push(...responseData.data);
		}

		page++;
	} while (
		responseData.length === limit ||
		(responseData.data && responseData.data.length === limit)
	);

	return returnData;
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}