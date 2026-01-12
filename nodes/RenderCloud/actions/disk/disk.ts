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
	validateDiskId,
} from '../../transport/GenericFunctions';

export const diskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['disk'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add a disk to a service',
				action: 'Add a disk',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a disk',
				action: 'Delete a disk',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve disk details',
				action: 'Get a disk',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List disks for a service',
				action: 'List disks',
			},
			{
				name: 'List Snapshots',
				value: 'listSnapshots',
				description: 'List disk snapshots',
				action: 'List disk snapshots',
			},
			{
				name: 'Restore Snapshot',
				value: 'restoreSnapshot',
				description: 'Restore a disk from a snapshot',
				action: 'Restore a disk from a snapshot',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update disk configuration',
				action: 'Update a disk',
			},
		],
		default: 'list',
	},
];

export const diskFields: INodeProperties[] = [
	// ----------------------------------
	//         disk: all operations
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['disk'],
			},
		},
		description: 'The ID of the service (srv-xxxxx format)',
	},
	// ----------------------------------
	//         disk: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['list', 'listSnapshots'],
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
				resource: ['disk'],
				operation: ['list', 'listSnapshots'],
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
	//         disk: get, delete, update, listSnapshots, restoreSnapshot
	// ----------------------------------
	{
		displayName: 'Disk ID',
		name: 'diskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['get', 'delete', 'update', 'listSnapshots', 'restoreSnapshot'],
			},
		},
		description: 'The ID of the disk (dsk-xxxxx format)',
	},
	// ----------------------------------
	//         disk: add
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['add'],
			},
		},
		description: 'The name of the disk',
	},
	{
		displayName: 'Mount Path',
		name: 'mountPath',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['add'],
			},
		},
		placeholder: '/data',
		description: 'Mount path in the container',
	},
	{
		displayName: 'Size (GB)',
		name: 'sizeGB',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
		},
		default: 10,
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['add'],
			},
		},
		description: 'Disk size in GB',
	},
	// ----------------------------------
	//         disk: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the disk',
			},
			{
				displayName: 'Mount Path',
				name: 'mountPath',
				type: 'string',
				default: '',
				description: 'Mount path in the container',
			},
			{
				displayName: 'Size (GB)',
				name: 'sizeGB',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 10,
				description: 'Disk size in GB (can only increase)',
			},
		],
	},
	// ----------------------------------
	//         disk: restoreSnapshot
	// ----------------------------------
	{
		displayName: 'Snapshot ID',
		name: 'snapshotId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['disk'],
				operation: ['restoreSnapshot'],
			},
		},
		description: 'The ID of the snapshot to restore from',
	},
];

export async function executeDiskOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const serviceId = this.getNodeParameter('serviceId', i) as string;
	validateServiceId(serviceId);

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				`/services/${serviceId}/disks`,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				`/services/${serviceId}/disks`,
				{},
				{ limit },
			);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.disk || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'get') {
		const diskId = this.getNodeParameter('diskId', i) as string;
		validateDiskId(diskId);
		responseData = (await renderCloudApiRequest.call(
			this,
			'GET',
			`/services/${serviceId}/disks/${diskId}`,
		)) as IDataObject;
	} else if (operation === 'add') {
		const name = this.getNodeParameter('name', i) as string;
		const mountPath = this.getNodeParameter('mountPath', i) as string;
		const sizeGB = this.getNodeParameter('sizeGB', i) as number;

		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/disks`,
			{ name, mountPath, sizeGB },
		)) as IDataObject;
	} else if (operation === 'update') {
		const diskId = this.getNodeParameter('diskId', i) as string;
		validateDiskId(diskId);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) {body.name = updateFields.name;}
		if (updateFields.mountPath) {body.mountPath = updateFields.mountPath;}
		if (updateFields.sizeGB) {body.sizeGB = updateFields.sizeGB;}

		responseData = (await renderCloudApiRequest.call(
			this,
			'PATCH',
			`/services/${serviceId}/disks/${diskId}`,
			body,
		)) as IDataObject;
	} else if (operation === 'delete') {
		const diskId = this.getNodeParameter('diskId', i) as string;
		validateDiskId(diskId);
		await renderCloudApiRequest.call(
			this,
			'DELETE',
			`/services/${serviceId}/disks/${diskId}`,
		);
		responseData = { success: true, diskId };
	} else if (operation === 'listSnapshots') {
		const diskId = this.getNodeParameter('diskId', i) as string;
		validateDiskId(diskId);
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await renderCloudApiRequestAllItems.call(
				this,
				'GET',
				`/services/${serviceId}/disks/${diskId}/snapshots`,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await renderCloudApiRequest.call(
				this,
				'GET',
				`/services/${serviceId}/disks/${diskId}/snapshots`,
				{},
				{ limit },
			);
			responseData = Array.isArray(response)
				? (response.map((item) => (item.snapshot || item) as IDataObject).slice(0, limit) as IDataObject[])
				: [response as IDataObject];
		}
	} else if (operation === 'restoreSnapshot') {
		const diskId = this.getNodeParameter('diskId', i) as string;
		validateDiskId(diskId);
		const snapshotId = this.getNodeParameter('snapshotId', i) as string;

		responseData = (await renderCloudApiRequest.call(
			this,
			'POST',
			`/services/${serviceId}/disks/${diskId}/snapshots/${snapshotId}/restore`,
		)) as IDataObject;
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
