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
} from '../../transport/GenericFunctions';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve project details',
				action: 'Get a project',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all projects',
				action: 'List projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project configuration',
				action: 'Update a project',
			},
		],
		default: 'list',
	},
];

export const projectFields: INodeProperties[] = [
	// ----------------------------------
	//         project: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
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
				resource: ['project'],
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
				description: 'Filter by project name',
			},
		],
	},
	// ----------------------------------
	//         project: get, delete, update
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the project (prj-xxxxx format)',
	},
	// ----------------------------------
	//         project: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'The name of the project',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'The ID of the owner (user or team)',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Description of the project',
			},
		],
	},
	// ----------------------------------
	//         project: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the project',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Description of the project',
			},
		],
	},
];

export async function executeProjectOperation(
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
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', '/projects', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(this, 'GET', '/projects', {}, query);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.project || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const projectId = this.getNodeParameter('projectId', i) as string;
		validateProjectId(projectId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/projects/${projectId}`)) as IDataObject;
	} else if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

		const body: IDataObject = { name, ownerId };
		if (additionalOptions.description) {body.description = additionalOptions.description;}

		responseData = (await renderCloudApiRequest.call(this, 'POST', '/projects', body)) as IDataObject;
	} else if (operation === 'update') {
		const projectId = this.getNodeParameter('projectId', i) as string;
		validateProjectId(projectId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}
		if (updateFields.description !== undefined) {body.description = updateFields.description;}

		responseData = (await renderCloudApiRequest.call(this, 'PATCH', `/projects/${projectId}`, body)) as IDataObject;
	} else if (operation === 'delete') {
		const projectId = this.getNodeParameter('projectId', i) as string;
		validateProjectId(projectId);
		await renderCloudApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
		responseData = { success: true, projectId };
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
