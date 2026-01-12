/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';

import {
	renderCloudApiRequest,
	renderCloudApiRequestAllItems,
} from '../../transport/GenericFunctions';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook by ID',
				action: 'Get a webhook',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all webhooks for a workspace',
				action: 'List webhooks',
			},
			{
				name: 'List Events',
				value: 'listEvents',
				description: 'List events delivered to a webhook',
				action: 'List webhook events',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update webhook configuration',
				action: 'Update a webhook',
			},
		],
		default: 'list',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook: list
	// ----------------------------------
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list', 'create'],
			},
		},
		description: 'The ID of the workspace owner (usr-xxxxx or tea-xxxxx)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list', 'listEvents'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list', 'listEvents'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         webhook: create
	// ----------------------------------
	{
		displayName: 'Webhook URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The URL to send webhook events to',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Certificate Renewed', value: 'certificate_renewed' },
			{ name: 'Deploy Canceled', value: 'deploy_canceled' },
			{ name: 'Deploy Failed', value: 'deploy_failed' },
			{ name: 'Deploy Started', value: 'deploy_started' },
			{ name: 'Deploy Succeeded', value: 'deploy_succeeded' },
			{ name: 'Maintenance Completed', value: 'maintenance_completed' },
			{ name: 'Maintenance Started', value: 'maintenance_started' },
			{ name: 'Server Available', value: 'server_available' },
			{ name: 'Server Failed', value: 'server_failed' },
			{ name: 'Service Created', value: 'service_created' },
			{ name: 'Service Deleted', value: 'service_deleted' },
			{ name: 'Service Resumed', value: 'service_resumed' },
			{ name: 'Service Suspended', value: 'service_suspended' },
		],
		description: 'The event types to subscribe to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Secret used to sign webhook payloads for verification',
			},
			{
				displayName: 'Service IDs',
				name: 'serviceIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of service IDs to filter events by (e.g., srv-xxxxx,srv-yyyyy)',
			},
		],
	},

	// ----------------------------------
	//         webhook: get, delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'delete', 'update', 'listEvents'],
			},
		},
		description: 'The ID of the webhook',
	},

	// ----------------------------------
	//         webhook: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Certificate Renewed', value: 'certificate_renewed' },
					{ name: 'Deploy Canceled', value: 'deploy_canceled' },
					{ name: 'Deploy Failed', value: 'deploy_failed' },
					{ name: 'Deploy Started', value: 'deploy_started' },
					{ name: 'Deploy Succeeded', value: 'deploy_succeeded' },
					{ name: 'Maintenance Completed', value: 'maintenance_completed' },
					{ name: 'Maintenance Started', value: 'maintenance_started' },
					{ name: 'Server Available', value: 'server_available' },
					{ name: 'Server Failed', value: 'server_failed' },
					{ name: 'Service Created', value: 'service_created' },
					{ name: 'Service Deleted', value: 'service_deleted' },
					{ name: 'Service Resumed', value: 'service_resumed' },
					{ name: 'Service Suspended', value: 'service_suspended' },
				],
				description: 'The event types to subscribe to',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Secret used to sign webhook payloads for verification',
			},
			{
				displayName: 'Service IDs',
				name: 'serviceIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of service IDs to filter events by',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL to send webhook events to',
			},
		],
	},

	// ----------------------------------
	//         webhook: listEvents
	// ----------------------------------
	{
		displayName: 'Event Filters',
		name: 'eventFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['listEvents'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Delivered', value: 'delivered' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
				],
				description: 'Filter events by delivery status',
			},
		],
	},
];

export async function executeWebhookOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'list') {
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		const qs: IDataObject = { ownerId };

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				'/webhooks',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				'/webhooks',
				{},
				qs,
			);
			// Extract webhook objects from cursor wrapper
			if (Array.isArray(response)) {
				responseData = response.map((item: IDataObject) => (item.webhook || item) as IDataObject) as IDataObject[];
			} else {
				responseData = response as IDataObject;
			}
		}
	}

	if (operation === 'create') {
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const url = this.getNodeParameter('url', i) as string;
		const events = this.getNodeParameter('events', i) as string[];
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			ownerId,
			url,
			events,
		};

		if (additionalFields.secret) {
			body.secret = additionalFields.secret;
		}

		if (additionalFields.serviceIds) {
			body.serviceIds = (additionalFields.serviceIds as string)
				.split(',')
				.map((id: string) => id.trim())
				.filter((id: string) => id);
		}

		responseData = await renderCloudApiRequest.call(this, 'POST', '/webhooks', body);
	}

	if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		responseData = await renderCloudApiRequest.call(
			this,
			'GET',
			`/webhooks/${webhookId}`,
		);
	}

	if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.url) {
			body.url = updateFields.url;
		}

		if (updateFields.secret) {
			body.secret = updateFields.secret;
		}

		if (updateFields.events && (updateFields.events as string[]).length > 0) {
			body.events = updateFields.events;
		}

		if (updateFields.serviceIds) {
			body.serviceIds = (updateFields.serviceIds as string)
				.split(',')
				.map((id: string) => id.trim())
				.filter((id: string) => id);
		}

		responseData = await renderCloudApiRequest.call(
			this,
			'PATCH',
			`/webhooks/${webhookId}`,
			body,
		);
	}

	if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		await renderCloudApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
		responseData = { success: true, webhookId };
	}

	if (operation === 'listEvents') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const eventFilters = this.getNodeParameter('eventFilters', i) as IDataObject;

		const qs: IDataObject = {};

		if (eventFilters.status) {
			qs.status = eventFilters.status;
		}

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				`/webhooks/${webhookId}/events`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				`/webhooks/${webhookId}/events`,
				{},
				qs,
			);
			// Extract event objects from cursor wrapper
			if (Array.isArray(response)) {
				responseData = response.map((item: IDataObject) => (item.event || item) as IDataObject) as IDataObject[];
			} else {
				responseData = response as IDataObject;
			}
		}
	}

	return responseData;
}
