/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as service from './actions/service/service';
import * as deploy from './actions/deploy/deploy';
import * as customDomain from './actions/customDomain/customDomain';
import * as environmentVariable from './actions/environmentVariable/environmentVariable';
import * as secretFile from './actions/secretFile/secretFile';
import * as project from './actions/project/project';
import * as environment from './actions/environment/environment';
import * as postgres from './actions/postgres/postgres';
import * as keyValue from './actions/keyValue/keyValue';
import * as disk from './actions/disk/disk';
import * as environmentGroup from './actions/environmentGroup/environmentGroup';
import * as webhook from './actions/webhook/webhook';

// Log licensing notice once on module load
const licensingNoticeLogged = false;
if (!licensingNoticeLogged) {
	console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
}

export class RenderCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Render Cloud',
		name: 'renderCloud',
		icon: 'file:renderCloud.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Render Cloud API to manage services, databases, and deployments',
		defaults: {
			name: 'Render Cloud',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'renderCloudApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Custom Domain',
						value: 'customDomain',
						description: 'Manage custom domains for services',
					},
					{
						name: 'Deploy',
						value: 'deploy',
						description: 'Trigger and manage service deployments',
					},
					{
						name: 'Disk',
						value: 'disk',
						description: 'Manage persistent disks and snapshots',
					},
					{
						name: 'Environment',
						value: 'environment',
						description: 'Manage environments within projects',
					},
					{
						name: 'Environment Group',
						value: 'environmentGroup',
						description: 'Manage shared environment variables and secrets',
					},
					{
						name: 'Environment Variable',
						value: 'environmentVariable',
						description: 'Manage environment variables for services',
					},
					{
						name: 'Key Value (Redis)',
						value: 'keyValue',
						description: 'Manage Redis/Key Value instances',
					},
					{
						name: 'Postgres',
						value: 'postgres',
						description: 'Manage PostgreSQL database instances',
					},
					{
						name: 'Project',
						value: 'project',
						description: 'Manage Render projects',
					},
					{
						name: 'Secret File',
						value: 'secretFile',
						description: 'Manage secret files for services',
					},
					{
						name: 'Service',
						value: 'service',
						description: 'Manage web services, static sites, workers, and cron jobs',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Manage webhooks for event notifications',
					},
				],
				default: 'service',
			},

			// Service operations and fields
			...service.serviceOperations,
			...service.serviceFields,

			// Deploy operations and fields
			...deploy.deployOperations,
			...deploy.deployFields,

			// Custom Domain operations and fields
			...customDomain.customDomainOperations,
			...customDomain.customDomainFields,

			// Environment Variable operations and fields
			...environmentVariable.environmentVariableOperations,
			...environmentVariable.environmentVariableFields,

			// Secret File operations and fields
			...secretFile.secretFileOperations,
			...secretFile.secretFileFields,

			// Project operations and fields
			...project.projectOperations,
			...project.projectFields,

			// Environment operations and fields
			...environment.environmentOperations,
			...environment.environmentFields,

			// Postgres operations and fields
			...postgres.postgresOperations,
			...postgres.postgresFields,

			// Key Value (Redis) operations and fields
			...keyValue.keyValueOperations,
			...keyValue.keyValueFields,

			// Disk operations and fields
			...disk.diskOperations,
			...disk.diskFields,

			// Environment Group operations and fields
			...environmentGroup.environmentGroupOperations,
			...environmentGroup.environmentGroupFields,

			// Webhook operations and fields
			...webhook.webhookOperations,
			...webhook.webhookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData;

				switch (resource) {
					case 'service':
						responseData = await service.executeServiceOperation.call(this, operation, i);
						break;
					case 'deploy':
						responseData = await deploy.executeDeployOperation.call(this, operation, i);
						break;
					case 'customDomain':
						responseData = await customDomain.executeCustomDomainOperation.call(this, operation, i);
						break;
					case 'environmentVariable':
						responseData = await environmentVariable.executeEnvironmentVariableOperation.call(this, operation, i);
						break;
					case 'secretFile':
						responseData = await secretFile.executeSecretFileOperation.call(this, operation, i);
						break;
					case 'project':
						responseData = await project.executeProjectOperation.call(this, operation, i);
						break;
					case 'environment':
						responseData = await environment.executeEnvironmentOperation.call(this, operation, i);
						break;
					case 'postgres':
						responseData = await postgres.executePostgresOperation.call(this, operation, i);
						break;
					case 'keyValue':
						responseData = await keyValue.executeKeyValueOperation.call(this, operation, i);
						break;
					case 'disk':
						responseData = await disk.executeDiskOperation.call(this, operation, i);
						break;
					case 'environmentGroup':
						responseData = await environmentGroup.executeEnvironmentGroupOperation.call(this, operation, i);
						break;
					case 'webhook':
						responseData = await webhook.executeWebhookOperation.call(this, operation, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
