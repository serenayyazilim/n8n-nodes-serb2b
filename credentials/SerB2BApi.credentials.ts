import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SerB2BApi implements ICredentialType {
	name = 'serB2BApi';
	displayName = 'SerB2B API';
	documentationUrl = 'https://docs.serb2b.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API token for SerB2B. You can find this in Admin Panel > Settings > API Settings.',
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://your-domain.com',
			description: 'Your SerB2B instance URL',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Serb2b-Access-Token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.domain}}',
			url: '/api/v1/n8n/events',
			method: 'GET',
		},
	};
}