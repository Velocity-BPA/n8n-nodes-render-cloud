import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RenderCloudApi implements ICredentialType {
	name = 'renderCloudApi';
	displayName = 'Render Cloud API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from Render Dashboard under Account Settings. Should start with "rnd_".',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.render.com/v1',
			required: true,
			description: 'Base URL for Render API',
		},
	];
}