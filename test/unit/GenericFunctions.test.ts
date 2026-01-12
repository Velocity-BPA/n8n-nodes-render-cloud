/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	validateServiceId,
	validateDeployId,
	validateProjectId,
	validateEnvironmentId,
	validatePostgresId,
	validateKeyValueId,
	validateDiskId,
	validateEnvGroupId,
	handleDateFilters,
} from '../../nodes/RenderCloud/transport/GenericFunctions';

describe('GenericFunctions', () => {
	describe('Validation Functions', () => {
		describe('validateServiceId', () => {
			it('should not throw for valid service IDs', () => {
				expect(() => validateServiceId('srv-abc123')).not.toThrow();
				expect(() => validateServiceId('srv-123456789')).not.toThrow();
				expect(() => validateServiceId('srv-abcdefghij')).not.toThrow();
			});

			it('should throw for invalid service IDs', () => {
				expect(() => validateServiceId('abc123')).toThrow('Invalid service ID format');
				expect(() => validateServiceId('dep-abc123')).toThrow('Invalid service ID format');
				expect(() => validateServiceId('')).toThrow('Invalid service ID format');
			});
		});

		describe('validateDeployId', () => {
			it('should not throw for valid deploy IDs', () => {
				expect(() => validateDeployId('dep-abc123')).not.toThrow();
				expect(() => validateDeployId('dep-123456789')).not.toThrow();
			});

			it('should throw for invalid deploy IDs', () => {
				expect(() => validateDeployId('abc123')).toThrow('Invalid deploy ID format');
				expect(() => validateDeployId('srv-abc123')).toThrow('Invalid deploy ID format');
				expect(() => validateDeployId('')).toThrow('Invalid deploy ID format');
			});
		});

		describe('validateProjectId', () => {
			it('should not throw for valid project IDs', () => {
				expect(() => validateProjectId('prj-abc123')).not.toThrow();
				expect(() => validateProjectId('prj-123456789')).not.toThrow();
			});

			it('should throw for invalid project IDs', () => {
				expect(() => validateProjectId('abc123')).toThrow('Invalid project ID format');
				expect(() => validateProjectId('srv-abc123')).toThrow('Invalid project ID format');
				expect(() => validateProjectId('')).toThrow('Invalid project ID format');
			});
		});

		describe('validateEnvironmentId', () => {
			it('should not throw for valid environment IDs', () => {
				expect(() => validateEnvironmentId('env-abc123')).not.toThrow();
				expect(() => validateEnvironmentId('env-123456789')).not.toThrow();
			});

			it('should throw for invalid environment IDs', () => {
				expect(() => validateEnvironmentId('abc123')).toThrow('Invalid environment ID format');
				expect(() => validateEnvironmentId('srv-abc123')).toThrow('Invalid environment ID format');
				expect(() => validateEnvironmentId('')).toThrow('Invalid environment ID format');
			});
		});

		describe('validatePostgresId', () => {
			it('should not throw for valid postgres IDs', () => {
				expect(() => validatePostgresId('dpg-abc123')).not.toThrow();
				expect(() => validatePostgresId('dpg-123456789')).not.toThrow();
			});

			it('should throw for invalid postgres IDs', () => {
				expect(() => validatePostgresId('abc123')).toThrow('Invalid PostgreSQL ID format');
				expect(() => validatePostgresId('srv-abc123')).toThrow('Invalid PostgreSQL ID format');
				expect(() => validatePostgresId('')).toThrow('Invalid PostgreSQL ID format');
			});
		});

		describe('validateKeyValueId', () => {
			it('should not throw for valid key value IDs', () => {
				expect(() => validateKeyValueId('red-abc123')).not.toThrow();
				expect(() => validateKeyValueId('red-123456789')).not.toThrow();
			});

			it('should throw for invalid key value IDs', () => {
				expect(() => validateKeyValueId('abc123')).toThrow('Invalid Key Value ID format');
				expect(() => validateKeyValueId('srv-abc123')).toThrow('Invalid Key Value ID format');
				expect(() => validateKeyValueId('')).toThrow('Invalid Key Value ID format');
			});
		});

		describe('validateDiskId', () => {
			it('should not throw for valid disk IDs', () => {
				expect(() => validateDiskId('dsk-abc123')).not.toThrow();
				expect(() => validateDiskId('dsk-123456789')).not.toThrow();
			});

			it('should throw for invalid disk IDs', () => {
				expect(() => validateDiskId('abc123')).toThrow('Invalid disk ID format');
				expect(() => validateDiskId('srv-abc123')).toThrow('Invalid disk ID format');
				expect(() => validateDiskId('')).toThrow('Invalid disk ID format');
			});
		});

		describe('validateEnvGroupId', () => {
			it('should not throw for valid env group IDs', () => {
				expect(() => validateEnvGroupId('evg-abc123')).not.toThrow();
				expect(() => validateEnvGroupId('evg-123456789')).not.toThrow();
			});

			it('should throw for invalid env group IDs', () => {
				expect(() => validateEnvGroupId('abc123')).toThrow('Invalid environment group ID format');
				expect(() => validateEnvGroupId('srv-abc123')).toThrow('Invalid environment group ID format');
				expect(() => validateEnvGroupId('')).toThrow('Invalid environment group ID format');
			});
		});
	});

	describe('handleDateFilters', () => {
		it('should add date filters when provided', () => {
			const options = {
				createdBefore: '2024-01-15T10:00:00Z',
				createdAfter: '2024-01-01T00:00:00Z',
				updatedBefore: '2024-01-15T10:00:00Z',
				updatedAfter: '2024-01-01T00:00:00Z',
			};
			const query: Record<string, any> = {};

			handleDateFilters(query, options);

			expect(query.createdBefore).toBe('2024-01-15T10:00:00Z');
			expect(query.createdAfter).toBe('2024-01-01T00:00:00Z');
			expect(query.updatedBefore).toBe('2024-01-15T10:00:00Z');
			expect(query.updatedAfter).toBe('2024-01-01T00:00:00Z');
		});

		it('should not add empty filters', () => {
			const options = {
				createdBefore: '',
				updatedAfter: '',
			};
			const query: Record<string, any> = {};

			handleDateFilters(query, options);

			expect(query.createdBefore).toBeUndefined();
			expect(query.updatedAfter).toBeUndefined();
		});

		it('should handle partial filters', () => {
			const options = {
				createdAfter: '2024-01-01T00:00:00Z',
			};
			const query: Record<string, any> = {};

			handleDateFilters(query, options);

			expect(query.createdAfter).toBe('2024-01-01T00:00:00Z');
			expect(query.createdBefore).toBeUndefined();
			expect(query.updatedBefore).toBeUndefined();
			expect(query.updatedAfter).toBeUndefined();
		});
	});
});
