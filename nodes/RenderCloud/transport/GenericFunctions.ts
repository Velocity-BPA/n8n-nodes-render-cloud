/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.render.com/v1';

export async function renderCloudApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject | IDataObject[]> {
	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'renderCloudApi',
			options,
		);
		return response as IDataObject | IDataObject[];
	} catch (error: unknown) {
		const err = error as { statusCode?: number; response?: { headers?: Record<string, string> } };
		if (err.statusCode === 429) {
			const resetTime = err.response?.headers?.['ratelimit-reset'] || 'unknown';
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: `Rate limit exceeded. Retry after ${resetTime} seconds.`,
			});
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function renderCloudApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let cursor: string | undefined;
	const limit = 100;

	do {
		const qs: IDataObject = { ...query, limit };
		if (cursor) {
			qs.cursor = cursor;
		}

		const response = await renderCloudApiRequest.call(this, method, endpoint, body, qs);

		if (Array.isArray(response)) {
			for (const item of response) {
				// Extract resource from cursor wrapper
				const resourceKey = Object.keys(item).find((k) => k !== 'cursor');
				if (resourceKey && item[resourceKey]) {
					returnData.push(item[resourceKey] as IDataObject);
				}
				// Update cursor for next page
				if (item.cursor) {
					cursor = item.cursor as string;
				}
			}

			// If fewer items than limit, we're done
			if (response.length < limit) {
				cursor = undefined;
			}
		} else {
			cursor = undefined;
		}
	} while (cursor);

	return returnData;
}

export function handleDateFilters(query: IDataObject, options: IDataObject): void {
	if (options.createdBefore) {
		query.createdBefore = options.createdBefore;
	}
	if (options.createdAfter) {
		query.createdAfter = options.createdAfter;
	}
	if (options.updatedBefore) {
		query.updatedBefore = options.updatedBefore;
	}
	if (options.updatedAfter) {
		query.updatedAfter = options.updatedAfter;
	}
}

export function validateServiceId(serviceId: string): void {
	if (!serviceId.startsWith('srv-')) {
		throw new Error(`Invalid service ID format. Expected format: srv-xxxxx, got: ${serviceId}`);
	}
}

export function validateDeployId(deployId: string): void {
	if (!deployId.startsWith('dep-')) {
		throw new Error(`Invalid deploy ID format. Expected format: dep-xxxxx, got: ${deployId}`);
	}
}

export function validateProjectId(projectId: string): void {
	if (!projectId.startsWith('prj-')) {
		throw new Error(`Invalid project ID format. Expected format: prj-xxxxx, got: ${projectId}`);
	}
}

export function validateEnvironmentId(environmentId: string): void {
	if (!environmentId.startsWith('env-')) {
		throw new Error(`Invalid environment ID format. Expected format: env-xxxxx, got: ${environmentId}`);
	}
}

export function validatePostgresId(postgresId: string): void {
	if (!postgresId.startsWith('dpg-')) {
		throw new Error(`Invalid PostgreSQL ID format. Expected format: dpg-xxxxx, got: ${postgresId}`);
	}
}

export function validateKeyValueId(keyValueId: string): void {
	if (!keyValueId.startsWith('red-')) {
		throw new Error(`Invalid Key Value ID format. Expected format: red-xxxxx, got: ${keyValueId}`);
	}
}

export function validateDiskId(diskId: string): void {
	if (!diskId.startsWith('dsk-')) {
		throw new Error(`Invalid disk ID format. Expected format: dsk-xxxxx, got: ${diskId}`);
	}
}

export function validateEnvGroupId(envGroupId: string): void {
	if (!envGroupId.startsWith('evg-')) {
		throw new Error(`Invalid environment group ID format. Expected format: evg-xxxxx, got: ${envGroupId}`);
	}
}
