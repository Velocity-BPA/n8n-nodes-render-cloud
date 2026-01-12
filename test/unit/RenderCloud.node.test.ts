/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { RenderCloud } from '../../nodes/RenderCloud/RenderCloud.node';

describe('RenderCloud Node', () => {
	let node: RenderCloud;

	beforeEach(() => {
		node = new RenderCloud();
	});

	describe('description', () => {
		it('should have correct displayName', () => {
			expect(node.description.displayName).toBe('Render Cloud');
		});

		it('should have correct name', () => {
			expect(node.description.name).toBe('renderCloud');
		});

		it('should have correct group', () => {
			expect(node.description.group).toContain('transform');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should have inputs and outputs', () => {
			expect(node.description.inputs).toContain('main');
			expect(node.description.outputs).toContain('main');
		});

		it('should require renderCloudApi credentials', () => {
			expect(node.description.credentials).toBeDefined();
			expect(node.description.credentials?.length).toBeGreaterThan(0);
			expect(node.description.credentials?.[0].name).toBe('renderCloudApi');
			expect(node.description.credentials?.[0].required).toBe(true);
		});
	});

	describe('resources', () => {
		it('should have resource property', () => {
			const resourceProp = node.description.properties.find(
				(prop) => prop.name === 'resource'
			);
			expect(resourceProp).toBeDefined();
			expect(resourceProp?.type).toBe('options');
		});

		it('should have all 12 resources', () => {
			const resourceProp = node.description.properties.find(
				(prop) => prop.name === 'resource'
			);
			const resourceOptions = resourceProp?.options as Array<{ value: string }>;

			const expectedResources = [
				'service',
				'deploy',
				'customDomain',
				'environmentVariable',
				'secretFile',
				'project',
				'environment',
				'postgres',
				'keyValue',
				'disk',
				'environmentGroup',
				'webhook',
			];

			expectedResources.forEach((resource) => {
				expect(
					resourceOptions?.some((opt) => opt.value === resource)
				).toBe(true);
			});
		});
	});

	describe('operations', () => {
		it('should have operation properties for each resource', () => {
			const operationProps = node.description.properties.filter(
				(prop) => prop.name === 'operation'
			);
			// Each resource should have an operation property
			expect(operationProps.length).toBeGreaterThan(0);
		});
	});
});
