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
	validateKeyValueId,
} from '../../transport/GenericFunctions';

export const keyValueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['keyValue'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new Key Value instance',
				action: 'Create a Key Value instance',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Key Value instance',
				action: 'Delete a Key Value instance',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve Key Value instance details',
				action: 'Get a Key Value instance',
			},
			{
				name: 'Get Connection Info',
				value: 'getConnectionInfo',
				description: 'Get connection string and credentials',
				action: 'Get connection info for a Key Value instance',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List Key Value instances',
				action: 'List Key Value instances',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a suspended Key Value instance',
				action: 'Resume a Key Value instance',
			},
			{
				name: 'Suspend',
				value: 'suspend',
				description: 'Suspend a Key Value instance',
				action: 'Suspend a Key Value instance',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update Key Value configuration',
				action: 'Update a Key Value instance',
			},
		],
		default: 'list',
	},
];

export const keyValueFields: INodeProperties[] = [
	// ----------------------------------
	//         keyValue: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['keyValue'],
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
				resource: ['keyValue'],
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
				resource: ['keyValue'],
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
				description: 'Filter by instance name',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				options: [
					{ name: 'Frankfurt', value: 'frankfurt' },
					{ name: 'Ohio', value: 'ohio' },
					{ name: 'Oregon', value: 'oregon' },
					{ name: 'Singapore', value: 'singapore' },
					{ name: 'Virginia', value: 'virginia' },
				],
				default: 'oregon',
				description: 'Filter by region',
			},
		],
	},
	// ----------------------------------
	//         keyValue: operations requiring keyValueId
	// ----------------------------------
	{
		displayName: 'Key Value ID',
		name: 'keyValueId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['get', 'update', 'delete', 'getConnectionInfo', 'suspend', 'resume'],
			},
		},
		description: 'The ID of the Key Value instance (red-xxxxx format)',
	},
	// ----------------------------------
	//         keyValue: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['create'],
			},
		},
		description: 'The name of the Key Value instance',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['keyValue'],
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
				resource: ['keyValue'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Maxmemory Policy',
				name: 'maxmemoryPolicy',
				type: 'options',
				options: [
					{ name: 'No Eviction', value: 'noeviction' },
					{ name: 'All Keys LRU', value: 'allkeys-lru' },
					{ name: 'All Keys LFU', value: 'allkeys-lfu' },
					{ name: 'All Keys Random', value: 'allkeys-random' },
					{ name: 'Volatile LRU', value: 'volatile-lru' },
					{ name: 'Volatile LFU', value: 'volatile-lfu' },
					{ name: 'Volatile Random', value: 'volatile-random' },
					{ name: 'Volatile TTL', value: 'volatile-ttl' },
				],
				default: 'noeviction',
				description: 'Redis maxmemory-policy setting',
			},
			{
				displayName: 'Plan',
				name: 'plan',
				type: 'options',
				options: [
					{ name: 'Free', value: 'free' },
					{ name: 'Starter', value: 'starter' },
					{ name: 'Standard', value: 'standard' },
					{ name: 'Pro', value: 'pro' },
					{ name: 'Pro Plus', value: 'pro_plus' },
				],
				default: 'starter',
				description: 'Instance plan',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				options: [
					{ name: 'Frankfurt', value: 'frankfurt' },
					{ name: 'Ohio', value: 'ohio' },
					{ name: 'Oregon', value: 'oregon' },
					{ name: 'Singapore', value: 'singapore' },
					{ name: 'Virginia', value: 'virginia' },
				],
				default: 'oregon',
				description: 'Deployment region',
			},
		],
	},
	// ----------------------------------
	//         keyValue: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Maxmemory Policy',
				name: 'maxmemoryPolicy',
				type: 'options',
				options: [
					{ name: 'No Eviction', value: 'noeviction' },
					{ name: 'All Keys LRU', value: 'allkeys-lru' },
					{ name: 'All Keys LFU', value: 'allkeys-lfu' },
					{ name: 'All Keys Random', value: 'allkeys-random' },
					{ name: 'Volatile LRU', value: 'volatile-lru' },
					{ name: 'Volatile LFU', value: 'volatile-lfu' },
					{ name: 'Volatile Random', value: 'volatile-random' },
					{ name: 'Volatile TTL', value: 'volatile-ttl' },
				],
				default: 'noeviction',
				description: 'Redis maxmemory-policy setting',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the Key Value instance',
			},
			{
				displayName: 'Plan',
				name: 'plan',
				type: 'options',
				options: [
					{ name: 'Starter', value: 'starter' },
					{ name: 'Standard', value: 'standard' },
					{ name: 'Pro', value: 'pro' },
					{ name: 'Pro Plus', value: 'pro_plus' },
				],
				default: 'starter',
				description: 'Instance plan',
			},
		],
	},
];

export async function executeKeyValueOperation(
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
		if (filters.region) {query.region = filters.region;}

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', '/key-value', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(this, 'GET', '/key-value', {}, query);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.keyValue || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const keyValueId = this.getNodeParameter('keyValueId', i) as string;
		validateKeyValueId(keyValueId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/key-value/${keyValueId}`)) as IDataObject;
	} else if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

		const body: IDataObject = { name, ownerId };
		if (additionalOptions.maxmemoryPolicy) {body.maxmemoryPolicy = additionalOptions.maxmemoryPolicy;}
		if (additionalOptions.plan) {body.plan = additionalOptions.plan;}
		if (additionalOptions.region) {body.region = additionalOptions.region;}

		responseData = (await renderCloudApiRequest.call(this, 'POST', '/key-value', body)) as IDataObject;
	} else if (operation === 'update') {
		const keyValueId = this.getNodeParameter('keyValueId', i) as string;
		validateKeyValueId(keyValueId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}
		if (updateFields.plan) {body.plan = updateFields.plan;}
		if (updateFields.maxmemoryPolicy) {body.maxmemoryPolicy = updateFields.maxmemoryPolicy;}

		responseData = (await renderCloudApiRequest.call(this, 'PATCH', `/key-value/${keyValueId}`, body)) as IDataObject;
	} else if (operation === 'delete') {
		const keyValueId = this.getNodeParameter('keyValueId', i) as string;
		validateKeyValueId(keyValueId);
		await renderCloudApiRequest.call(this, 'DELETE', `/key-value/${keyValueId}`);
		responseData = { success: true, keyValueId };
	} else if (operation === 'getConnectionInfo') {
		const keyValueId = this.getNodeParameter('keyValueId', i) as string;
		validateKeyValueId(keyValueId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/key-value/${keyValueId}/connection-info`)) as IDataObject;
	} else if (operation === 'suspend') {
		const keyValueId = this.getNodeParameter('keyValueId', i) as string;
		validateKeyValueId(keyValueId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/key-value/${keyValueId}/suspend`)) as IDataObject;
	} else if (operation === 'resume') {
		const keyValueId = this.getNodeParameter('keyValueId', i) as string;
		validateKeyValueId(keyValueId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/key-value/${keyValueId}/resume`)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
