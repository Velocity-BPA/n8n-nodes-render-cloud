# n8n-nodes-render-cloud

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Render Cloud providing 12 resources and 80+ operations for service deployment, database management, and infrastructure automation. Enables workflow automation for web services, static sites, background workers, cron jobs, PostgreSQL databases, and Redis instances through Render's REST API.

![n8n version](https://img.shields.io/badge/n8n-1.30.0+-blue)
![Node.js version](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **12 Resource Categories**: Services, Deploys, Custom Domains, Environment Variables, Secret Files, Projects, Environments, Postgres, Key Value (Redis), Disks, Environment Groups, and Webhooks
- **80+ Operations**: Full CRUD operations plus specialized actions for each resource type
- **Webhook Triggers**: Real-time event notifications with signature verification
- **Cursor-Based Pagination**: Efficient handling of large datasets
- **Rate Limit Handling**: Built-in rate limit detection and exponential backoff
- **Database Management**: PostgreSQL operations including PITR recovery, exports, and user management
- **Infrastructure Automation**: Service scaling, autoscaling configuration, and deployment management

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-render-cloud`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-render-cloud
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-render-cloud.git
cd n8n-nodes-render-cloud

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-render-cloud

# Restart n8n
n8n start
```

## Credentials Setup

### Render Cloud API

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| API Key | String | Yes | API key from Render Dashboard Account Settings |

**How to get your API key:**

1. Log into [Render Dashboard](https://dashboard.render.com)
2. Navigate to **Account Settings**
3. Under **API Keys** section, click **Create API Key**
4. Provide a descriptive name for the key
5. Copy and securely store the API key (only shown once)

## Resources & Operations

### Service
Manage web services, static sites, background workers, private services, and cron jobs.

| Operation | Description |
|-----------|-------------|
| List | List all services with optional filtering |
| Create | Create a new service |
| Get | Retrieve a service by ID |
| Update | Update service configuration |
| Delete | Delete a service |
| Suspend | Suspend a running service |
| Resume | Resume a suspended service |
| Restart | Restart a service |
| Scale | Scale instance count |
| Update Autoscaling | Configure autoscaling settings |
| Delete Autoscaling | Remove autoscaling configuration |
| Purge Cache | Purge cache for a web service |

### Deploy
Trigger and manage service deployments.

| Operation | Description |
|-----------|-------------|
| List | List deploys for a service |
| Trigger | Trigger a new deploy |
| Get | Retrieve deploy details |
| Cancel | Cancel an in-progress deploy |
| Rollback | Roll back to a previous deploy |

### Custom Domain
Manage custom domains for services.

| Operation | Description |
|-----------|-------------|
| List | List custom domains for a service |
| Add | Add a custom domain |
| Get | Retrieve custom domain details |
| Delete | Remove a custom domain |
| Verify DNS | Verify DNS configuration |

### Environment Variable
Manage environment variables for services.

| Operation | Description |
|-----------|-------------|
| List | List environment variables |
| Get | Retrieve a specific variable |
| Add or Update | Add or update a variable |
| Delete | Delete a variable |
| Update All | Replace all variables |

### Secret File
Manage secret files for services.

| Operation | Description |
|-----------|-------------|
| List | List secret files |
| Get | Retrieve a specific secret file |
| Add or Update | Add or update a secret file |
| Delete | Delete a secret file |
| Update All | Replace all secret files |

### Project
Manage Render projects for organizing resources.

| Operation | Description |
|-----------|-------------|
| List | List all projects |
| Create | Create a new project |
| Get | Retrieve project details |
| Update | Update project configuration |
| Delete | Delete a project |

### Environment
Manage environments within projects.

| Operation | Description |
|-----------|-------------|
| List | List environments in a project |
| Create | Create a new environment |
| Get | Retrieve environment details |
| Update | Update environment configuration |
| Delete | Delete an environment |
| Add Resources | Add services/databases to environment |
| Remove Resources | Remove resources from environment |

### Postgres
Manage PostgreSQL database instances.

| Operation | Description |
|-----------|-------------|
| List | List PostgreSQL instances |
| Create | Create a new instance |
| Get | Retrieve instance details |
| Update | Update configuration |
| Delete | Delete an instance |
| Get Connection Info | Get connection credentials |
| Suspend | Suspend an instance |
| Resume | Resume a suspended instance |
| Restart | Restart an instance |
| Failover | Trigger manual failover (HA) |
| Get Recovery Status | Get PITR recovery status |
| Trigger Recovery | Restore from a point in time |
| List Exports | List database exports |
| Create Export | Create a database export |
| List Users | List PostgreSQL users |
| Create User | Create a user |
| Delete User | Delete a user |

### Key Value (Redis)
Manage Redis/Key Value instances.

| Operation | Description |
|-----------|-------------|
| List | List Key Value instances |
| Create | Create a new instance |
| Get | Retrieve instance details |
| Update | Update configuration |
| Delete | Delete an instance |
| Get Connection Info | Get connection credentials |
| Suspend | Suspend an instance |
| Resume | Resume a suspended instance |

### Disk
Manage persistent disks and snapshots.

| Operation | Description |
|-----------|-------------|
| List | List disks for a service |
| Add | Add a disk to a service |
| Get | Retrieve disk details |
| Update | Update disk configuration |
| Delete | Delete a disk |
| List Snapshots | List disk snapshots |
| Restore Snapshot | Restore from a snapshot |

### Environment Group
Manage shared environment variables and secrets across services.

| Operation | Description |
|-----------|-------------|
| List | List environment groups |
| Create | Create a new environment group |
| Get | Retrieve environment group details |
| Update | Update environment group |
| Delete | Delete an environment group |
| Link Service | Link a service to the group |
| Unlink Service | Unlink a service from the group |
| Get Env Var | Get a specific environment variable |
| Update Env Var | Add or update an environment variable |
| Delete Env Var | Remove an environment variable |
| Get Secret File | Get a specific secret file |
| Update Secret File | Add or update a secret file |
| Delete Secret File | Remove a secret file |

### Webhook
Manage webhooks for event notifications.

| Operation | Description |
|-----------|-------------|
| List | List webhooks for a workspace |
| Create | Create a new webhook |
| Get | Retrieve webhook details |
| Update | Update webhook configuration |
| Delete | Delete a webhook |
| List Events | List events delivered to a webhook |

## Trigger Node

### Render Cloud Trigger

Starts the workflow when Render Cloud events occur.

**Supported Events:**
- `deploy_started` - Deploy has started
- `deploy_succeeded` - Deploy completed successfully
- `deploy_failed` - Deploy failed
- `deploy_canceled` - Deploy was canceled
- `service_created` - New service created
- `service_deleted` - Service deleted
- `service_suspended` - Service suspended
- `service_resumed` - Service resumed
- `server_failed` - Server failure detected
- `server_available` - Server recovered
- `certificate_renewed` - TLS certificate renewed
- `maintenance_started` - Maintenance started
- `maintenance_completed` - Maintenance completed

**Features:**
- Automatic webhook creation and cleanup
- Webhook signature verification for security
- Filter events by specific service IDs

## Usage Examples

### List All Services

```javascript
// Configure the Render Cloud node
// Resource: Service
// Operation: List
// Returns all services in your workspace
```

### Trigger a Deploy

```javascript
// Resource: Deploy
// Operation: Trigger
// Service ID: srv-abc123
// Clear Cache: true
```

### Create a PostgreSQL Database

```javascript
// Resource: Postgres
// Operation: Create
// Owner ID: usr-xxxxx
// Name: my-database
// Region: oregon
// Plan: starter
// PostgreSQL Version: 16
```

### Scale a Service

```javascript
// Resource: Service
// Operation: Scale
// Service ID: srv-abc123
// Number of Instances: 3
```

## Render Concepts

### Service Types
- **Web Service**: Long-running web applications
- **Static Site**: Static HTML/CSS/JS hosting
- **Background Worker**: Long-running background processes
- **Private Service**: Internal services not exposed to internet
- **Cron Job**: Scheduled tasks

### Regions
| Region | Location |
|--------|----------|
| oregon | US West (Oregon) |
| ohio | US East (Ohio) |
| virginia | US East (Virginia) |
| frankfurt | Europe (Frankfurt) |
| singapore | Asia Pacific (Singapore) |

### Plans
- **free**: Free tier with limitations
- **starter**: Entry-level paid tier
- **standard**: Standard production tier
- **pro**: Professional tier
- **pro_plus**: Enhanced professional tier
- **pro_max**: Maximum performance tier
- **pro_ultra**: Ultimate performance tier

## Error Handling

The node handles common Render API errors:

| Error Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource state conflict |
| 422 | Unprocessable - Validation errors |
| 429 | Rate Limited - Too many requests |
| 500 | Server Error - Render API issue |

Rate limiting is handled automatically with exponential backoff.

## Security Best Practices

1. **Store API keys securely**: Use n8n credentials, never hardcode
2. **Use webhook signatures**: Enable signature verification for triggers
3. **Limit API key scope**: Create keys with minimal required permissions
4. **Rotate keys regularly**: Periodically regenerate API keys
5. **Use environment groups**: Share secrets securely across services

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-render-cloud/issues)
- **Documentation**: [Render API Docs](https://api-docs.render.com/)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Render](https://render.com) for providing an excellent cloud platform and API
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for inspiration and support
