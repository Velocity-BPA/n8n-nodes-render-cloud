/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RenderCloud } from '../nodes/Render Cloud/Render Cloud.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('RenderCloud Node', () => {
  let node: RenderCloud;

  beforeAll(() => {
    node = new RenderCloud();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Render Cloud');
      expect(node.description.name).toBe('rendercloud');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Service Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('listServices', () => {
    it('should list services successfully', async () => {
      const mockResponse = [{ id: 'srv-123', name: 'test-service' }];
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listServices')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('web_service')
        .mockReturnValueOnce('node')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      const result = await executeServiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.render.com/v1/services',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle listServices error', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listServices');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeServiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createService', () => {
    it('should create service successfully', async () => {
      const mockResponse = { id: 'srv-123', name: 'new-service' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createService')
        .mockReturnValueOnce('new-service')
        .mockReturnValueOnce('web_service')
        .mockReturnValueOnce('owner-123')
        .mockReturnValueOnce('https://github.com/user/repo')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce('main')
        .mockReturnValueOnce('npm run build')
        .mockReturnValueOnce('npm start')
        .mockReturnValueOnce({ envVar: [{ key: 'NODE_ENV', value: 'production' }] })
        .mockReturnValueOnce('{}');

      const result = await executeServiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.render.com/v1/services',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'new-service',
          type: 'web_service',
          ownerId: 'owner-123',
          repo: 'https://github.com/user/repo',
          autoDeploy: true,
          branch: 'main',
          buildCommand: 'npm run build',
          startCommand: 'npm start',
          envVars: { NODE_ENV: 'production' },
        },
        json: true,
      });
    });
  });

  describe('getService', () => {
    it('should get service successfully', async () => {
      const mockResponse = { id: 'srv-123', name: 'test-service' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getService')
        .mockReturnValueOnce('srv-123');

      const result = await executeServiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.render.com/v1/services/srv-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('suspendService', () => {
    it('should suspend service successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('suspendService')
        .mockReturnValueOnce('srv-123');

      const result = await executeServiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.render.com/v1/services/srv-123/suspend',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('unknown operation', () => {
    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

      await expect(
        executeServiceOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('Deploy Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.render.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('listDeploys operation', () => {
		it('should list deployments successfully', async () => {
			const mockResponse = { deploys: [{ id: 'deploy-1', status: 'live' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listDeploys')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce('');

			const result = await executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.render.com/v1/services/service-123/deploys?limit=20',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when listing deployments', async () => {
			const error = new Error('API Error');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listDeploys')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce('');

			await expect(executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('createDeploy operation', () => {
		it('should create deployment successfully', async () => {
			const mockResponse = { id: 'deploy-123', status: 'building' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createDeploy')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce(false);

			const result = await executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.render.com/v1/services/service-123/deploys',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					clearCache: false,
				},
				json: true,
			});
		});

		it('should handle errors when creating deployment', async () => {
			const error = new Error('Creation failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createDeploy')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce(false);

			await expect(executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Creation failed');
		});
	});

	describe('getDeploy operation', () => {
		it('should get deployment successfully', async () => {
			const mockResponse = { id: 'deploy-123', status: 'live' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDeploy')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('deploy-123');

			const result = await executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.render.com/v1/services/service-123/deploys/deploy-123',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting deployment', async () => {
			const error = new Error('Not found');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDeploy')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('deploy-123');

			await expect(executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Not found');
		});
	});

	describe('cancelDeploy operation', () => {
		it('should cancel deployment successfully', async () => {
			const mockResponse = { id: 'deploy-123', status: 'cancelled' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('cancelDeploy')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('deploy-123');

			const result = await executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.render.com/v1/services/service-123/deploys/deploy-123/cancel',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when canceling deployment', async () => {
			const error = new Error('Cannot cancel');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('cancelDeploy')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('deploy-123');

			await expect(executeDeployOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Cannot cancel');
		});
	});
});

describe('Environment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.render.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listEnvVars operation', () => {
    it('should list environment variables successfully', async () => {
      const mockResponse = [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '3000' }
      ];

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listEnvVars')
        .mockReturnValueOnce('srv-123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.render.com/v1/services/srv-123/env-vars',
        headers: {
          'Authorization': 'Bearer test-key',
          'Accept': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
    });

    it('should handle errors when listing environment variables', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listEnvVars')
        .mockReturnValueOnce('srv-123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('API Error')
      );

      await expect(
        executeEnvironmentOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('updateEnvVars operation', () => {
    it('should update environment variables successfully', async () => {
      const mockResponse = { message: 'Environment variables updated' };
      const envVarsData = {
        envVar: [
          { key: 'NODE_ENV', value: 'production' },
          { key: 'PORT', value: '3000' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateEnvVars')
        .mockReturnValueOnce('srv-123')
        .mockReturnValueOnce(envVarsData);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.render.com/v1/services/srv-123/env-vars',
        headers: {
          'Authorization': 'Bearer test-key',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          'NODE_ENV': 'production',
          'PORT': '3000'
        },
        json: true,
      });

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
    });

    it('should handle errors when updating environment variables', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateEnvVars')
        .mockReturnValueOnce('srv-123')
        .mockReturnValueOnce({ envVar: [] });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Update failed')
      );

      await expect(
        executeEnvironmentOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Update failed');
    });
  });
});

describe('Custom Domain Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.render.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('listCustomDomains', () => {
		it('should list custom domains successfully', async () => {
			const mockResponse = [{ id: 'domain-1', name: 'example.com' }];
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listCustomDomains')
				.mockReturnValueOnce('service-123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.render.com/v1/services/service-123/custom-domains',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle listCustomDomains error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listCustomDomains')
				.mockReturnValueOnce('service-123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('createCustomDomain', () => {
		it('should create custom domain successfully', async () => {
			const mockResponse = { id: 'domain-1', name: 'example.com' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('example.com');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.render.com/v1/services/service-123/custom-domains',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'example.com',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle createCustomDomain error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('example.com');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getCustomDomain', () => {
		it('should get custom domain successfully', async () => {
			const mockResponse = { id: 'domain-1', name: 'example.com' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('domain-1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.render.com/v1/services/service-123/custom-domains/domain-1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getCustomDomain error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('domain-1');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('deleteCustomDomain', () => {
		it('should delete custom domain successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('domain-1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.render.com/v1/services/service-123/custom-domains/domain-1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle deleteCustomDomain error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('domain-1');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('verifyCustomDomain', () => {
		it('should verify custom domain successfully', async () => {
			const mockResponse = { verified: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('domain-1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.render.com/v1/services/service-123/custom-domains/domain-1/verify',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle verifyCustomDomain error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyCustomDomain')
				.mockReturnValueOnce('service-123')
				.mockReturnValueOnce('domain-1');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeCustomDomainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});
});

describe('Disk Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.render.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listDisks operation', () => {
    it('should list disks successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listDisks')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      const mockResponse = [{ id: 'disk1', name: 'test-disk' }];
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.render.com/v1/disks',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        qs: { limit: 20 },
        json: true
      });
    });
  });

  describe('createDisk operation', () => {
    it('should create disk successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createDisk')
        .mockReturnValueOnce('test-disk')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('/data')
        .mockReturnValueOnce('service123');

      const mockResponse = { id: 'disk123', name: 'test-disk' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.render.com/v1/disks',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'test-disk',
          sizeGB: 10,
          mountPath: '/data',
          serviceId: 'service123'
        },
        json: true
      });
    });
  });

  describe('getDisk operation', () => {
    it('should get disk successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getDisk')
        .mockReturnValueOnce('disk123');

      const mockResponse = { id: 'disk123', name: 'test-disk' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.render.com/v1/disks/disk123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('updateDisk operation', () => {
    it('should update disk successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateDisk')
        .mockReturnValueOnce('disk123')
        .mockReturnValueOnce('updated-disk')
        .mockReturnValueOnce(20);

      const mockResponse = { id: 'disk123', name: 'updated-disk' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.render.com/v1/disks/disk123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'updated-disk',
          sizeGB: 20
        },
        json: true
      });
    });
  });

  describe('deleteDisk operation', () => {
    it('should delete disk successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteDisk')
        .mockReturnValueOnce('disk123');

      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.render.com/v1/disks/disk123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('error handling', () => {
    it('should handle errors with continueOnFail enabled', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listDisks');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual({ error: 'API Error' });
    });

    it('should throw error when continueOnFail is disabled', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listDisks');
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeDiskOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });
});

describe('PostgreSQL Database Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-api-key', 
				baseUrl: 'https://api.render.com/v1' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
		};
	});

	it('should list PostgreSQL databases successfully', async () => {
		const mockResponse = [{ id: 'db1', name: 'test-db' }];
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'listPostgresDatabases';
			if (param === 'name') return 'test-db';
			if (param === 'limit') return 20;
			return '';
		});
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePostgreSQLDatabaseOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.render.com/v1/postgres',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Accept': 'application/json',
			},
			qs: { name: 'test-db', limit: 20 },
			json: true,
		});
	});

	it('should create PostgreSQL database successfully', async () => {
		const mockResponse = { id: 'db1', name: 'new-db' };
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'createPostgresDatabase';
			if (param === 'name') return 'new-db';
			if (param === 'databaseUser') return 'dbuser';
			if (param === 'databaseName') return 'newdb';
			if (param === 'plan') return 'starter';
			if (param === 'region') return 'oregon';
			if (param === 'version') return '15';
			return {};
		});
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePostgreSQLDatabaseOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should handle errors when continuing on fail', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getPostgresDatabase';
			if (param === 'databaseId') return 'invalid-id';
			return '';
		});
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Database not found'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executePostgreSQLDatabaseOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: { error: 'Database not found' }, pairedItem: { item: 0 } }]);
	});
});

describe('Redis Instance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.render.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listRedisInstances', () => {
    it('should list Redis instances successfully', async () => {
      const mockResponse = {
        redis: [
          { id: 'redis-1', name: 'test-redis', plan: 'starter', status: 'available' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listRedisInstances')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle list Redis instances error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listRedisInstances');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeRedisInstanceOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('createRedisInstance', () => {
    it('should create Redis instance successfully', async () => {
      const mockResponse = { id: 'redis-1', name: 'test-redis', plan: 'starter' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createRedisInstance')
        .mockReturnValueOnce('test-redis')
        .mockReturnValueOnce('starter')
        .mockReturnValueOnce('ohio')
        .mockReturnValueOnce('allkeys-lru')
        .mockReturnValueOnce('192.168.1.0/24');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle create Redis instance error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createRedisInstance');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Creation failed'));

      await expect(
        executeRedisInstanceOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('getRedisInstance', () => {
    it('should get Redis instance successfully', async () => {
      const mockResponse = { id: 'redis-1', name: 'test-redis', plan: 'starter' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRedisInstance')
        .mockReturnValueOnce('redis-1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateRedisInstance', () => {
    it('should update Redis instance successfully', async () => {
      const mockResponse = { id: 'redis-1', name: 'test-redis', plan: 'standard' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateRedisInstance')
        .mockReturnValueOnce('redis-1')
        .mockReturnValueOnce('standard')
        .mockReturnValueOnce('volatile-lru')
        .mockReturnValueOnce('10.0.0.0/8');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteRedisInstance', () => {
    it('should delete Redis instance successfully', async () => {
      const mockResponse = { message: 'Redis instance deleted successfully' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteRedisInstance')
        .mockReturnValueOnce('redis-1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('suspendRedisInstance', () => {
    it('should suspend Redis instance successfully', async () => {
      const mockResponse = { id: 'redis-1', status: 'suspended' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('suspendRedisInstance')
        .mockReturnValueOnce('redis-1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('resumeRedisInstance', () => {
    it('should resume Redis instance successfully', async () => {
      const mockResponse = { id: 'redis-1', status: 'available' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('resumeRedisInstance')
        .mockReturnValueOnce('redis-1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRedisInstanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Owner Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.render.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should list owners successfully', async () => {
    const mockResponse = [
      { id: 'owner1', name: 'Team 1', type: 'team' },
      { id: 'owner2', name: 'User 2', type: 'user' },
    ];

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listOwners')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce('');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOwnerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.render.com/v1/owners',
      headers: {
        'Authorization': 'Bearer test-key',
        'Accept': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  test('should get owner successfully', async () => {
    const mockResponse = { id: 'owner1', name: 'Team 1', type: 'team', members: [] };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOwner')
      .mockReturnValueOnce('owner1');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOwnerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.render.com/v1/owners/owner1',
      headers: {
        'Authorization': 'Bearer test-key',
        'Accept': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getOwner');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeOwnerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getOwner');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(
      executeOwnerOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});
});
