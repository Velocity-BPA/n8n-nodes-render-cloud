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

export const secretFileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['secretFile'],
			},
		},
		options: [
			{
				name: 'Add or Update',
				value: 'addOrUpdate',
				description: 'Add or update a single secret file',
				action: 'Add or update a secret file',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a secret file',
				action: 'Delete a secret file',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a specific secret file',
				action: 'Get a secret file',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List secret files for a service',
				action: 'List secret files',
			},
			{
				name: 'Update All',
				value: 'updateAll',
				description: 'Update all secret files (replace)',
				action: 'Update all secret files',
			},
		],
		default: 'list',
	},
];

export const secretFileFields: INodeProperties[] = [
	// ----------------------------------
	//         secretFile: all operations
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secretFile'],
			},
		},
		description: 'The ID of the service (srv-xxxxx format)',
	},
	// ----------------------------------
	//         secretFile: get, delete
	// ----------------------------------
	{
		displayName: 'Secret File Name',
		name: 'secretFileName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secretFile'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The name/path of the secret file',
	},
	// ----------------------------------
	//         secretFile: addOrUpdate
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secretFile'],
				operation: ['addOrUpdate'],
			},
		},
		placeholder: '/etc/secrets/my-secret.json',
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
				resource: ['secretFile'],
				operation: ['addOrUpdate'],
			},
		},
		description: 'The contents of the secret file (will be Base64 encoded)',
	},
	// ----------------------------------
	//         secretFile: updateAll
	// ----------------------------------
	{
		displayName: 'Secret Files',
		name: 'secretFiles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['secretFile'],
				operation: ['updateAll'],
			},
		},
		placeholder: 'Add Secret File',
		options: [
			{
				name: 'secretFileValues',
				displayName: 'Secret File',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name/path of the secret file',
					},
					{
						displayName: 'Contents',
						name: 'contents',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						description: 'The contents of the secret file',
					},
				],
			},
		],
		description: 'Secret files to set (replaces all existing)',
	},
];

export async function executeSecretFileOperation(
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
			`/services/${serviceId}/secret-files`,
		);
		responseData = Array.isArray(response)
			? (response.map((item) => (item.secretFile || item) as IDataObject) as IDataObject[])
			: [response as IDataObject];
	} else if (operation === 'get') {
		const secretFileName = this.getNodeParameter('secretFileName', i) as string;
		const encodedName = encodeURIComponent(secretFileName);
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/services/${serviceId}/secret-files/${encodedName}`,
		)) as IDataObject;
	} else if (operation === 'addOrUpdate') {
		const name = this.getNodeParameter('name', i) as string;
		const contents = this.getNodeParameter('contents', i) as string;
		const encodedName = encodeURIComponent(name);

		// Base64 encode the contents
		const base64Contents = Buffer.from(contents).toString('base64');

		responseData = (await renderCloudApiRequest.call(
			this,
			'PUT',
			`/services/${serviceId}/secret-files/${encodedName}`,
			{ name, contents: base64Contents },
		)) as IDataObject;
	} else if (operation === 'delete') {
		const secretFileName = this.getNodeParameter('secretFileName', i) as string;
		const encodedName = encodeURIComponent(secretFileName);
		await renderCloudApiRequest.call(
			this,
			'DELETE',
			`/services/${serviceId}/secret-files/${encodedName}`,
		);
		responseData = { success: true, secretFileName };
	} else if (operation === 'updateAll') {
		const secretFilesData = this.getNodeParameter('secretFiles', i) as IDataObject;
		const secretFileValues = (secretFilesData.secretFileValues as IDataObject[]) || [];

		const secretFiles = secretFileValues.map((file) => ({
			name: file.name,
			contents: Buffer.from(file.contents as string).toString('base64'),
		}));

		responseData = (await renderCloudApiRequest.call(
			this,
			'PUT',
			`/services/${serviceId}/secret-files`,
			{ secretFiles } as IDataObject,
		)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
