import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import * as accounts from './actions/accounts';
import * as companies from './actions/companies';
import * as custom from './actions/custom';
import * as general from './actions/general';
import * as incidents from './actions/incidents';
import * as integrations from './actions/integrations';
import * as licensing from './actions/licensing';
import * as maintenanceWindows from './actions/maintenance_windows';
import * as network from './actions/network';
import * as packages from './actions/packages';
import * as patchManagement from './actions/patch_management';
import * as phasr from './actions/phasr';
import * as policies from './actions/policies';
import * as push from './actions/push';
import * as quarantine from './actions/quarantine';
import * as reports from './actions/reports';
import { router } from './actions/router';

export class GravityZone implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bitdefender GravityZone',
		name: 'gravityZone',
		icon: {
			light: 'file:gravityZone.svg',
			dark: 'file:gravityZone.dark.svg',
		},
		group: ['output'],
		version: 1,
		description: 'Consume the Bitdefender GravityZone API',
		subtitle: '={{$parameter["category"] + ": " + $parameter["action"]}}',
		defaults: {
			name: 'Bitdefender GravityZone',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'gravityZoneApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{ name: 'Accounts', value: 'accounts' },
					{ name: 'Companies', value: 'companies' },
					{ name: 'Custom', value: 'custom' },
					{ name: 'General', value: 'general' },
					{ name: 'Incidents', value: 'incidents' },
					{ name: 'Integrations', value: 'integrations' },
					{ name: 'Licensing', value: 'licensing' },
					{ name: 'Maintenance Windows', value: 'maintenance_windows' },
					{ name: 'Network', value: 'network' },
					{ name: 'Packages', value: 'packages' },
					{ name: 'Patch Management', value: 'patch_management' },
					{ name: 'PHASR', value: 'phasr' },
					{ name: 'Policies', value: 'policies' },
					{ name: 'Push', value: 'push' },
					{ name: 'Quarantine', value: 'quarantine' },
					{ name: 'Reports', value: 'reports' },
				],
				default: 'general',
			},
			...accounts.description,
			...companies.description,
			...custom.description,
			...general.description,
			...incidents.description,
			...integrations.description,
			...licensing.description,
			...maintenanceWindows.description,
			...network.description,
			...packages.description,
			...patchManagement.description,
			...phasr.description,
			...policies.description,
			...push.description,
			...quarantine.description,
			...reports.description,
		],
	};

	methods = {};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const executionData = await router.call(this, i);

				returnData.push.apply(returnData, executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);

					returnData.push.apply(returnData, errorData);

					continue;
				}

				if (error instanceof NodeApiError) {
					throw new NodeApiError(this.getNode(), error as unknown as JsonObject, {
						itemIndex: i,
					});
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
