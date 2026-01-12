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
	validateServiceId,
	validateDeployId,
} from '../../transport/GenericFunctions';

export const deployOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deploy'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel an in-progress deploy',
				action: 'Cancel a deploy',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve deploy details',
				action: 'Get a deploy',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List deploys for a service',
				action: 'List deploys',
			},
			{
				name: 'Rollback',
				value: 'rollback',
				description: 'Roll back to a previous deploy',
				action: 'Rollback a deploy',
			},
			{
				name: 'Trigger',
				value: 'trigger',
				description: 'Trigger a new deploy',
				action: 'Trigger a deploy',
			},
		],
		default: 'list',
	},
];

export const deployFields: INodeProperties[] = [
	// ----------------------------------
	//         deploy: all operations
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['deploy'],
			},
		},
		description: 'The ID of the service (srv-xxxxx format)',
	},
	// ----------------------------------
	//         deploy: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['deploy'],
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
				resource: ['deploy'],
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
				resource: ['deploy'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'Filter deploys after this time',
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
				description: 'Filter deploys before this time',
			},
		],
	},
	// ----------------------------------
	//         deploy: get, cancel, rollback
	// ----------------------------------
	{
		displayName: 'Deploy ID',
		name: 'deployId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['deploy'],
				operation: ['get', 'cancel', 'rollback'],
			},
		},
		description: 'The ID of the deploy (dep-xxxxx format)',
	},
	// ----------------------------------
	//         deploy: trigger
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['deploy'],
				operation: ['trigger'],
			},
		},
		options: [
			{
				displayName: 'Clear Cache',
				name: 'clearCache',
				type: 'boolean',
				default: false,
				description: 'Whether to clear the build cache before deploying',
			},
			{
				displayName: 'Commit ID',
				name: 'commitId',
				type: 'string',
				default: '',
				description: 'Specific Git commit to deploy',
			},
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				description: 'Docker image URL for image-backed services',
			},
		],
	},
];

export async function executeDeployOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const serviceId = this.getNodeParameter('serviceId', i) as string;
	validateServiceId(serviceId);

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const query: IDataObject = {};

		if (filters.startTime) {query.startTime = filters.startTime;}
		if (filters.endTime) {query.endTime = filters.endTime;}

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				`/services/${serviceId}/deploys`,
				{},
				query,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				`/services/${serviceId}/deploys`,
				{},
				query,
			);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.deploy || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const deployId = this.getNodeParameter('deployId', i) as string;
		validateDeployId(deployId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/services/${serviceId}/deploys/${deployId}`,
		)) as IDataObject;
	} else if (operation === 'trigger') {
		const options = this.getNodeParameter('options', i) as IDataObject;
		const body: IDataObject = {};

		if (options.clearCache) {body.clearCache = options.clearCache;}
		if (options.commitId) {body.commitId = options.commitId;}
		if (options.imageUrl) {body.imageUrl = options.imageUrl;}

		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/deploys`,
			body,
		)) as IDataObject;
	} else if (operation === 'cancel') {
		const deployId = this.getNodeParameter('deployId', i) as string;
		validateDeployId(deployId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/deploys/${deployId}/cancel`,
		)) as IDataObject;
	} else if (operation === 'rollback') {
		const deployId = this.getNodeParameter('deployId', i) as string;
		validateDeployId(deployId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/rollback/${deployId}`,
		)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
