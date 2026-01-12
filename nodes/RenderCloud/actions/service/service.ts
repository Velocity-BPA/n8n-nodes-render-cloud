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
	handleDateFilters,
	validateServiceId,
} from '../../transport/GenericFunctions';

export const serviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['service'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new service',
				action: 'Create a service',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a service',
				action: 'Delete a service',
			},
			{
				name: 'Delete Autoscaling',
				value: 'deleteAutoscaling',
				description: 'Remove autoscaling configuration from a service',
				action: 'Delete autoscaling from a service',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a service by ID',
				action: 'Get a service',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all services',
				action: 'List services',
			},
			{
				name: 'Purge Cache',
				value: 'purgeCache',
				description: 'Purge cache for a web service',
				action: 'Purge cache for a service',
			},
			{
				name: 'Restart',
				value: 'restart',
				description: 'Restart a service',
				action: 'Restart a service',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a suspended service',
				action: 'Resume a service',
			},
			{
				name: 'Scale',
				value: 'scale',
				description: 'Scale instance count for a service',
				action: 'Scale a service',
			},
			{
				name: 'Suspend',
				value: 'suspend',
				description: 'Suspend a running service',
				action: 'Suspend a service',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update service configuration',
				action: 'Update a service',
			},
			{
				name: 'Update Autoscaling',
				value: 'updateAutoscaling',
				description: 'Configure autoscaling settings for a service',
				action: 'Update autoscaling for a service',
			},
		],
		default: 'list',
	},
];

export const serviceFields: INodeProperties[] = [
	// ----------------------------------
	//         service: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['service'],
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
				resource: ['service'],
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
				resource: ['service'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by service name',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				description: 'Filter by workspace owner ID',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Background Worker', value: 'background_worker' },
					{ name: 'Cron Job', value: 'cron_job' },
					{ name: 'Private Service', value: 'private_service' },
					{ name: 'Static Site', value: 'static_site' },
					{ name: 'Web Service', value: 'web_service' },
				],
				default: 'web_service',
				description: 'Filter by service type',
			},
			{
				displayName: 'Environment',
				name: 'env',
				type: 'options',
				options: [
					{ name: 'Docker', value: 'docker' },
					{ name: 'Elixir', value: 'elixir' },
					{ name: 'Go', value: 'go' },
					{ name: 'Node', value: 'node' },
					{ name: 'Python', value: 'python' },
					{ name: 'Ruby', value: 'ruby' },
					{ name: 'Rust', value: 'rust' },
					{ name: 'Static', value: 'static' },
				],
				default: 'node',
				description: 'Filter by runtime environment',
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
				description: 'Filter by deployment region',
			},
			{
				displayName: 'Suspended Status',
				name: 'suspended',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Not Suspended', value: 'not_suspended' },
					{ name: 'Suspended', value: 'suspended' },
				],
				default: 'all',
				description: 'Filter by suspended status',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter by creation date (before)',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter by creation date (after)',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter by update date (before)',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter by update date (after)',
			},
		],
	},
	// ----------------------------------
	//         service: get, delete, suspend, resume, restart, purgeCache
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['get', 'delete', 'suspend', 'resume', 'restart', 'purgeCache', 'update', 'scale', 'updateAutoscaling', 'deleteAutoscaling'],
			},
		},
		description: 'The ID of the service (srv-xxxxx format)',
	},
	// ----------------------------------
	//         service: create
	// ----------------------------------
	{
		displayName: 'Service Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Background Worker', value: 'background_worker' },
			{ name: 'Cron Job', value: 'cron_job' },
			{ name: 'Private Service', value: 'private_service' },
			{ name: 'Static Site', value: 'static_site' },
			{ name: 'Web Service', value: 'web_service' },
		],
		default: 'web_service',
		description: 'The type of service to create',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		description: 'The name of the service',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		description: 'The ID of the owner (user or team)',
	},
	{
		displayName: 'Deployment Source',
		name: 'deploymentSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Git Repository', value: 'git' },
			{ name: 'Docker Image', value: 'image' },
		],
		default: 'git',
		description: 'Source for deploying the service',
	},
	{
		displayName: 'Repository URL',
		name: 'repo',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
				deploymentSource: ['git'],
			},
		},
		default: '',
		placeholder: 'https://github.com/user/repo',
		description: 'The Git repository URL',
	},
	{
		displayName: 'Branch',
		name: 'branch',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
				deploymentSource: ['git'],
			},
		},
		default: 'main',
		description: 'The branch to deploy from',
	},
	{
		displayName: 'Image URL',
		name: 'image',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
				deploymentSource: ['image'],
			},
		},
		default: '',
		placeholder: 'docker.io/library/nginx:latest',
		description: 'The Docker image URL',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Auto Deploy',
				name: 'autoDeploy',
				type: 'options',
				options: [
					{ name: 'Yes', value: 'yes' },
					{ name: 'No', value: 'no' },
				],
				default: 'yes',
				description: 'Whether to automatically deploy on push',
			},
			{
				displayName: 'Build Command',
				name: 'buildCommand',
				type: 'string',
				default: '',
				description: 'Command to build the service',
			},
			{
				displayName: 'Docker Command',
				name: 'dockerCommand',
				type: 'string',
				default: '',
				description: 'Command to run in the Docker container',
			},
			{
				displayName: 'Dockerfile Path',
				name: 'dockerfilePath',
				type: 'string',
				default: './Dockerfile',
				description: 'Path to the Dockerfile',
			},
			{
				displayName: 'Health Check Path',
				name: 'healthCheckPath',
				type: 'string',
				default: '',
				description: 'Path for health check endpoint',
			},
			{
				displayName: 'Instance Count',
				name: 'numInstances',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Number of instances to run',
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
					{ name: 'Pro Max', value: 'pro_max' },
					{ name: 'Pro Ultra', value: 'pro_ultra' },
				],
				default: 'starter',
				description: 'Instance type/plan for the service',
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
				displayName: 'Root Directory',
				name: 'rootDir',
				type: 'string',
				default: '',
				description: 'Root directory of the service within the repository',
			},
			{
				displayName: 'Runtime',
				name: 'runtime',
				type: 'options',
				options: [
					{ name: 'Docker', value: 'docker' },
					{ name: 'Elixir', value: 'elixir' },
					{ name: 'Go', value: 'go' },
					{ name: 'Node', value: 'node' },
					{ name: 'Python', value: 'python' },
					{ name: 'Ruby', value: 'ruby' },
					{ name: 'Rust', value: 'rust' },
				],
				default: 'node',
				description: 'Runtime environment',
			},
			{
				displayName: 'Start Command',
				name: 'startCommand',
				type: 'string',
				default: '',
				description: 'Command to start the service',
			},
		],
	},
	// ----------------------------------
	//         service: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Auto Deploy',
				name: 'autoDeploy',
				type: 'options',
				options: [
					{ name: 'Yes', value: 'yes' },
					{ name: 'No', value: 'no' },
				],
				default: 'yes',
				description: 'Whether to automatically deploy on push',
			},
			{
				displayName: 'Branch',
				name: 'branch',
				type: 'string',
				default: '',
				description: 'The branch to deploy from',
			},
			{
				displayName: 'Build Command',
				name: 'buildCommand',
				type: 'string',
				default: '',
				description: 'Command to build the service',
			},
			{
				displayName: 'Health Check Path',
				name: 'healthCheckPath',
				type: 'string',
				default: '',
				description: 'Path for health check endpoint',
			},
			{
				displayName: 'Image URL',
				name: 'image',
				type: 'string',
				default: '',
				description: 'The Docker image URL (for image-backed services)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the service',
			},
			{
				displayName: 'Start Command',
				name: 'startCommand',
				type: 'string',
				default: '',
				description: 'Command to start the service',
			},
		],
	},
	// ----------------------------------
	//         service: scale
	// ----------------------------------
	{
		displayName: 'Number of Instances',
		name: 'numInstances',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['scale'],
			},
		},
		description: 'Number of instances to scale to',
	},
	// ----------------------------------
	//         service: updateAutoscaling
	// ----------------------------------
	{
		displayName: 'Autoscaling Enabled',
		name: 'autoscalingEnabled',
		type: 'boolean',
		required: true,
		default: true,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['updateAutoscaling'],
			},
		},
		description: 'Whether autoscaling is enabled',
	},
	{
		displayName: 'Minimum Instances',
		name: 'minInstances',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['updateAutoscaling'],
			},
		},
		description: 'Minimum number of instances',
	},
	{
		displayName: 'Maximum Instances',
		name: 'maxInstances',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
		},
		default: 3,
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['updateAutoscaling'],
			},
		},
		description: 'Maximum number of instances',
	},
	{
		displayName: 'Autoscaling Criteria',
		name: 'autoscalingCriteria',
		type: 'collection',
		placeholder: 'Add Criteria',
		default: {},
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['updateAutoscaling'],
			},
		},
		options: [
			{
				displayName: 'CPU Percentage',
				name: 'cpu',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 70,
				description: 'CPU threshold percentage for scaling',
			},
			{
				displayName: 'Memory Percentage',
				name: 'memory',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 70,
				description: 'Memory threshold percentage for scaling',
			},
		],
	},
];

export async function executeServiceOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const query: IDataObject = {};

		if (filters.name) {query.name = filters.name;}
		if (filters.ownerId) {query.ownerId = filters.ownerId;}
		if (filters.type) {query.type = filters.type;}
		if (filters.env) {query.env = filters.env;}
		if (filters.region) {query.region = filters.region;}
		if (filters.suspended) {query.suspended = filters.suspended;}

		handleDateFilters(query, filters);

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(this, 'GET', '/services', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(this, 'GET', '/services', {}, query);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.service || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		responseData = (await renderCloudApiRequest.call(this, 'GET', `/services/${serviceId}`)) as IDataObject;
	} else if (operation === 'create') {
		const type = this.getNodeParameter('type', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const deploymentSource = this.getNodeParameter('deploymentSource', i) as string;
		const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

		const body: IDataObject = {
			type,
			name,
			ownerId,
		};

		if (deploymentSource === 'git') {
			body.repo = this.getNodeParameter('repo', i) as string;
			body.branch = this.getNodeParameter('branch', i) as string;
		} else {
			body.image = { ownerId, imagePath: this.getNodeParameter('image', i) as string };
		}

		// Add additional options
		if (additionalOptions.autoDeploy) {body.autoDeploy = additionalOptions.autoDeploy;}
		if (additionalOptions.buildCommand) {body.buildCommand = additionalOptions.buildCommand;}
		if (additionalOptions.dockerCommand) {body.dockerCommand = additionalOptions.dockerCommand;}
		if (additionalOptions.dockerfilePath) {body.dockerfilePath = additionalOptions.dockerfilePath;}
		if (additionalOptions.healthCheckPath) {body.healthCheckPath = additionalOptions.healthCheckPath;}
		if (additionalOptions.numInstances) {body.numInstances = additionalOptions.numInstances;}
		if (additionalOptions.plan) {body.plan = additionalOptions.plan;}
		if (additionalOptions.region) {body.region = additionalOptions.region;}
		if (additionalOptions.rootDir) {body.rootDir = additionalOptions.rootDir;}
		if (additionalOptions.runtime) {body.runtime = additionalOptions.runtime;}
		if (additionalOptions.startCommand) {body.startCommand = additionalOptions.startCommand;}

		responseData = (await renderCloudApiRequest.call(this, 'POST', '/services', body)) as IDataObject;
	} else if (operation === 'update') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}
		if (updateFields.autoDeploy) {body.autoDeploy = updateFields.autoDeploy;}
		if (updateFields.branch) {body.branch = updateFields.branch;}
		if (updateFields.buildCommand) {body.buildCommand = updateFields.buildCommand;}
		if (updateFields.healthCheckPath) {body.healthCheckPath = updateFields.healthCheckPath;}
		if (updateFields.startCommand) {body.startCommand = updateFields.startCommand;}
		if (updateFields.image) {body.image = { imagePath: updateFields.image };}

		responseData = (await renderCloudApiRequest.call(this, 'PATCH', `/services/${serviceId}`, body)) as IDataObject;
	} else if (operation === 'delete') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		await renderCloudApiRequest.call(this, 'DELETE', `/services/${serviceId}`);
		responseData = { success: true, serviceId };
	} else if (operation === 'suspend') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/services/${serviceId}/suspend`)) as IDataObject;
	} else if (operation === 'resume') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/services/${serviceId}/resume`)) as IDataObject;
	} else if (operation === 'restart') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		await renderCloudApiRequest.call(this, 'POST', `/services/${serviceId}/restart`);
		responseData = { success: true, serviceId };
	} else if (operation === 'scale') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		const numInstances = this.getNodeParameter('numInstances', i) as number;
		responseData = (await renderCloudApiRequest.call(this, 'POST', `/services/${serviceId}/scale`, { numInstances })) as IDataObject;
	} else if (operation === 'updateAutoscaling') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		const enabled = this.getNodeParameter('autoscalingEnabled', i) as boolean;
		const min = this.getNodeParameter('minInstances', i) as number;
		const max = this.getNodeParameter('maxInstances', i) as number;
		const criteria = this.getNodeParameter('autoscalingCriteria', i) as IDataObject;

		const body: IDataObject = {
			enabled,
			min,
			max,
			criteria: {},
		};

		if (criteria.cpu) {(body.criteria as IDataObject).cpu = { enabled: true, percentage: criteria.cpu };}
		if (criteria.memory) {(body.criteria as IDataObject).memory = { enabled: true, percentage: criteria.memory };}

		responseData = (await renderCloudApiRequest.call(this, 'PUT', `/services/${serviceId}/autoscaling`, body)) as IDataObject;
	} else if (operation === 'deleteAutoscaling') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		await renderCloudApiRequest.call(this, 'DELETE', `/services/${serviceId}/autoscaling`);
		responseData = { success: true, serviceId };
	} else if (operation === 'purgeCache') {
		const serviceId = this.getNodeParameter('serviceId', i) as string;
		validateServiceId(serviceId);
		await renderCloudApiRequest.call(this, 'POST', `/services/${serviceId}/cache/purge`);
		responseData = { success: true, serviceId };
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
