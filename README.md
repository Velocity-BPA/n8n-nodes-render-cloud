# n8n-nodes-render-cloud

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Render Cloud, enabling automated management of web services, databases, and infrastructure. With 8 resources and 50+ operations, you can deploy applications, manage environments, configure domains, and orchestrate database operations directly within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Render](https://img.shields.io/badge/Render-Cloud-purple)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-blue)

## Features

- **Complete Service Management** - Create, update, deploy, and monitor web services, background workers, and static sites
- **Database Operations** - Full PostgreSQL and Redis instance lifecycle management with backup and restore capabilities
- **Environment Control** - Manage environment variables, custom domains, and SSL certificates across all services
- **Disk Management** - Create, attach, and manage persistent storage volumes for stateful applications
- **Deployment Automation** - Trigger deployments, monitor build status, and manage rollbacks programmatically
- **Owner & Team Management** - Handle team permissions, service ownership, and access control
- **Real-time Monitoring** - Access service logs, metrics, and health status for comprehensive observability
- **Infrastructure as Code** - Automate entire Render infrastructure provisioning and configuration workflows

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-render-cloud`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-render-cloud
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-render-cloud.git
cd n8n-nodes-render-cloud
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-render-cloud
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Render API key from Dashboard → Account Settings → API Keys | ✅ |
| Base URL | Render API base URL (defaults to https://api.render.com/v1) | ❌ |

## Resources & Operations

### 1. Service

| Operation | Description |
|-----------|-------------|
| Create | Create a new web service, background worker, or static site |
| Get | Retrieve service details and configuration |
| List | List all services with optional filtering |
| Update | Update service configuration and settings |
| Delete | Delete a service and all associated resources |
| Suspend | Temporarily suspend service operations |
| Resume | Resume a suspended service |
| Scale | Adjust service scaling and resource allocation |

### 2. Deploy

| Operation | Description |
|-----------|-------------|
| Create | Trigger a new deployment for a service |
| Get | Get deployment details and status |
| List | List all deployments for a service |
| Cancel | Cancel an in-progress deployment |
| Rollback | Rollback to a previous deployment |
| Get Logs | Retrieve deployment build and runtime logs |

### 3. Environment

| Operation | Description |
|-----------|-------------|
| Get | Retrieve environment variables for a service |
| Update | Update environment variables |
| Create Variable | Add a new environment variable |
| Delete Variable | Remove an environment variable |
| List Secrets | List all secret environment variables |
| Bulk Update | Update multiple environment variables at once |

### 4. Custom Domain

| Operation | Description |
|-----------|-------------|
| Create | Add a custom domain to a service |
| Get | Get custom domain configuration and status |
| List | List all custom domains for a service |
| Update | Update domain settings and SSL configuration |
| Delete | Remove a custom domain |
| Verify | Verify domain ownership and DNS configuration |

### 5. Disk

| Operation | Description |
|-----------|-------------|
| Create | Create a new persistent disk |
| Get | Get disk details and usage information |
| List | List all disks |
| Update | Update disk configuration |
| Delete | Delete a disk and all data |
| Attach | Attach disk to a service |
| Detach | Detach disk from a service |

### 6. PostgreSQL Database

| Operation | Description |
|-----------|-------------|
| Create | Create a new PostgreSQL database instance |
| Get | Get database details and connection information |
| List | List all PostgreSQL databases |
| Update | Update database configuration |
| Delete | Delete database instance |
| Get Connection | Get database connection string and credentials |
| Create Backup | Create a manual database backup |
| List Backups | List all available backups |
| Restore | Restore database from backup |

### 7. Redis Instance

| Operation | Description |
|-----------|-------------|
| Create | Create a new Redis instance |
| Get | Get Redis instance details |
| List | List all Redis instances |
| Update | Update Redis configuration |
| Delete | Delete Redis instance |
| Get Connection | Get Redis connection information |
| Flush | Flush Redis database |

### 8. Owner

| Operation | Description |
|-----------|-------------|
| Get | Get owner/team information |
| List | List team members and permissions |
| Update | Update team settings |
| Invite | Invite new team members |
| Remove | Remove team members |
| Transfer | Transfer service ownership |

## Usage Examples

```javascript
// Deploy a new web service
{
  "name": "my-api-service",
  "type": "web_service",
  "repo": "https://github.com/myorg/api-service.git",
  "branch": "main",
  "buildCommand": "npm run build",
  "startCommand": "npm start",
  "envVars": {
    "NODE_ENV": "production",
    "PORT": "10000"
  }
}
```

```javascript
// Create PostgreSQL database with backup schedule
{
  "name": "production-db",
  "plan": "standard",
  "region": "oregon",
  "version": "15",
  "backup_schedule": "daily"
}
```

```javascript
// Configure custom domain with SSL
{
  "domain": "api.mycompany.com",
  "service_id": "srv-abc123",
  "ssl_enabled": true,
  "redirect_for_name": true
}
```

```javascript
// Update environment variables for service
{
  "service_id": "srv-abc123",
  "env_vars": {
    "DATABASE_URL": "postgresql://user:pass@host:5432/db",
    "REDIS_URL": "redis://host:6379",
    "API_KEY": "secret-key-value"
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or missing API key | Verify API key in credentials configuration |
| 403 Forbidden | Insufficient permissions | Check team permissions and service ownership |
| 404 Not Found | Service or resource doesn't exist | Verify resource ID and check if resource was deleted |
| 422 Validation Error | Invalid request parameters | Review API documentation and fix parameter values |
| 429 Rate Limited | Too many requests | Implement retry logic with exponential backoff |
| 500 Internal Error | Render API server error | Check Render status page and retry request |

## Development

```bash
npm install
npm run build
npm test
npm run lint
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
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-render-cloud/issues)
- **Render API Docs**: [Render API Documentation](https://api-docs.render.com/)
- **Render Community**: [Render Community Forum](https://community.render.com/)