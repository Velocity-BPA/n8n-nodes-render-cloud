/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { RenderCloudApi } from '../../credentials/RenderCloudApi.credentials';

describe('RenderCloudApi Credentials', () => {
	let credentials: RenderCloudApi;

	beforeEach(() => {
		credentials = new RenderCloudApi();
	});

	describe('description', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('renderCloudApi');
		});

		it('should have correct displayName', () => {
			expect(credentials.displayName).toBe('Render Cloud API');
		});

		it('should have documentation URL', () => {
			expect(credentials.documentationUrl).toBeDefined();
			expect(credentials.documentationUrl).toContain('render');
		});
	});

	describe('properties', () => {
		it('should have apiKey property', () => {
			const apiKeyProp = credentials.properties.find(
				(prop) => prop.name === 'apiKey'
			);
			expect(apiKeyProp).toBeDefined();
			expect(apiKeyProp?.type).toBe('string');
			expect(apiKeyProp?.typeOptions?.password).toBe(true);
		});
	});

	describe('authentication', () => {
		it('should use Bearer token authentication', () => {
			expect(credentials.authenticate).toBeDefined();
			expect(credentials.authenticate?.type).toBe('generic');
			expect(credentials.authenticate?.properties?.headers?.Authorization).toBe(
				'=Bearer {{$credentials.apiKey}}'
			);
		});
	});

	describe('test', () => {
		it('should have test request configuration', () => {
			expect(credentials.test).toBeDefined();
			expect(credentials.test?.request?.baseURL).toBe('https://api.render.com/v1');
			expect(credentials.test?.request?.url).toBe('/owners');
		});
	});
});
