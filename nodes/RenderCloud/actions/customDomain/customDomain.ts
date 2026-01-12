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
} from '../../transport/GenericFunctions';

export const customDomainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customDomain'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add a custom domain to a service',
				action: 'Add a custom domain',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a custom domain',
				action: 'Delete a custom domain',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve custom domain details',
				action: 'Get a custom domain',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List custom domains for a service',
				action: 'List custom domains',
			},
			{
				name: 'Verify DNS',
				value: 'verifyDns',
				description: 'Verify DNS configuration for a domain',
				action: 'Verify DNS for a custom domain',
			},
		],
		default: 'list',
	},
];

export const customDomainFields: INodeProperties[] = [
	// ----------------------------------
	//         customDomain: all operations
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customDomain'],
			},
		},
		description: 'The ID of the service (srv-xxxxx format)',
	},
	// ----------------------------------
	//         customDomain: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['customDomain'],
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
				resource: ['customDomain'],
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
				resource: ['customDomain'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by domain name',
			},
			{
				displayName: 'Domain Type',
				name: 'domainType',
				type: 'options',
				options: [
					{ name: 'Apex', value: 'apex' },
					{ name: 'Subdomain', value: 'subdomain' },
				],
				default: 'apex',
				description: 'Filter by domain type',
			},
			{
				displayName: 'Verification Status',
				name: 'verificationStatus',
				type: 'options',
				options: [
					{ name: 'Verified', value: 'verified' },
					{ name: 'Unverified', value: 'unverified' },
				],
				default: 'verified',
				description: 'Filter by verification status',
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
		],
	},
	// ----------------------------------
	//         customDomain: get, delete, verifyDns
	// ----------------------------------
	{
		displayName: 'Custom Domain ID',
		name: 'customDomainId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customDomain'],
				operation: ['get', 'delete', 'verifyDns'],
			},
		},
		description: 'The ID of the custom domain',
	},
	// ----------------------------------
	//         customDomain: add
	// ----------------------------------
	{
		displayName: 'Domain Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customDomain'],
				operation: ['add'],
			},
		},
		placeholder: 'app.example.com',
		description: 'The domain name to add',
	},
];

export async function executeCustomDomainOperation(
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

		if (filters.name) {query.name = filters.name;}
		if (filters.domainType) {query.domainType = filters.domainType;}
		if (filters.verificationStatus) {query.verificationStatus = filters.verificationStatus;}
		if (filters.createdBefore) {query.createdBefore = filters.createdBefore;}
		if (filters.createdAfter) {query.createdAfter = filters.createdAfter;}

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				`/services/${serviceId}/custom-domains`,
				{},
				query,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				`/services/${serviceId}/custom-domains`,
				{},
				query,
			);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.customDomain || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const customDomainId = this.getNodeParameter('customDomainId', i) as string;
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/services/${serviceId}/custom-domains/${customDomainId}`,
		)) as IDataObject;
	} else if (operation === 'add') {
		const name = this.getNodeParameter('name', i) as string;
		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/custom-domains`,
			{ name },
		)) as IDataObject;
	} else if (operation === 'delete') {
		const customDomainId = this.getNodeParameter('customDomainId', i) as string;
		await renderCloudApiRequest.call(
			this,
			'DELETE',
			`/services/${serviceId}/custom-domains/${customDomainId}`,
		);
		responseData = { success: true, customDomainId };
	} else if (operation === 'verifyDns') {
		const customDomainId = this.getNodeParameter('customDomainId', i) as string;
		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/custom-domains/${customDomainId}/verify`,
		)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
