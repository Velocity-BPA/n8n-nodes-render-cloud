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
	validateProjectId,
	validateEnvironmentId,
} from '../../transport/GenericFunctions';

export const environmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['environment'],
			},
		},
		options: [
			{
				name: 'Add Resources',
				value: 'addResources',
				description: 'Add services/databases to an environment',
				action: 'Add resources to an environment',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new environment',
				action: 'Create an environment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment',
				action: 'Delete an environment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve environment details',
				action: 'Get an environment',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List environments within a project',
				action: 'List environments',
			},
			{
				name: 'Remove Resources',
				value: 'removeResources',
				description: 'Remove resources from an environment',
				action: 'Remove resources from an environment',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update environment configuration',
				action: 'Update an environment',
			},
		],
		default: 'list',
	},
];

export const environmentFields: INodeProperties[] = [
	// ----------------------------------
	//         environment: all operations
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
			},
		},
		description: 'The ID of the project (prj-xxxxx format)',
	},
	// ----------------------------------
	//         environment: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['environment'],
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
				resource: ['environment'],
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
	// ----------------------------------
	//         environment: get, delete, update, addResources, removeResources
	// ----------------------------------
	{
		displayName: 'Environment ID',
		name: 'environmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['get', 'delete', 'update', 'addResources', 'removeResources'],
			},
		},
		description: 'The ID of the environment (env-xxxxx format)',
	},
	// ----------------------------------
	//         environment: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create'],
			},
		},
		description: 'The name of the environment',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Protected Status',
				name: 'protectedStatus',
				type: 'boolean',
				default: false,
				description: 'Whether to mark the environment as protected',
			},
		],
	},
	// ----------------------------------
	//         environment: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the environment',
			},
			{
				displayName: 'Protected Status',
				name: 'protectedStatus',
				type: 'boolean',
				default: false,
				description: 'Whether to mark the environment as protected',
			},
		],
	},
	// ----------------------------------
	//         environment: addResources, removeResources
	// ----------------------------------
	{
		displayName: 'Resource IDs',
		name: 'resourceIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['addResources', 'removeResources'],
			},
		},
		description: 'Comma-separated list of service/database IDs to add or remove',
	},
];

export async function executeEnvironmentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const projectId = this.getNodeParameter('projectId', i) as string;
	validateProjectId(projectId);

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				`/projects/${projectId}/environments`,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				`/projects/${projectId}/environments`,
				{},
				{ limit },
			);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.environment || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const environmentId = this.getNodeParameter('environmentId', i) as string;
		validateEnvironmentId(environmentId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/projects/${projectId}/environments/${environmentId}`,
		)) as IDataObject;
	} else if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

		const body: IDataObject = { name };
		if (additionalOptions.protectedStatus !== undefined) {
			body.protectedStatus = additionalOptions.protectedStatus ? 'protected' : 'unprotected';
		}

		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/projects/${projectId}/environments`,
			body,
		)) as IDataObject;
	} else if (operation === 'update') {
		const environmentId = this.getNodeParameter('environmentId', i) as string;
		validateEnvironmentId(environmentId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}
		if (updateFields.protectedStatus !== undefined) {
			body.protectedStatus = updateFields.protectedStatus ? 'protected' : 'unprotected';
		}

		responseData = (await renderCloudApiRequest.call(
			this,
			'PATCH',
			`/projects/${projectId}/environments/${environmentId}`,
			body,
		)) as IDataObject;
	} else if (operation === 'delete') {
		const environmentId = this.getNodeParameter('environmentId', i) as string;
		validateEnvironmentId(environmentId);
		await renderCloudApiRequest.call(
			this,
			'DELETE',
			`/projects/${projectId}/environments/${environmentId}`,
		);
		responseData = { success: true, environmentId };
	} else if (operation === 'addResources') {
		const environmentId = this.getNodeParameter('environmentId', i) as string;
		validateEnvironmentId(environmentId);
		const resourceIds = (this.getNodeParameter('resourceIds', i) as string)
			.split(',')
			.map((id) => id.trim())
			.filter((id) => id);

		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/projects/${projectId}/environments/${environmentId}/resources`,
			{ resourceIds },
		)) as IDataObject;
	} else if (operation === 'removeResources') {
		const environmentId = this.getNodeParameter('environmentId', i) as string;
		validateEnvironmentId(environmentId);
		const resourceIds = (this.getNodeParameter('resourceIds', i) as string)
			.split(',')
			.map((id) => id.trim())
			.filter((id) => id);

		responseData = (await renderCloudApiRequest.call(
			this,
			'DELETE',
			`/projects/${projectId}/environments/${environmentId}/resources`,
			{ resourceIds },
		)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
