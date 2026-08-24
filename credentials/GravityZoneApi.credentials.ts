import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class GravityZoneApi implements ICredentialType {
	name = 'gravityZoneApi';
	displayName = 'Bitdefender GravityZone API';
	documentationUrl = 'https://www.bitdefender.com/business/support/en/77212-125277-public-api.html';
	icon: Icon = {
		light: 'file:../nodes/GravityZone/gravityZone.svg',
		dark: 'file:../nodes/GravityZone/gravityZone.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://cloud.gravityzone.bitdefender.com/api',
			required: true,
			description: 'The base URL for the GravityZone API',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
			description:
				'The API key generated in the MyAccount section of the GravityZone Control Center',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const apiKey = credentials.apiKey as string;

		const encoded = Buffer.from(`${apiKey}:`).toString('base64');

		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: `Basic ${encoded}`,
		};

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{$credentials.apiUrl}}',
			url: '/v1.0/jsonrpc/general',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: 'credential-test',
				jsonrpc: '2.0',
				method: 'getApiKeyDetails',
				params: {},
			}),
		},
	};
}
