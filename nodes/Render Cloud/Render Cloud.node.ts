/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-rendercloud/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class RenderCloud implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Render Cloud',
    name: 'rendercloud',
    icon: 'file:rendercloud.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Render Cloud API',
    defaults: {
      name: 'Render Cloud',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'rendercloudApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Service',
            value: 'service',
          },
          {
            name: 'Deploy',
            value: 'deploy',
          },
          {
            name: 'Environment',
            value: 'environment',
          },
          {
            name: 'Custom Domain',
            value: 'customDomain',
          },
          {
            name: 'Disk',
            value: 'disk',
          },
          {
            name: 'PostgreSQL Database',
            value: 'postgreSQLDatabase',
          },
          {
            name: 'Redis Instance',
            value: 'redisInstance',
          },
          {
            name: 'Owner',
            value: 'owner',
          }
        ],
        default: 'service',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['service'] } },
  options: [
    { name: 'List Services', value: 'listServices', description: 'Retrieve all services for the authenticated user', action: 'List services' },
    { name: 'Create Service', value: 'createService', description: 'Create a new service', action: 'Create service' },
    { name: 'Get Service', value: 'getService', description: 'Retrieve a specific service by ID', action: 'Get service' },
    { name: 'Update Service', value: 'updateService', description: 'Update service configuration', action: 'Update service' },
    { name: 'Delete Service', value: 'deleteService', description: 'Delete a service', action: 'Delete service' },
    { name: 'Suspend Service', value: 'suspendService', description: 'Suspend a service', action: 'Suspend service' },
    { name: 'Resume Service', value: 'resumeService', description: 'Resume a suspended service', action: 'Resume service' },
    { name: 'Restart Service', value: 'restartService', description: 'Restart a service', action: 'Restart service' }
  ],
  default: 'listServices',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['deploy'] } },
	options: [
		{
			name: 'List Deploys',
			value: 'listDeploys',
			description: 'Get deployment history for a service',
			action: 'List deploys',
		},
		{
			name: 'Create Deploy',
			value: 'createDeploy',
			description: 'Trigger a new deployment',
			action: 'Create deploy',
		},
		{
			name: 'Get Deploy',
			value: 'getDeploy',
			description: 'Get details of a specific deployment',
			action: 'Get deploy',
		},
		{
			name: 'Cancel Deploy',
			value: 'cancelDeploy',
			description: 'Cancel a running deployment',
			action: 'Cancel deploy',
		},
	],
	default: 'listDeploys',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['environment'] } },
  options: [
    { 
      name: 'List Environment Variables', 
      value: 'listEnvVars', 
      description: 'Get environment variables for a service', 
      action: 'List environment variables' 
    },
    { 
      name: 'Update Environment Variables', 
      value: 'updateEnvVars', 
      description: 'Update environment variables for a service', 
      action: 'Update environment variables' 
    }
  ],
  default: 'listEnvVars',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['customDomain'],
		},
	},
	options: [
		{
			name: 'List Custom Domains',
			value: 'listCustomDomains',
			description: 'Get custom domains for a service',
			action: 'List custom domains',
		},
		{
			name: 'Create Custom Domain',
			value: 'createCustomDomain',
			description: 'Add a custom domain to a service',
			action: 'Create custom domain',
		},
		{
			name: 'Get Custom Domain',
			value: 'getCustomDomain',
			description: 'Get details of a custom domain',
			action: 'Get custom domain',
		},
		{
			name: 'Delete Custom Domain',
			value: 'deleteCustomDomain',
			description: 'Remove a custom domain',
			action: 'Delete custom domain',
		},
		{
			name: 'Verify Custom Domain',
			value: 'verifyCustomDomain',
			description: 'Verify custom domain ownership',
			action: 'Verify custom domain',
		},
	],
	default: 'listCustomDomains',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['disk'] } },
  options: [
    { name: 'List Disks', value: 'listDisks', description: 'Get all disks for the authenticated user', action: 'List disks' },
    { name: 'Create Disk', value: 'createDisk', description: 'Create a new persistent disk', action: 'Create disk' },
    { name: 'Get Disk', value: 'getDisk', description: 'Get details of a specific disk', action: 'Get disk' },
    { name: 'Update Disk', value: 'updateDisk', description: 'Update disk configuration', action: 'Update disk' },
    { name: 'Delete Disk', value: 'deleteDisk', description: 'Delete a persistent disk', action: 'Delete disk' }
  ],
  default: 'listDisks',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
		},
	},
	options: [
		{
			name: 'List PostgreSQL Databases',
			value: 'listPostgresDatabases',
			description: 'Get all PostgreSQL databases',
			action: 'List PostgreSQL databases',
		},
		{
			name: 'Create PostgreSQL Database',
			value: 'createPostgresDatabase',
			description: 'Create a new PostgreSQL database',
			action: 'Create PostgreSQL database',
		},
		{
			name: 'Get PostgreSQL Database',
			value: 'getPostgresDatabase',
			description: 'Get details of a PostgreSQL database',
			action: 'Get PostgreSQL database',
		},
		{
			name: 'Update PostgreSQL Database',
			value: 'updatePostgresDatabase',
			description: 'Update PostgreSQL database configuration',
			action: 'Update PostgreSQL database',
		},
		{
			name: 'Delete PostgreSQL Database',
			value: 'deletePostgresDatabase',
			description: 'Delete a PostgreSQL database',
			action: 'Delete PostgreSQL database',
		},
		{
			name: 'Suspend PostgreSQL Database',
			value: 'suspendPostgresDatabase',
			description: 'Suspend a PostgreSQL database',
			action: 'Suspend PostgreSQL database',
		},
		{
			name: 'Resume PostgreSQL Database',
			value: 'resumePostgresDatabase',
			description: 'Resume a suspended PostgreSQL database',
			action: 'Resume PostgreSQL database',
		},
	],
	default: 'listPostgresDatabases',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['redisInstance'] } },
  options: [
    { name: 'List Redis Instances', value: 'listRedisInstances', description: 'Get all Redis instances', action: 'List Redis instances' },
    { name: 'Create Redis Instance', value: 'createRedisInstance', description: 'Create a new Redis instance', action: 'Create Redis instance' },
    { name: 'Get Redis Instance', value: 'getRedisInstance', description: 'Get details of a Redis instance', action: 'Get Redis instance' },
    { name: 'Update Redis Instance', value: 'updateRedisInstance', description: 'Update Redis instance configuration', action: 'Update Redis instance' },
    { name: 'Delete Redis Instance', value: 'deleteRedisInstance', description: 'Delete a Redis instance', action: 'Delete Redis instance' },
    { name: 'Suspend Redis Instance', value: 'suspendRedisInstance', description: 'Suspend a Redis instance', action: 'Suspend Redis instance' },
    { name: 'Resume Redis Instance', value: 'resumeRedisInstance', description: 'Resume a suspended Redis instance', action: 'Resume Redis instance' },
  ],
  default: 'listRedisInstances',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['owner'] } },
  options: [
    { name: 'List Owners', value: 'listOwners', description: 'Get owners/teams for the authenticated user', action: 'List owners' },
    { name: 'Get Owner', value: 'getOwner', description: 'Get details of a specific owner/team', action: 'Get owner details' },
  ],
  default: 'listOwners',
},
{
  displayName: 'Service ID',
  name: 'serviceId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['service'], operation: ['getService', 'updateService', 'deleteService', 'suspendService', 'resumeService', 'restartService'] } },
  default: '',
  description: 'The unique identifier of the service',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: { show: { resource: ['service'], operation: ['listServices'] } },
  default: '',
  description: 'Filter services by name',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  options: [
    { name: 'Web Service', value: 'web_service' },
    { name: 'Background Worker', value: 'background_worker' },
    { name: 'Cron Job', value: 'cron_job' }
  ],
  displayOptions: { show: { resource: ['service'], operation: ['listServices', 'createService'] } },
  default: 'web_service',
  description: 'The type of service',
},
{
  displayName: 'Environment',
  name: 'env',
  type: 'options',
  options: [
    { name: 'Docker', value: 'docker' },
    { name: 'Node.js', value: 'node' },
    { name: 'Python', value: 'python' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'Go', value: 'go' },
    { name: 'Rust', value: 'rust' }
  ],
  displayOptions: { show: { resource: ['service'], operation: ['listServices'] } },
  default: 'node',
  description: 'Filter services by environment',
},
{
  displayName: 'Region',
  name: 'region',
  type: 'string',
  displayOptions: { show: { resource: ['service'], operation: ['listServices'] } },
  default: '',
  description: 'Filter services by region',
},
{
  displayName: 'Suspended',
  name: 'suspended',
  type: 'options',
  options: [
    { name: 'All', value: '' },
    { name: 'Suspended', value: 'suspended' },
    { name: 'Not Suspended', value: 'not_suspended' }
  ],
  displayOptions: { show: { resource: ['service'], operation: ['listServices'] } },
  default: '',
  description: 'Filter services by suspension status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['service'], operation: ['listServices'] } },
  default: 20,
  description: 'Maximum number of services to return',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  displayOptions: { show: { resource: ['service'], operation: ['listServices'] } },
  default: '',
  description: 'Cursor for pagination',
},
{
  displayName: 'Service Name',
  name: 'serviceName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['service'], operation: ['createService', 'updateService'] } },
  default: '',
  description: 'The name of the service',
},
{
  displayName: 'Owner ID',
  name: 'ownerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['service'], operation: ['createService'] } },
  default: '',
  description: 'The owner ID for the service',
},
{
  displayName: 'Repository',
  name: 'repo',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['service'], operation: ['createService'] } },
  default: '',
  description: 'The repository URL for the service',
},
{
  displayName: 'Auto Deploy',
  name: 'autoDeploy',
  type: 'boolean',
  displayOptions: { show: { resource: ['service'], operation: ['createService'] } },
  default: true,
  description: 'Whether to automatically deploy on repository changes',
},
{
  displayName: 'Branch',
  name: 'branch',
  type: 'string',
  displayOptions: { show: { resource: ['service'], operation: ['createService', 'updateService'] } },
  default: 'main',
  description: 'The git branch to deploy',
},
{
  displayName: 'Build Command',
  name: 'buildCommand',
  type: 'string',
  displayOptions: { show: { resource: ['service'], operation: ['createService', 'updateService'] } },
  default: '',
  description: 'The build command for the service',
},
{
  displayName: 'Start Command',
  name: 'startCommand',
  type: 'string',
  displayOptions: { show: { resource: ['service'], operation: ['createService', 'updateService'] } },
  default: '',
  description: 'The start command for the service',
},
{
  displayName: 'Environment Variables',
  name: 'envVars',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: { show: { resource: ['service'], operation: ['createService', 'updateService'] } },
  default: {},
  placeholder: 'Add Environment Variable',
  options: [
    {
      name: 'envVar',
      displayName: 'Environment Variable',
      values: [
        {
          displayName: 'Key',
          name: 'key',
          type: 'string',
          default: '',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
        },
      ],
    },
  ],
  description: 'Environment variables for the service',
},
{
  displayName: 'Service Details',
  name: 'serviceDetails',
  type: 'json',
  displayOptions: { show: { resource: ['service'], operation: ['createService', 'updateService'] } },
  default: '{}',
  description: 'Additional service configuration details as JSON',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['deploy'],
			operation: ['listDeploys', 'createDeploy', 'getDeploy', 'cancelDeploy'],
		},
	},
	default: '',
	description: 'The ID of the service',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['deploy'],
			operation: ['listDeploys'],
		},
	},
	default: 20,
	description: 'Maximum number of deployments to return',
},
{
	displayName: 'Cursor',
	name: 'cursor',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['deploy'],
			operation: ['listDeploys'],
		},
	},
	default: '',
	description: 'Cursor for pagination',
},
{
	displayName: 'Clear Cache',
	name: 'clearCache',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['deploy'],
			operation: ['createDeploy'],
		},
	},
	default: false,
	description: 'Whether to clear the build cache',
},
{
	displayName: 'Deploy ID',
	name: 'deployId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['deploy'],
			operation: ['getDeploy', 'cancelDeploy'],
		},
	},
	default: '',
	description: 'The ID of the deployment',
},
{
  displayName: 'Service ID',
  name: 'serviceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['environment'],
      operation: ['listEnvVars', 'updateEnvVars']
    }
  },
  default: '',
  description: 'The ID of the service to manage environment variables for',
},
{
  displayName: 'Environment Variables',
  name: 'envVars',
  type: 'fixedCollection',
  required: true,
  displayOptions: {
    show: {
      resource: ['environment'],
      operation: ['updateEnvVars']
    }
  },
  default: {},
  typeOptions: {
    multipleValues: true,
  },
  options: [
    {
      name: 'envVar',
      displayName: 'Environment Variable',
      values: [
        {
          displayName: 'Key',
          name: 'key',
          type: 'string',
          default: '',
          description: 'The environment variable key',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'The environment variable value',
        },
      ],
    },
  ],
  description: 'Environment variables to update',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['customDomain'],
			operation: ['listCustomDomains', 'createCustomDomain', 'getCustomDomain', 'deleteCustomDomain', 'verifyCustomDomain'],
		},
	},
	default: '',
	description: 'The ID of the service',
},
{
	displayName: 'Domain Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['customDomain'],
			operation: ['createCustomDomain'],
		},
	},
	default: '',
	description: 'The custom domain name to add',
},
{
	displayName: 'Domain ID',
	name: 'domainId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['customDomain'],
			operation: ['getCustomDomain', 'deleteCustomDomain', 'verifyCustomDomain'],
		},
	},
	default: '',
	description: 'The ID of the custom domain',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Filter disks by name',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['listDisks']
    }
  }
},
{
  displayName: 'Service ID',
  name: 'serviceId',
  type: 'string',
  default: '',
  description: 'Filter disks by service ID',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['listDisks']
    }
  }
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 20,
  description: 'Maximum number of disks to return',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['listDisks']
    }
  }
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  default: '',
  description: 'Cursor for pagination',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['listDisks']
    }
  }
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  description: 'Name of the disk',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['createDisk']
    }
  }
},
{
  displayName: 'Size (GB)',
  name: 'sizeGB',
  type: 'number',
  required: true,
  default: 1,
  description: 'Size of the disk in GB',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['createDisk']
    }
  }
},
{
  displayName: 'Mount Path',
  name: 'mountPath',
  type: 'string',
  required: true,
  default: '',
  description: 'Path where the disk will be mounted',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['createDisk']
    }
  }
},
{
  displayName: 'Service ID',
  name: 'serviceId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the service to attach the disk to',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['createDisk']
    }
  }
},
{
  displayName: 'Disk ID',
  name: 'diskId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the disk to retrieve',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['getDisk']
    }
  }
},
{
  displayName: 'Disk ID',
  name: 'diskId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the disk to update',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['updateDisk']
    }
  }
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'New name for the disk',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['updateDisk']
    }
  }
},
{
  displayName: 'Size (GB)',
  name: 'sizeGB',
  type: 'number',
  default: 0,
  description: 'New size of the disk in GB',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['updateDisk']
    }
  }
},
{
  displayName: 'Disk ID',
  name: 'diskId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the disk to delete',
  displayOptions: {
    show: {
      resource: ['disk'],
      operation: ['deleteDisk']
    }
  }
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	default: '',
	description: 'Filter databases by name',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['listPostgresDatabases'],
		},
	},
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 20,
	description: 'Maximum number of databases to return',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['listPostgresDatabases'],
		},
	},
},
{
	displayName: 'Cursor',
	name: 'cursor',
	type: 'string',
	default: '',
	description: 'Cursor for pagination',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['listPostgresDatabases'],
		},
	},
},
{
	displayName: 'Database Name',
	name: 'name',
	type: 'string',
	required: true,
	default: '',
	description: 'Name of the PostgreSQL database',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase'],
		},
	},
},
{
	displayName: 'Database User',
	name: 'databaseUser',
	type: 'string',
	required: true,
	default: '',
	description: 'Database user name',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase'],
		},
	},
},
{
	displayName: 'Database Name (Internal)',
	name: 'databaseName',
	type: 'string',
	required: true,
	default: '',
	description: 'Internal database name',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase'],
		},
	},
},
{
	displayName: 'Plan',
	name: 'plan',
	type: 'options',
	required: true,
	default: 'starter',
	options: [
		{
			name: 'Starter',
			value: 'starter',
		},
		{
			name: 'Standard',
			value: 'standard',
		},
		{
			name: 'Pro',
			value: 'pro',
		},
	],
	description: 'Database plan',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase', 'updatePostgresDatabase'],
		},
	},
},
{
	displayName: 'Region',
	name: 'region',
	type: 'options',
	required: true,
	default: 'oregon',
	options: [
		{
			name: 'Oregon',
			value: 'oregon',
		},
		{
			name: 'Frankfurt',
			value: 'frankfurt',
		},
		{
			name: 'Singapore',
			value: 'singapore',
		},
		{
			name: 'Virginia',
			value: 'virginia',
		},
	],
	description: 'Database region',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase'],
		},
	},
},
{
	displayName: 'Version',
	name: 'version',
	type: 'options',
	required: true,
	default: '15',
	options: [
		{
			name: 'PostgreSQL 12',
			value: '12',
		},
		{
			name: 'PostgreSQL 13',
			value: '13',
		},
		{
			name: 'PostgreSQL 14',
			value: '14',
		},
		{
			name: 'PostgreSQL 15',
			value: '15',
		},
	],
	description: 'PostgreSQL version',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase'],
		},
	},
},
{
	displayName: 'IP Allow List',
	name: 'ipAllowList',
	type: 'collection',
	default: {},
	placeholder: 'Add IP Range',
	options: [
		{
			displayName: 'CIDR Block',
			name: 'cidrBlock',
			type: 'string',
			default: '',
			description: 'CIDR block for IP allowlist',
		},
		{
			displayName: 'Description',
			name: 'description',
			type: 'string',
			default: '',
			description: 'Description of the IP range',
		},
	],
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['createPostgresDatabase', 'updatePostgresDatabase'],
		},
	},
},
{
	displayName: 'Database ID',
	name: 'databaseId',
	type: 'string',
	required: true,
	default: '',
	description: 'ID of the PostgreSQL database',
	displayOptions: {
		show: {
			resource: ['postgreSQLDatabase'],
			operation: ['getPostgresDatabase', 'updatePostgresDatabase', 'deletePostgresDatabase', 'suspendPostgresDatabase', 'resumePostgresDatabase'],
		},
	},
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Filter Redis instances by name',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['listRedisInstances'],
    },
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 20,
  description: 'Maximum number of Redis instances to return',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['listRedisInstances'],
    },
  },
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  default: '',
  description: 'Pagination cursor for retrieving the next set of results',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['listRedisInstances'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  description: 'Name of the Redis instance',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['createRedisInstance'],
    },
  },
},
{
  displayName: 'Plan',
  name: 'plan',
  type: 'options',
  required: true,
  options: [
    { name: 'Starter', value: 'starter' },
    { name: 'Standard', value: 'standard' },
    { name: 'Pro', value: 'pro' },
    { name: 'Pro Plus', value: 'pro_plus' },
  ],
  default: 'starter',
  description: 'Redis instance plan',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['createRedisInstance'],
    },
  },
},
{
  displayName: 'Region',
  name: 'region',
  type: 'options',
  required: true,
  options: [
    { name: 'US East (Ohio)', value: 'ohio' },
    { name: 'US West (Oregon)', value: 'oregon' },
    { name: 'Europe (Frankfurt)', value: 'frankfurt' },
    { name: 'Asia Pacific (Singapore)', value: 'singapore' },
  ],
  default: 'ohio',
  description: 'Region where the Redis instance will be deployed',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['createRedisInstance'],
    },
  },
},
{
  displayName: 'Max Memory Policy',
  name: 'maxmemoryPolicy',
  type: 'options',
  options: [
    { name: 'No Eviction', value: 'noeviction' },
    { name: 'All Keys LRU', value: 'allkeys-lru' },
    { name: 'All Keys LFU', value: 'allkeys-lfu' },
    { name: 'All Keys Random', value: 'allkeys-random' },
    { name: 'Volatile LRU', value: 'volatile-lru' },
    { name: 'Volatile LFU', value: 'volatile-lfu' },
    { name: 'Volatile Random', value: 'volatile-random' },
    { name: 'Volatile TTL', value: 'volatile-ttl' },
  ],
  default: 'allkeys-lru',
  description: 'Redis max memory policy',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['createRedisInstance'],
    },
  },
},
{
  displayName: 'IP Allow List',
  name: 'ipAllowList',
  type: 'string',
  default: '',
  placeholder: '192.168.1.0/24,10.0.0.1',
  description: 'Comma-separated list of IP addresses or CIDR blocks allowed to connect',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['createRedisInstance'],
    },
  },
},
{
  displayName: 'Redis ID',
  name: 'redisId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the Redis instance',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['getRedisInstance', 'updateRedisInstance', 'deleteRedisInstance', 'suspendRedisInstance', 'resumeRedisInstance'],
    },
  },
},
{
  displayName: 'Plan',
  name: 'plan',
  type: 'options',
  options: [
    { name: 'Starter', value: 'starter' },
    { name: 'Standard', value: 'standard' },
    { name: 'Pro', value: 'pro' },
    { name: 'Pro Plus', value: 'pro_plus' },
  ],
  default: 'starter',
  description: 'Redis instance plan',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['updateRedisInstance'],
    },
  },
},
{
  displayName: 'Max Memory Policy',
  name: 'maxmemoryPolicy',
  type: 'options',
  options: [
    { name: 'No Eviction', value: 'noeviction' },
    { name: 'All Keys LRU', value: 'allkeys-lru' },
    { name: 'All Keys LFU', value: 'allkeys-lfu' },
    { name: 'All Keys Random', value: 'allkeys-random' },
    { name: 'Volatile LRU', value: 'volatile-lru' },
    { name: 'Volatile LFU', value: 'volatile-lfu' },
    { name: 'Volatile Random', value: 'volatile-random' },
    { name: 'Volatile TTL', value: 'volatile-ttl' },
  ],
  default: 'allkeys-lru',
  description: 'Redis max memory policy',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['updateRedisInstance'],
    },
  },
},
{
  displayName: 'IP Allow List',
  name: 'ipAllowList',
  type: 'string',
  default: '',
  placeholder: '192.168.1.0/24,10.0.0.1',
  description: 'Comma-separated list of IP addresses or CIDR blocks allowed to connect',
  displayOptions: {
    show: {
      resource: ['redisInstance'],
      operation: ['updateRedisInstance'],
    },
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 20,
  description: 'Maximum number of owners to return',
  displayOptions: {
    show: {
      resource: ['owner'],
      operation: ['listOwners'],
    },
  },
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  default: '',
  description: 'Cursor for pagination',
  displayOptions: {
    show: {
      resource: ['owner'],
      operation: ['listOwners'],
    },
  },
},
{
  displayName: 'Owner ID',
  name: 'ownerId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the owner/team',
  displayOptions: {
    show: {
      resource: ['owner'],
      operation: ['getOwner'],
    },
  },
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'service':
        return [await executeServiceOperations.call(this, items)];
      case 'deploy':
        return [await executeDeployOperations.call(this, items)];
      case 'environment':
        return [await executeEnvironmentOperations.call(this, items)];
      case 'customDomain':
        return [await executeCustomDomainOperations.call(this, items)];
      case 'disk':
        return [await executeDiskOperations.call(this, items)];
      case 'postgreSQLDatabase':
        return [await executePostgreSQLDatabaseOperations.call(this, items)];
      case 'redisInstance':
        return [await executeRedisInstanceOperations.call(this, items)];
      case 'owner':
        return [await executeOwnerOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeServiceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendercloudApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listServices': {
          const queryParams: any = {};
          const name = this.getNodeParameter('name', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const env = this.getNodeParameter('env', i) as string;
          const region = this.getNodeParameter('region', i) as string;
          const suspended = this.getNodeParameter('suspended', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          if (name) queryParams.name = name;
          if (type) queryParams.type = type;
          if (env) queryParams.env = env;
          if (region) queryParams.region = region;
          if (suspended) queryParams.suspended = suspended;
          if (limit) queryParams.limit = limit;
          if (cursor) queryParams.cursor = cursor;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `https://api.render.com/v1/services${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createService': {
          const serviceName = this.getNodeParameter('serviceName', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const ownerId = this.getNodeParameter('ownerId', i) as string;
          const repo = this.getNodeParameter('repo', i) as string;
          const autoDeploy = this.getNodeParameter('autoDeploy', i) as boolean;
          const branch = this.getNodeParameter('branch', i) as string;
          const buildCommand = this.getNodeParameter('buildCommand', i) as string;
          const startCommand = this.getNodeParameter('startCommand', i) as string;
          const envVarsCollection = this.getNodeParameter('envVars', i) as any;
          const serviceDetails = this.getNodeParameter('serviceDetails', i) as string;

          const envVars: any = {};
          if (envVarsCollection && envVarsCollection.envVar) {
            for (const envVar of envVarsCollection.envVar) {
              envVars[envVar.key] = envVar.value;
            }
          }

          let parsedServiceDetails: any = {};
          if (serviceDetails) {
            try {
              parsedServiceDetails = JSON.parse(serviceDetails);
            } catch (error: any) {
              throw new Error(`Invalid JSON in service details: ${error.message}`);
            }
          }

          const body: any = {
            name: serviceName,
            type,
            ownerId,
            repo,
            autoDeploy,
            branch,
            buildCommand,
            startCommand,
            envVars,
            ...parsedServiceDetails,
          };

          const options: any = {
            method: 'POST',
            url: 'https://api.render.com/v1/services',
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getService': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://api.render.com/v1/services/${serviceId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateService': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;
          const serviceName = this.getNodeParameter('serviceName', i) as string;
          const branch = this.getNodeParameter('branch', i) as string;
          const buildCommand = this.getNodeParameter('buildCommand', i) as string;
          const startCommand = this.getNodeParameter('startCommand', i) as string;
          const envVarsCollection = this.getNodeParameter('envVars', i) as any;
          const serviceDetails = this.getNodeParameter('serviceDetails', i) as string;

          const envVars: any = {};
          if (envVarsCollection && envVarsCollection.envVar) {
            for (const envVar of envVarsCollection.envVar) {
              envVars[envVar.key] = envVar.value;
            }
          }

          let parsedServiceDetails: any = {};
          if (serviceDetails) {
            try {
              parsedServiceDetails = JSON.parse(serviceDetails);
            } catch (error: any) {
              throw new Error(`Invalid JSON in service details: ${error.message}`);
            }
          }

          const body: any = {
            name: serviceName,
            branch,
            buildCommand,
            startCommand,
            envVars,
            ...parsedServiceDetails,
          };

          const options: any = {
            method: 'PATCH',
            url: `https://api.render.com/v1/services/${serviceId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteService': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `https://api.render.com/v1/services/${serviceId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'suspendService': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.render.com/v1/services/${serviceId}/suspend`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'resumeService': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.render.com/v1/services/${serviceId}/resume`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'restartService': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.render.com/v1/services/${serviceId}/restart`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeDeployOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rendercloudApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'listDeploys': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					let endpoint = `/services/${serviceId}/deploys?limit=${limit}`;
					if (cursor) {
						endpoint += `&cursor=${encodeURIComponent(cursor)}`;
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}${endpoint}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createDeploy': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const clearCache = this.getNodeParameter('clearCache', i) as boolean;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/services/${serviceId}/deploys`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							clearCache,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDeploy': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const deployId = this.getNodeParameter('deployId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/services/${serviceId}/deploys/${deployId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'cancelDeploy': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const deployId = this.getNodeParameter('deployId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/services/${serviceId}/deploys/${deployId}/cancel`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEnvironmentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendercloudApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listEnvVars': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/services/${serviceId}/env-vars`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateEnvVars': {
          const serviceId = this.getNodeParameter('serviceId', i) as string;
          const envVarsData = this.getNodeParameter('envVars', i) as any;
          
          const envVars: any = {};
          if (envVarsData.envVar) {
            for (const envVar of envVarsData.envVar) {
              envVars[envVar.key] = envVar.value;
            }
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/services/${serviceId}/env-vars`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: envVars,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCustomDomainOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rendercloudApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'listCustomDomains': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/services/${serviceId}/custom-domains`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'createCustomDomain': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/services/${serviceId}/custom-domains`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							name,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getCustomDomain': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const domainId = this.getNodeParameter('domainId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/services/${serviceId}/custom-domains/${domainId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'deleteCustomDomain': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const domainId = this.getNodeParameter('domainId', i) as string;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/services/${serviceId}/custom-domains/${domainId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'verifyCustomDomain': {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const domainId = this.getNodeParameter('domainId', i) as string;
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/services/${serviceId}/custom-domains/${domainId}/verify`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeDiskOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendercloudApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listDisks': {
          const queryParams: any = {};
          const name = this.getNodeParameter('name', i) as string;
          const serviceId = this.getNodeParameter('serviceId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          if (name) queryParams.name = name;
          if (serviceId) queryParams.serviceId = serviceId;
          if (limit) queryParams.limit = limit;
          if (cursor) queryParams.cursor = cursor;

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + '/disks',
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json'
            },
            qs: queryParams,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createDisk': {
          const name = this.getNodeParameter('name', i) as string;
          const sizeGB = this.getNodeParameter('sizeGB', i) as number;
          const mountPath = this.getNodeParameter('mountPath', i) as string;
          const serviceId = this.getNodeParameter('serviceId', i) as string;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/disks',
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json'
            },
            body: {
              name,
              sizeGB,
              mountPath,
              serviceId
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDisk': {
          const diskId = this.getNodeParameter('diskId', i) as string;

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + '/disks/' + diskId,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDisk': {
          const diskId = this.getNodeParameter('diskId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const sizeGB = this.getNodeParameter('sizeGB', i) as number;

          const body: any = {};
          if (name) body.name = name;
          if (sizeGB) body.sizeGB = sizeGB;

          const options: any = {
            method: 'PATCH',
            url: credentials.baseUrl + '/disks/' + diskId,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteDisk': {
          const diskId = this.getNodeParameter('diskId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: credentials.baseUrl + '/disks/' + diskId,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePostgreSQLDatabaseOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rendercloudApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'listPostgresDatabases': {
					const name = this.getNodeParameter('name', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const qs: any = {};
					if (name) qs.name = name;
					if (limit) qs.limit = limit;
					if (cursor) qs.cursor = cursor;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/postgres`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createPostgresDatabase': {
					const name = this.getNodeParameter('name', i) as string;
					const databaseUser = this.getNodeParameter('databaseUser', i) as string;
					const databaseName = this.getNodeParameter('databaseName', i) as string;
					const plan = this.getNodeParameter('plan', i) as string;
					const region = this.getNodeParameter('region', i) as string;
					const version = this.getNodeParameter('version', i) as string;
					const ipAllowList = this.getNodeParameter('ipAllowList', i) as any;

					const body: any = {
						name,
						databaseUser,
						databaseName,
						plan,
						region,
						version,
					};

					if (ipAllowList && ipAllowList.cidrBlock) {
						body.ipAllowList = [ipAllowList];
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/postgres`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPostgresDatabase': {
					const databaseId = this.getNodeParameter('databaseId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/postgres/${databaseId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updatePostgresDatabase': {
					const databaseId = this.getNodeParameter('databaseId', i) as string;
					const plan = this.getNodeParameter('plan', i) as string;
					const ipAllowList = this.getNodeParameter('ipAllowList', i) as any;

					const body: any = {};
					if (plan) body.plan = plan;
					if (ipAllowList && ipAllowList.cidrBlock) {
						body.ipAllowList = [ipAllowList];
					}

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/postgres/${databaseId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deletePostgresDatabase': {
					const databaseId = this.getNodeParameter('databaseId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/postgres/${databaseId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'suspendPostgresDatabase': {
					const databaseId = this.getNodeParameter('databaseId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/postgres/${databaseId}/suspend`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'resumePostgresDatabase': {
					const databaseId = this.getNodeParameter('databaseId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/postgres/${databaseId}/resume`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeRedisInstanceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendercloudApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listRedisInstances': {
          const queryParams: string[] = [];
          
          const name = this.getNodeParameter('name', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const cursor = this.getNodeParameter('cursor', i, '') as string;

          if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
          if (limit) queryParams.push(`limit=${limit}`);
          if (cursor) queryParams.push(`cursor=${encodeURIComponent(cursor)}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/redis${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createRedisInstance': {
          const name = this.getNodeParameter('name', i) as string;
          const plan = this.getNodeParameter('plan', i) as string;
          const region = this.getNodeParameter('region', i) as string;
          const maxmemoryPolicy = this.getNodeParameter('maxmemoryPolicy', i, 'allkeys-lru') as string;
          const ipAllowList = this.getNodeParameter('ipAllowList', i, '') as string;

          const body: any = {
            name,
            plan,
            region,
            maxmemoryPolicy,
          };

          if (ipAllowList) {
            body.ipAllowList = ipAllowList.split(',').map((ip: string) => ip.trim());
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/redis`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRedisInstance': {
          const redisId = this.getNodeParameter('redisId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/redis/${redisId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateRedisInstance': {
          const redisId = this.getNodeParameter('redisId', i) as string;
          const plan = this.getNodeParameter('plan', i, '') as string;
          const maxmemoryPolicy = this.getNodeParameter('maxmemoryPolicy', i, '') as string;
          const ipAllowList = this.getNodeParameter('ipAllowList', i, '') as string;

          const body: any = {};

          if (plan) body.plan = plan;
          if (maxmemoryPolicy) body.maxmemoryPolicy = maxmemoryPolicy;
          if (ipAllowList) {
            body.ipAllowList = ipAllowList.split(',').map((ip: string) => ip.trim());
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/redis/${redisId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteRedisInstance': {
          const redisId = this.getNodeParameter('redisId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/redis/${redisId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'suspendRedisInstance': {
          const redisId = this.getNodeParameter('redisId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/redis/${redisId}/suspend`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'resumeRedisInstance': {
          const redisId = this.getNodeParameter('redisId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/redis/${redisId}/resume`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOwnerOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendercloudApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listOwners': {
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          const params = new URLSearchParams();
          if (limit) params.append('limit', limit.toString());
          if (cursor) params.append('cursor', cursor);

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/owners${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOwner': {
          const ownerId = this.getNodeParameter('ownerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/owners/${ownerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
