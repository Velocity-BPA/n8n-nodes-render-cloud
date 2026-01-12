/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	renderCloudApiRequest,
	renderCloudApiRequestAllItems,
	validateEnvGroupId,
	validateServiceId,
} from '../../transport/GenericFunctions';

export const environmentGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new environment group',
				action: 'Create an environment group',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment group',
				action: 'Delete an environment group',
			},
			{
				name: 'Delete Env Var',
				value: 'deleteEnvVar',
				description: 'Remove an environment variable from the group',
				action: 'Delete an env var from an environment group',
			},
			{
				name: 'Delete Secret File',
				value: 'deleteSecretFile',
				description: 'Remove a secret file from the group',
				action: 'Delete a secret file from an environment group',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve environment group details',
				action: 'Get an environment group',
			},
			{
				name: 'Get Env Var',
				value: 'getEnvVar',
				description: 'Get a specific environment variable',
				action: 'Get an env var from an environment group',
			},
			{
				name: 'Get Secret File',
				value: 'getSecretFile',
				description: 'Get a specific secret file',
				action: 'Get a secret file from an environment group',
			},
			{
				name: 'Link Service',
				value: 'linkService',
				description: 'Link a service to the environment group',
				action: 'Link a service to an environment group',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List environment groups',
				action: 'List environment groups',
			},
			{
				name: 'Unlink Service',
				value: 'unlinkService',
				description: 'Unlink a service from the environment group',
				action: 'Unlink a service from an environment group',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update environment group',
				action: 'Update an environment group',
			},
			{
				name: 'Update Env Var',
				value: 'updateEnvVar',
				description: 'Add or update an environment variable',
				action: 'Update an env var in an environment group',
			},
			{
				name: 'Update Secret File',
				value: 'updateSecretFile',
				description: 'Add or update a secret file',
				action: 'Update a secret file in an environment group',
			},
		],
		default: 'list',
	},
];

export const environmentGroupFields: INodeProperties[] = [
	// ----------------------------------
	//         environmentGroup: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 20,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				description: 'Filter by workspace owner ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by group name',
			},
		],
	},
	// ----------------------------------
	//         environmentGroup: operations requiring envGroupId
	// ----------------------------------
	{
		displayName: 'Environment Group ID',
		name: 'envGroupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: [
					'get',
					'update',
					'delete',
					'linkService',
					'unlinkService',
					'getEnvVar',
					'updateEnvVar',
					'deleteEnvVar',
					'getSecretFile',
					'updateSecretFile',
					'deleteSecretFile',
				],
			},
		},
		description: 'The ID of the environment group (evg-xxxxx format)',
	},
	// ----------------------------------
	//         environmentGroup: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['create'],
			},
		},
		description: 'The name of the environment group',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['create'],
			},
		},
		description: 'The ID of the owner (user or team)',
	},
	// ----------------------------------
	//         environmentGroup: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the environment group',
			},
		],
	},
	// ----------------------------------
	//         environmentGroup: linkService, unlinkService
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['linkService', 'unlinkService'],
			},
		},
		description: 'The ID of the service to link/unlink',
	},
	// ----------------------------------
	//         environmentGroup: getEnvVar, deleteEnvVar
	// ----------------------------------
	{
		displayName: 'Environment Variable Key',
		name: 'envVarKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['getEnvVar', 'deleteEnvVar'],
			},
		},
		description: 'The key of the environment variable',
	},
	// ----------------------------------
	//         environmentGroup: updateEnvVar
	// ----------------------------------
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['updateEnvVar'],
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
				resource: ['environmentGroup'],
				operation: ['updateEnvVar'],
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
				resource: ['environmentGroup'],
				operation: ['updateEnvVar'],
			},
		},
		description: 'Whether to auto-generate a secure value',
	},
	// ----------------------------------
	//         environmentGroup: getSecretFile, deleteSecretFile
	// ----------------------------------
	{
		displayName: 'Secret File Name',
		name: 'secretFileName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['getSecretFile', 'deleteSecretFile'],
			},
		},
		description: 'The name/path of the secret file',
	},
	// ----------------------------------
	//         environmentGroup: updateSecretFile
	// ----------------------------------
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['updateSecretFile'],
			},
		},
		placeholder: '/etc/secrets/config.json',
		description: 'The name/path of the secret file',
	},
	{
		displayName: 'Contents',
		name: 'contents',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environmentGroup'],
				operation: ['updateSecretFile'],
			},
		},
		description: 'The contents of the secret file',
	},
];

export async function executeEnvironmentGroupOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const query: IDataObject = {};

		if (filters.ownerId) {query.ownerId = filters.ownerId;}
		if (filters.name) {query.name = filters.name;}

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', '/env-groups', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(this, 'GET', '/env-groups', {}, query);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.envGroup || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/env-groups/${envGroupId}`)) as IDataObject;
	} else if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		responseData = (await renderCloudApiRequest.call(this, 'POST', '/env-groups', { name, ownerId })) as IDataObject;
	} else if (operation === 'update') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}

		responseData = (await renderCloudApiRequest.call(this, 'PATCH', `/env-groups/${envGroupId}`, body)) as IDataObject;
	} else if (operation === 'delete') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		await renderCloudApiRequest.call(this, 'DELETE', `/env-groups/${envGroupId}`);
		responseData = { success: true, envGroupId };
	} else if (operation === 'linkService') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/env-groups/${envGroupId}/link-service`,
			{ serviceId },
		)) as IDataObject;
	} else if (operation === 'unlinkService') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/env-groups/${envGroupId}/unlink-service`,
			{ serviceId },
		)) as IDataObject;
	} else if (operation === 'getEnvVar') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const envVarKey = this.getNodeParameter('envVarKey', i) as string;
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/env-groups/${envGroupId}/env-vars/${envVarKey}`,
		)) as IDataObject;
	} else if (operation === 'updateEnvVar') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
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
			`/env-groups/${envGroupId}/env-vars/${key}`,
			body,
		)) as IDataObject;
	} else if (operation === 'deleteEnvVar') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const envVarKey = this.getNodeParameter('envVarKey', i) as string;
		await renderCloudApiRequest.call(this, 'DELETE', `/env-groups/${envGroupId}/env-vars/${envVarKey}`);
		responseData = { success: true, envVarKey };
	} else if (operation === 'getSecretFile') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const secretFileName = this.getNodeParameter('secretFileName', i) as string;
		const encodedName = encodeURIComponent(secretFileName);
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/env-groups/${envGroupId}/secret-files/${encodedName}`,
		)) as IDataObject;
	} else if (operation === 'updateSecretFile') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const name = this.getNodeParameter('fileName', i) as string;
		const contents = this.getNodeParameter('contents', i) as string;
		const encodedName = encodeURIComponent(name);
		const base64Contents = Buffer.from(contents).toString('base64');

		responseData = (await renderCloudApiRequest.call(
			this,
			'PUT',
			`/env-groups/${envGroupId}/secret-files/${encodedName}`,
			{ name, contents: base64Contents },
		)) as IDataObject;
	} else if (operation === 'deleteSecretFile') {
		const envGroupId = this.getNodeParameter('envGroupId', i) as string;
		validateEnvGroupId(envGroupId);
		const secretFileName = this.getNodeParameter('secretFileName', i) as string;
		const encodedName = encodeURIComponent(secretFileName);
		await renderCloudApiRequest.call(this, 'DELETE', `/env-groups/${envGroupId}/secret-files/${encodedName}`);
		responseData = { success: true, secretFileName };
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
