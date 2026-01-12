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
	validatePostgresId,
} from '../../transport/GenericFunctions';

export const postgresOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['postgres'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new PostgreSQL instance',
				action: 'Create a PostgreSQL instance',
			},
			{
				name: 'Create Export',
				value: 'createExport',
				description: 'Create a database export',
				action: 'Create a database export',
			},
			{
				name: 'Create User',
				value: 'createUser',
				description: 'Create a PostgreSQL user',
				action: 'Create a PostgreSQL user',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a PostgreSQL instance',
				action: 'Delete a PostgreSQL instance',
			},
			{
				name: 'Delete User',
				value: 'deleteUser',
				description: 'Delete a PostgreSQL user',
				action: 'Delete a PostgreSQL user',
			},
			{
				name: 'Failover',
				value: 'failover',
				description: 'Trigger manual failover (high availability)',
				action: 'Trigger failover for a PostgreSQL instance',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve PostgreSQL instance details',
				action: 'Get a PostgreSQL instance',
			},
			{
				name: 'Get Connection Info',
				value: 'getConnectionInfo',
				description: 'Get connection string and credentials',
				action: 'Get connection info for a PostgreSQL instance',
			},
			{
				name: 'Get Recovery Status',
				value: 'getRecoveryStatus',
				description: 'Get point-in-time recovery status',
				action: 'Get recovery status for a PostgreSQL instance',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List PostgreSQL instances',
				action: 'List PostgreSQL instances',
			},
			{
				name: 'List Exports',
				value: 'listExports',
				description: 'List database exports',
				action: 'List database exports',
			},
			{
				name: 'List Users',
				value: 'listUsers',
				description: 'List PostgreSQL users',
				action: 'List PostgreSQL users',
			},
			{
				name: 'Restart',
				value: 'restart',
				description: 'Restart a PostgreSQL instance',
				action: 'Restart a PostgreSQL instance',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a suspended PostgreSQL instance',
				action: 'Resume a PostgreSQL instance',
			},
			{
				name: 'Suspend',
				value: 'suspend',
				description: 'Suspend a PostgreSQL instance',
				action: 'Suspend a PostgreSQL instance',
			},
			{
				name: 'Trigger Recovery',
				value: 'triggerRecovery',
				description: 'Restore from a point in time',
				action: 'Trigger recovery for a PostgreSQL instance',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update PostgreSQL configuration',
				action: 'Update a PostgreSQL instance',
			},
		],
		default: 'list',
	},
];

export const postgresFields: INodeProperties[] = [
	// ----------------------------------
	//         postgres: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: ['list', 'listExports', 'listUsers'],
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
				resource: ['postgres'],
				operation: ['list', 'listExports', 'listUsers'],
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
				resource: ['postgres'],
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
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Available', value: 'available' },
					{ name: 'Creating', value: 'creating' },
					{ name: 'Suspended', value: 'suspended' },
					{ name: 'Unavailable', value: 'unavailable' },
				],
				default: 'available',
				description: 'Filter by status',
			},
		],
	},
	// ----------------------------------
	//         postgres: operations requiring postgresId
	// ----------------------------------
	{
		displayName: 'PostgreSQL ID',
		name: 'postgresId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: [
					'get',
					'update',
					'delete',
					'getConnectionInfo',
					'suspend',
					'resume',
					'restart',
					'failover',
					'getRecoveryStatus',
					'triggerRecovery',
					'listExports',
					'createExport',
					'listUsers',
					'createUser',
					'deleteUser',
				],
			},
		},
		description: 'The ID of the PostgreSQL instance (dpg-xxxxx format)',
	},
	// ----------------------------------
	//         postgres: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: ['create'],
			},
		},
		description: 'The name of the PostgreSQL instance',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['postgres'],
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
				resource: ['postgres'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Database Name',
				name: 'databaseName',
				type: 'string',
				default: '',
				description: 'Internal database name',
			},
			{
				displayName: 'Database User',
				name: 'databaseUser',
				type: 'string',
				default: '',
				description: 'Primary database user',
			},
			{
				displayName: 'High Availability',
				name: 'highAvailabilityEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable high availability',
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
				description: 'Database plan',
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
			{
				displayName: 'Version',
				name: 'version',
				type: 'options',
				options: [
					{ name: 'PostgreSQL 14', value: '14' },
					{ name: 'PostgreSQL 15', value: '15' },
					{ name: 'PostgreSQL 16', value: '16' },
				],
				default: '16',
				description: 'PostgreSQL version',
			},
		],
	},
	// ----------------------------------
	//         postgres: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'High Availability',
				name: 'highAvailabilityEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable high availability',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the PostgreSQL instance',
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
				description: 'Database plan',
			},
		],
	},
	// ----------------------------------
	//         postgres: triggerRecovery
	// ----------------------------------
	{
		displayName: 'Recovery Target Time',
		name: 'recoveryTargetTime',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: ['triggerRecovery'],
			},
		},
		description: 'Point-in-time to recover to',
	},
	// ----------------------------------
	//         postgres: createUser
	// ----------------------------------
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: ['createUser'],
			},
		},
		description: 'Username for the new PostgreSQL user',
	},
	// ----------------------------------
	//         postgres: deleteUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['postgres'],
				operation: ['deleteUser'],
			},
		},
		description: 'The ID of the user to delete',
	},
];

export async function executePostgresOperation(
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
		if (filters.status) {query.status = filters.status;}

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', '/postgres', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(this, 'GET', '/postgres', {}, query);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.postgres || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/postgres/${postgresId}`)) as IDataObject;
	} else if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

		const body: IDataObject = { name, ownerId };
		if (additionalOptions.databaseName) {body.databaseName = additionalOptions.databaseName;}
		if (additionalOptions.databaseUser) {body.databaseUser = additionalOptions.databaseUser;}
		if (additionalOptions.highAvailabilityEnabled !== undefined) {
			body.highAvailabilityEnabled = additionalOptions.highAvailabilityEnabled;
		}
		if (additionalOptions.plan) {body.plan = additionalOptions.plan;}
		if (additionalOptions.region) {body.region = additionalOptions.region;}
		if (additionalOptions.version) {body.version = additionalOptions.version;}

		responseData = (await renderCloudApiRequest.call(this, 'POST', '/postgres', body)) as IDataObject;
	} else if (operation === 'update') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}
		if (updateFields.plan) {body.plan = updateFields.plan;}
		if (updateFields.highAvailabilityEnabled !== undefined) {
			body.highAvailabilityEnabled = updateFields.highAvailabilityEnabled;
		}

		responseData = (await renderCloudApiRequest.call(this, 'PATCH', `/postgres/${postgresId}`, body)) as IDataObject;
	} else if (operation === 'delete') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		await renderCloudApiRequest.call(this, 'DELETE', `/postgres/${postgresId}`);
		responseData = { success: true, postgresId };
	} else if (operation === 'getConnectionInfo') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/postgres/${postgresId}/connection-info`)) as IDataObject;
	} else if (operation === 'suspend') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/suspend`)) as IDataObject;
	} else if (operation === 'resume') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/resume`)) as IDataObject;
	} else if (operation === 'restart') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/restart`);
		responseData = { success: true, postgresId };
	} else if (operation === 'failover') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/failover`)) as IDataObject;
	} else if (operation === 'getRecoveryStatus') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/postgres/${postgresId}/recovery`)) as IDataObject;
	} else if (operation === 'triggerRecovery') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		const recoveryTargetTime = this.getNodeParameter('recoveryTargetTime', i) as string;
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/recovery`, { recoveryTargetTime })) as IDataObject;
	} else if (operation === 'listExports') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', `/postgres/${postgresId}/exports`);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await renderCloudApiRequest.call(this, 'GET', `/postgres/${postgresId}/exports`, {}, { limit });
			responseData = Array.isArray(response)
				? (response.map((item) => (item.export || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'createExport') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/exports`)) as IDataObject;
	} else if (operation === 'listUsers') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', `/postgres/${postgresId}/users`);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await renderCloudApiRequest.call(this, 'GET', `/postgres/${postgresId}/users`, {}, { limit });
			responseData = Array.isArray(response)
				? (response.map((item) => (item.user || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'createUser') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		const username = this.getNodeParameter('username', i) as string;
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/postgres/${postgresId}/users`, { username })) as IDataObject;
	} else if (operation === 'deleteUser') {
		const postgresId = this.getNodeParameter('postgresId', i) as string;
		validatePostgresId(postgresId);
		const userId = this.getNodeParameter('userId', i) as string;
		await renderCloudApiRequest.call(this, 'DELETE', `/postgres/${postgresId}/users/${userId}`);
		responseData = { success: true, userId };
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
