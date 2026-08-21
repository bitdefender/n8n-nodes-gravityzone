import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as accounts from './accounts';
import * as companies from './companies';
import * as custom from './custom';
import * as general from './general';
import * as incidents from './incidents';
import * as integrations from './integrations';
import * as licensing from './licensing';
import * as maintenanceWindows from './maintenance_windows';
import * as network from './network';
import type { GravityZoneType } from './node.type';
import * as packages from './packages';
import * as patchManagement from './patch_management';
import * as phasr from './phasr';
import * as policies from './policies';
import * as push from './push';
import * as quarantine from './quarantine';
import * as reports from './reports';

export async function router(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('category', itemIndex) as string;
	const operation = this.getNodeParameter('action', itemIndex) as string;

	const gravityZoneData = { resource, operation } as unknown as GravityZoneType;

	let executionData: INodeExecutionData[] = [];

	switch (gravityZoneData.resource) {
		case 'accounts':
			executionData = await accounts[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'companies':
			executionData = await companies[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'custom':
			executionData = await custom[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'general':
			executionData = await general[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'incidents':
			executionData = await incidents[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'integrations':
			executionData = await integrations[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'licensing':
			executionData = await licensing[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'maintenance_windows':
			executionData = await maintenanceWindows[gravityZoneData.operation].execute.call(
				this,
				itemIndex,
			);
			break;
		case 'network':
			executionData = await network[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'packages':
			executionData = await packages[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'patch_management':
			executionData = await patchManagement[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'phasr':
			executionData = await phasr[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'policies':
			executionData = await policies[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'push':
			executionData = await push[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'quarantine':
			executionData = await quarantine[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		case 'reports':
			executionData = await reports[gravityZoneData.operation].execute.call(this, itemIndex);
			break;
		default:
			throw new NodeOperationError(this.getNode(), 'Category not supported', {
				itemIndex,
			});
	}

	return executionData;
}
