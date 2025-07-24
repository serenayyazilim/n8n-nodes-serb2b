import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeApiError,
} from 'n8n-workflow';

import {
	serB2BApiRequest,
} from './GenericFunctions';

export class SerB2BTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SerB2B Trigger',
		name: 'serB2BTrigger',
		icon: 'file:serb2b.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts workflow when SerB2B events occur',
		defaults: {
			name: 'SerB2B Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'serB2BApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'orders/create',
				typeOptions: {
					loadOptionsMethod: 'getEvents',
				},
				description: 'The event to listen for',
			},
		],
	};

	methods = {
		loadOptions: {
			async getEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const events = await serB2BApiRequest.call(this, 'GET', '/n8n/events');
				const returnData: INodePropertyOptions[] = [];

				for (const eventKey of Object.keys(events)) {
					returnData.push({
						name: events[eventKey],
						value: eventKey,
					});
				}

				return returnData;
			},
		},
	};

	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default')?.replace('localhost', '192.168.10.202') || '';
				const event = this.getNodeParameter('event') as string;

				const webhooks = await serB2BApiRequest.call(this, 'GET', '/Webhooks');

				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl && webhook.event === event) {
						// Webhook exists already
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhook.id;
						return true;
					}
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default')?.replace('localhost', '192.168.10.202') || '';
				const event = this.getNodeParameter('event') as string;

				const body = {
					url: webhookUrl,
					event: event,
					status: 1,
					name: `n8n-${this.getWorkflow().name}-${event}`,
					custom_header: JSON.stringify({
						'X-N8n-Webhook': 'true',
						'X-N8n-Event': event,
					}),
				};

				const responseData = await serB2BApiRequest.call(this, 'POST', '/Webhooks', body);

				if (responseData.id === undefined) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.id;
				webhookData.event = event;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await serB2BApiRequest.call(this, 'DELETE', `/Webhooks/${webhookData.webhookId}`);
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.event;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headerData = this.getHeaderData() as IDataObject;
		const req = this.getRequestObject();
		const event = this.getNodeParameter('event') as string;

		// Verify webhook signature (optional - following Shopify pattern)
		// const apiToken = await this.getCredentials('serB2BApi');
		// TODO: Implement HMAC verification if needed

		// Verify event matches what we're listening for
		if (headerData['x-serb2b-event'] !== event) {
			return {};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}