/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	renderCloudApiRequest,
	validateServiceId,
} from '../../transport/GenericFunctions';

export const environmentVariableOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
			},
		},
		options: [
			{
				name: 'Add or Update',
				value: 'addOrUpdate',
				description: 'Add or update a single environment variable',
				action: 'Add or update an environment variable',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment variable',
				action: 'Delete an environment variable',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a specific environment variable',
				action: 'Get an environment variable',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List environment variables for a service',
				action: 'List environment variables',
			},
			{
				name: 'Update All',
				value: 'updateAll',
				description: 'Update all environment variables (replace)',
				action: 'Update all environment variables',
			},
		],
		default: 'list',
	},
];

export const environmentVariableFields: INodeProperties[] = [
	// ----------------------------------
	//         environmentVariable: all operations
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
			},
		},
		description: 'The ID of the service (srv-xxxxx format)',
	},
	// ----------------------------------
	//         environmentVariable: get, delete
	// ----------------------------------
	{
		displayName: 'Environment Variable Key',
		name: 'envVarKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The key of the environment variable',
	},
	// ----------------------------------
	//         environmentVariable: addOrUpdate
	// ----------------------------------
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['addOrUpdate'],
			},
		},
		description: 'The key of the environment variable',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['addOrUpdate'],
			},
		},
		description: 'The value of the environment variable',
	},
	{
		displayName: 'Generate Value',
		name: 'generateValue',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['addOrUpdate'],
			},
		},
		description: 'Whether to auto-generate a secure value (overrides the value field)',
	},
	// ----------------------------------
	//         environmentVariable: updateAll
	// ----------------------------------
	{
		displayName: 'Environment Variables',
		name: 'envVars',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['updateAll'],
			},
		},
		placeholder: 'Add Environment Variable',
		options: [
			{
				name: 'envVarValues',
				displayName: 'Environment Variable',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'The key of the environment variable',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value of the environment variable',
					},
					{
						displayName: 'Generate Value',
						name: 'generateValue',
						type: 'boolean',
						default: false,
						description: 'Whether to auto-generate a secure value',
					},
				],
			},
		],
		description: 'Environment variables to set (replaces all existing)',
	},
];

export async function executeEnvironmentVariableOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const serviceId = this.getNodeParameter('serviceId', i) as string;
	validateServiceId(serviceId);

	if (operation === 'list') {
		const response = await renderCloudApiRequest.call(
			this,
			'GET',
			`/services/${serviceId}/env-vars`,
		);
		responseData = Array.isArray(response)
			? (response.map((item) => (item.envVar || item) as IDataObject) as IDataObject[])
			: [response as IDataObject];
	} else if (operation === 'get') {
		const envVarKey = this.getNodeParameter('envVarKey', i) as string;
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/services/${serviceId}/env-vars/${envVarKey}`,
		)) as IDataObject;
	} else if (operation === 'addOrUpdate') {
		const key = this.getNodeParameter('key', i) as string;
		const value = this.getNodeParameter('value', i) as string;
		const generateValue = this.getNodeParameter('generateValue', i) as boolean;

		const body: IDataObject = { key };
		if (generateValue) {
			body.generateValue = 'yes';
		} else {
			body.value = value;
		}

		responseData = (await renderCloudApiRequest.call(
			this,
			'PUT',
			`/services/${serviceId}/env-vars/${key}`,
			body,
		)) as IDataObject;
	} else if (operation === 'delete') {
		const envVarKey = this.getNodeParameter('envVarKey', i) as string;
		await renderCloudApiRequest.call(
			this,
			'DELETE',
			`/services/${serviceId}/env-vars/${envVarKey}`,
		);
		responseData = { success: true, envVarKey };
	} else if (operation === 'updateAll') {
		const envVarsData = this.getNodeParameter('envVars', i) as IDataObject;
		const envVarValues = (envVarsData.envVarValues as IDataObject[]) || [];

		const envVars = envVarValues.map((envVar) => {
			const item: IDataObject = { key: envVar.key };
			if (envVar.generateValue) {
				item.generateValue = 'yes';
			} else {
				item.value = envVar.value;
			}
			return item;
		});

		responseData = (await renderCloudApiRequest.call(
			this,
			'PUT',
			`/services/${serviceId}/env-vars`,
			{ envVars } as IDataObject,
		)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
