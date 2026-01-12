/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export type ServiceType = 'web_service' | 'static_site' | 'background_worker' | 'private_service' | 'cron_job';

export type Environment = 'docker' | 'node' | 'python' | 'go' | 'rust' | 'ruby' | 'elixir' | 'static';

export type Region = 'oregon' | 'frankfurt' | 'ohio' | 'singapore' | 'virginia';

export type SuspendedStatus = 'suspended' | 'not_suspended' | 'all';

export interface RenderService extends IDataObject {
	id: string;
	autoDeploy: string;
	branch: string;
	buildFilter: IDataObject;
	createdAt: string;
	imagePath: string;
	name: string;
	notifyOnFail: string;
	ownerId: string;
	repo: string;
	rootDir: string;
	slug: string;
	suspended: string;
	suspenders: string[];
	type: ServiceType;
	updatedAt: string;
	serviceDetails: IDataObject;
}

export interface RenderDeploy extends IDataObject {
	id: string;
	commit: IDataObject;
	createdAt: string;
	finishedAt: string;
	status: string;
	trigger: string;
	updatedAt: string;
}

export interface RenderCustomDomain extends IDataObject {
	id: string;
	name: string;
	domainType: string;
	publicSuffix: string;
	redirectForName: string;
	verificationStatus: string;
	createdAt: string;
	server: IDataObject;
}

export interface RenderEnvVar extends IDataObject {
	key: string;
	value: string;
}

export interface RenderSecretFile extends IDataObject {
	name: string;
	contents: string;
}

export interface RenderProject extends IDataObject {
	id: string;
	name: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

export interface RenderEnvironment extends IDataObject {
	id: string;
	name: string;
	projectId: string;
	protectedStatus: string;
	createdAt: string;
	updatedAt: string;
}

export interface RenderPostgres extends IDataObject {
	id: string;
	name: string;
	databaseName: string;
	databaseUser: string;
	ownerId: string;
	plan: string;
	region: string;
	status: string;
	version: string;
	createdAt: string;
	updatedAt: string;
	suspendedAt: string;
	expiresAt: string;
	highAvailabilityEnabled: boolean;
}

export interface RenderKeyValue extends IDataObject {
	id: string;
	name: string;
	ownerId: string;
	plan: string;
	region: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	maxmemoryPolicy: string;
}

export interface RenderDisk extends IDataObject {
	id: string;
	name: string;
	mountPath: string;
	sizeGB: number;
	serviceId: string;
	createdAt: string;
	updatedAt: string;
}

export interface RenderEnvGroup extends IDataObject {
	id: string;
	name: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
	environmentId: string;
	serviceLinks: IDataObject[];
	envVars: RenderEnvVar[];
	secretFiles: RenderSecretFile[];
}

export interface RenderWebhook extends IDataObject {
	id: string;
	ownerId: string;
	url: string;
	events: string[];
	serviceIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface WebhookEvent {
	id: string;
	type: string;
	timestamp: string;
	data: IDataObject;
}

export const WEBHOOK_EVENTS = [
	'deploy_started',
	'deploy_succeeded',
	'deploy_failed',
	'deploy_canceled',
	'service_created',
	'service_deleted',
	'service_suspended',
	'service_resumed',
	'server_failed',
	'server_available',
	'certificate_renewed',
	'maintenance_started',
	'maintenance_completed',
] as const;

export type WebhookEventType = typeof WEBHOOK_EVENTS[number];
