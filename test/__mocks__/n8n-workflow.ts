/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Mock types for n8n-workflow
export interface IDataObject {
	[key: string]: any;
}

export interface INodeExecutionData {
	json: IDataObject;
	binary?: IBinaryKeyData;
	pairedItem?: IPairedItemData | IPairedItemData[];
}

export interface IBinaryKeyData {
	[key: string]: IBinaryData;
}

export interface IBinaryData {
	data: string;
	mimeType: string;
	fileName?: string;
}

export interface IPairedItemData {
	item: number;
	input?: number;
}

export interface INodeProperties {
	displayName: string;
	name: string;
	type: string;
	default: any;
	[key: string]: any;
}

export interface INodeTypeDescription {
	displayName: string;
	name: string;
	icon?: string;
	group: string[];
	version: number;
	subtitle?: string;
	description: string;
	defaults: {
		name: string;
		[key: string]: any;
	};
	inputs: string[];
	outputs: string[];
	credentials?: Array<{
		name: string;
		required: boolean;
	}>;
	webhooks?: Array<{
		name: string;
		httpMethod: string;
		responseMode: string;
		path: string;
	}>;
	properties: INodeProperties[];
}

export interface INodeType {
	description: INodeTypeDescription;
	execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
	webhook?(this: IWebhookFunctions): Promise<IWebhookResponseData>;
	webhookMethods?: {
		[key: string]: {
			checkExists?(this: IHookFunctions): Promise<boolean>;
			create?(this: IHookFunctions): Promise<boolean>;
			delete?(this: IHookFunctions): Promise<boolean>;
		};
	};
}

export interface ICredentialType {
	name: string;
	displayName: string;
	documentationUrl?: string;
	properties: INodeProperties[];
	authenticate?: IAuthenticate;
	test?: ICredentialTestRequest;
}

export interface IAuthenticate {
	type: string;
	properties: {
		[key: string]: string;
	};
}

export interface ICredentialTestRequest {
	request: {
		baseURL: string;
		url: string;
	};
}

export interface IExecuteFunctions {
	getInputData(): INodeExecutionData[];
	getNodeParameter(parameterName: string, itemIndex: number, fallbackValue?: any): any;
	getCredentials(type: string): Promise<IDataObject>;
	helpers: {
		request(options: any): Promise<any>;
		returnJsonArray(data: IDataObject | IDataObject[]): INodeExecutionData[];
		constructExecutionMetaData(
			data: INodeExecutionData[],
			options: { itemData: { item: number } }
		): INodeExecutionData[];
	};
	continueOnFail(): boolean;
}

export interface IHookFunctions {
	getWorkflowStaticData(type: string): IDataObject;
	getNodeWebhookUrl(name: string): string;
	getNodeParameter(parameterName: string, fallbackValue?: any): any;
	getCredentials(type: string): Promise<IDataObject>;
	helpers: {
		request(options: any): Promise<any>;
	};
}

export interface IWebhookFunctions {
	getWorkflowStaticData(type: string): IDataObject;
	getNodeParameter(parameterName: string, fallbackValue?: any): any;
	getRequestObject(): any;
	getBodyData(): IDataObject;
	helpers: {
		returnJsonArray(data: IDataObject | IDataObject[]): INodeExecutionData[];
	};
}

export interface IWebhookResponseData {
	workflowData?: INodeExecutionData[][];
	webhookResponse?: any;
}

export interface ILoadOptionsFunctions {
	getCredentials(type: string): Promise<IDataObject>;
	helpers: {
		request(options: any): Promise<any>;
	};
}

export class NodeApiError extends Error {
	constructor(
		_node: any,
		error: any,
		options?: { message?: string; description?: string }
	) {
		super(options?.message || error.message || 'Unknown error');
		this.name = 'NodeApiError';
	}
}

export class NodeOperationError extends Error {
	constructor(_node: any, message: string) {
		super(message);
		this.name = 'NodeOperationError';
	}
}
