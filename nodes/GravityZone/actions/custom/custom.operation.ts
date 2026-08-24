import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { processJsonInput, updateDisplayOptions, wrapData } from '../../utils/utilities';

import { gravityZoneApiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName:
			'Documentation: <a href="https://www.bitdefender.com/business/support/en/77209-125277-public-api.html" target="_blank" rel="noopener noreferrer">Public API</a>',
		name: 'customDocsNotice',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'API Version',
		name: 'apiVersion',
		type: 'string',
		required: true,
		default: 'v1.0',
		placeholder: 'v1.0',
		description: 'The API version segment of the request path',
	},
	{
		displayName: 'Endpoint',
		name: 'endpoint',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'general',
		description: 'The API endpoint to call, appended after the "jsonrpc/" path segment',
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'getApiKeyDetails',
		description: 'The JSON-RPC method to invoke on the endpoint',
	},
	{
		displayName: 'Parameters (JSON)',
		name: 'params',
		type: 'json',
		default: '{}',
		description: 'The params object sent with the request',
		typeOptions: { alwaysOpenEditWindow: true },
	},
];

const displayOptions = { show: { category: ['custom'], action: ['custom'] } };

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const apiVersion = this.getNodeParameter('apiVersion', i) as string;
	const endpoint = this.getNodeParameter('endpoint', i) as string;
	const method = this.getNodeParameter('method', i) as string;
	const params = processJsonInput(this, this.getNodeParameter('params', i), 'Parameters') as IDataObject;

	const responseData = await gravityZoneApiRequest.call(this, endpoint, method, params, apiVersion);

	return this.helpers.constructExecutionMetaData(wrapData(responseData), { itemData: { item: i } });
}
