import type { INodeProperties } from 'n8n-workflow';

import * as custom from './custom.operation';

export { custom };

export const description: INodeProperties[] = [
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { category: ['custom'] } },
		options: [
			{
				name: 'Custom',
				value: 'custom',
				action: 'Make a custom API request',
			},
		],
		default: 'custom',
	},
	...custom.description,
];
