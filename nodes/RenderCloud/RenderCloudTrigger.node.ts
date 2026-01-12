/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { renderCloudApiRequest } from './transport/GenericFunctions';

export class RenderCloudTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Render Cloud Trigger',
		name: 'renderCloudTrigger',
		icon: 'file:renderCloud.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Render Cloud events occur',
		defaults: {
			name: 'Render Cloud Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'renderCloudApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the workspace owner (usr-xxxxx or tea-xxxxx)',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: 'Certificate Renewed',
						value: 'certificate_renewed',
						description: 'TLS certificate was renewed',
					},
					{
						name: 'Deploy Canceled',
						value: 'deploy_canceled',
						description: 'Deployment was canceled',
					},
					{
						name: 'Deploy Failed',
						value: 'deploy_failed',
						description: 'Deployment failed',
					},
					{
						name: 'Deploy Started',
						value: 'deploy_started',
						description: 'Deployment has started',
					},
					{
						name: 'Deploy Succeeded',
						value: 'deploy_succeeded',
						description: 'Deployment completed successfully',
					},
					{
						name: 'Maintenance Completed',
						value: 'maintenance_completed',
						description: 'Scheduled maintenance completed',
					},
					{
						name: 'Maintenance Started',
						value: 'maintenance_started',
						description: 'Scheduled maintenance started',
					},
					{
						name: 'Server Available',
						value: 'server_available',
						description: 'Server became available after being down',
					},
					{
						name: 'Server Failed',
						value: 'server_failed',
						description: 'Server failure detected',
					},
					{
						name: 'Service Created',
						value: 'service_created',
						description: 'New service was created',
					},
					{
						name: 'Service Deleted',
						value: 'service_deleted',
						description: 'Service was deleted',
					},
					{
						name: 'Service Resumed',
						value: 'service_resumed',
						description: 'Service was resumed from suspended state',
					},
					{
						name: 'Service Suspended',
						value: 'service_suspended',
						description: 'Service was suspended',
					},
				],
				description: 'The events to listen to',
			},
			{
				displayName: 'Service IDs',
				name: 'serviceIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of service IDs to filter events (leave empty for all services)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature (recommended for security)',
					},
					{
						displayName: 'Webhook Secret',
						name: 'webhookSecret',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Secret used to verify webhook signatures. If not provided, a random secret will be generated.',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');

				if (webhookData.webhookId === undefined) {
					return false;
				}

				try {
					const response = await renderCloudApiRequest.call(
						this,
						'GET',
						`/webhooks/${webhookData.webhookId}`,
					) as IDataObject;
					// Check if webhook URL matches
					if (response && response.url === webhookUrl) {
						return true;
					}
				} catch {
					// Webhook doesn't exist or error occurred
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const ownerId = this.getNodeParameter('ownerId') as string;
				const events = this.getNodeParameter('events') as string[];
				const serviceIds = this.getNodeParameter('serviceIds') as string;
				const options = this.getNodeParameter('options') as IDataObject;

				// Generate or use provided secret
				let secret = options.webhookSecret as string;
				if (!secret) {
					secret = crypto.randomBytes(32).toString('hex');
				}

				const body: IDataObject = {
					ownerId,
					url: webhookUrl,
					events,
					secret,
				};

				// Add service IDs if specified
				if (serviceIds) {
					body.serviceIds = serviceIds
						.split(',')
						.map((id: string) => id.trim())
						.filter((id: string) => id);
				}

				try {
					const response = await renderCloudApiRequest.call(
						this,
						'POST',
						'/webhooks',
						body,
					) as IDataObject;

					if (response && response.id) {
						webhookData.webhookId = response.id as string;
						webhookData.webhookSecret = secret;
						return true;
					}
				} catch (error) {
					throw new Error(`Failed to create Render webhook: ${(error as Error).message}`);
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await renderCloudApiRequest.call(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
						);
					} catch (error) {
						// Webhook may already be deleted
						console.warn(`Failed to delete webhook: ${(error as Error).message}`);
					}

					delete webhookData.webhookId;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const webhookData = this.getWorkflowStaticData('node');
		const options = this.getNodeParameter('options') as IDataObject;
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;

		// Verify signature if enabled
		if (options.verifySignature !== false && webhookData.webhookSecret) {
			const signature = req.headers['x-render-signature'] as string;

			if (signature) {
				const payload = JSON.stringify(body);
				const hmac = crypto.createHmac('sha256', webhookData.webhookSecret as string);
				hmac.update(payload);
				const expectedSignature = hmac.digest('hex');

				try {
					const isValid = crypto.timingSafeEqual(
						Buffer.from(signature),
						Buffer.from(expectedSignature),
					);

					if (!isValid) {
						return {
							webhookResponse: 'Signature verification failed',
						};
					}
				} catch {
					// Signature format mismatch
					return {
						webhookResponse: 'Invalid signature format',
					};
				}
			}
		}

		// Return the webhook payload
		return {
			workflowData: [
				this.helpers.returnJsonArray({
					id: body.id,
					type: body.type,
					timestamp: body.timestamp,
					data: body.data,
					headers: {
						'x-render-signature': req.headers['x-render-signature'],
						'content-type': req.headers['content-type'],
					},
				}),
			],
		};
	}
}
