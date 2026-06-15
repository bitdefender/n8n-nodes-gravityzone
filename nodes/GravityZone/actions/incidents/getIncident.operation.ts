import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, wrapData } from '../../utils/utilities';

import { gravityZoneApiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName:
			'Documentation: <a href="https://www.bitdefender.com/business/support/en/77209-1464000-getincident.html" target="_blank" rel="noopener noreferrer">Get Incident</a>',
		name: 'getIncidentDocsNotice',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Incident ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description:
			'The ID of the incident to retrieve, as found in the URL of the incident details page in the GravityZone Control Center. Must be exactly 24 hexadecimal characters.',
	},
];

const displayOptions = { show: { category: ['incidents'], action: ['getIncident'] } };

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', i) as string;

	const params: IDataObject = { id };

	const responseData = await gravityZoneApiRequest.call(
		this,
		'incidents',
		'getIncident',
		params,
		'v1.2',
	);

	return this.helpers.constructExecutionMetaData(wrapData(responseData), { itemData: { item: i } });
}
