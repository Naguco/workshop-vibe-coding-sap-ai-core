# Technology Stack

## Core Platform

### SAP Cloud Application Programming Model (CAP)
- **Version**: 9.x (latest)
- **Purpose**: Primary development framework
- **Benefits**: 
  - Built-in OData services
  - Database abstraction layer
  - Draft support for Fiori
  - External service integration
- **Key Files**: `srv/service.cds`, `srv/service.js`, `db/model.cds`

### Node.js Runtime
- **Role**: Backend service runtime
- **Integration**: CAP Node.js runtime for service implementation
- **Features**: 
  - Event-driven handlers
  - Async/await support
  - Rich ecosystem integration

## Database Layer

### SQLite (Development)
- **Package**: `@cap-js/sqlite`
- **Role**: Local development database
- **Benefits**: Zero-configuration, file-based, fast startup
- **Usage**: Automatic schema generation from CDS models

### Production Database Options
- **SAP HANA**: Primary production target
- **PostgreSQL**: Alternative production option
- **Migration Path**: CDS compiler handles database-specific SQL generation

## Frontend Technology

### SAP UI5 / Fiori
- **Framework**: UI5 with Fiori Elements
- **Location**: `app/project1/webapp/`
- **Features**:
  - Responsive design
  - Draft capabilities
  - OData binding
  - Fiori design guidelines

### UI5 Tooling
- **Package**: `cds-plugin-ui5`
- **Purpose**: Integration between CAP and UI5 development
- **Features**: Live reload, integrated development server

## External Integrations

### SuccessFactors APIs

#### PLTUserManagement
- **Type**: OData v2 service
- **Purpose**: User directory and profile information
- **Configuration**: `package.json` > `cds.requires.PLTUserManagement`
- **Model**: `srv/external/PLTUserManagement.csn`

#### ECEmployeeProfile
- **Type**: OData v2 service  
- **Purpose**: Employee assignment management
- **Configuration**: `package.json` > `cds.requires.ECEmployeeProfile`
- **Model**: `srv/external/ECEmployeeProfile.edmx`

### SAP Cloud SDK
- **Packages**: 
  - `@sap-cloud-sdk/connectivity`
  - `@sap-cloud-sdk/http-client`
  - `@sap-cloud-sdk/resilience`
- **Purpose**: Enterprise-grade HTTP client with resilience patterns
- **Features**: Circuit breaker, retry logic, authentication handling

## Development Tools

### Build and Package Management
- **Package Manager**: npm
- **Workspaces**: Multi-package project structure (`app/*`)
- **Scripts**: 
  - `start`: Production server start
  - `watch-project1`: Development mode with live reload

### Code Quality
- **Linting**: ESLint with modern configuration (`eslint.config.mjs`)
- **Standards**: Modern JavaScript ES6+ features

### Version Control
- **Git**: Source code management
- **Gitignore**: Configured for CAP projects (node_modules, build artifacts)

## Runtime Environment

### Express.js
- **Purpose**: HTTP server framework
- **Integration**: CAP uses Express for HTTP handling
- **Features**: Middleware support, routing, static file serving

### Transaction Management
- **Implementation**: CAP built-in transaction handling
- **Pattern**: Request-scoped transactions (`cds.tx(req)`)
- **Isolation**: ACID compliance for business operations

## Deployment Architecture

### Development Environment
- **Runtime**: Local Node.js with SQLite
- **Services**: Mock external services for testing
- **Hot Reload**: File watching with automatic restart

### Cloud Deployment Options
- **SAP BTP**: Primary cloud platform target
- **Cloud Foundry**: Container-based deployment
- **Kubernetes**: Container orchestration (alternative)

### Service Bindings
- **SuccessFactors**: Destination service for connectivity
- **Authentication**: XSUAA service for user management
- **Monitoring**: Application logging and metrics

## Performance Considerations

### Caching Strategy
- **Local Cache**: Employee data cached in CAP database
- **TTL Strategy**: Refresh on-demand or periodic sync
- **Invalidation**: Manual cleanup of orphaned records

### Query Optimization
- **Selective Loading**: Explicit column selection in queries
- **Pagination**: Built-in OData pagination support
- **Lazy Loading**: Association data loaded on-demand

### Scalability Patterns
- **Stateless Services**: No server-side session state
- **Horizontal Scaling**: Multiple service instances
- **Connection Pooling**: Database connection management

## Security Framework

### Authentication
- **Development**: Mock authentication for testing
- **Production**: XSUAA integration with SAP Identity Service
- **Token Handling**: JWT token validation and propagation

### Authorization
- **Model Level**: CDS annotations for access control (to be implemented)
- **Service Level**: Handler-based permission checks
- **Integration**: SuccessFactors user context for permissions

### Data Protection
- **Encryption**: HTTPS for data in transit
- **Audit**: Request logging and monitoring
- **Privacy**: GDPR compliance patterns (to be implemented)

## Testing Infrastructure

### Unit Testing
- **Framework**: Jest (planned)
- **Scope**: Handler functions and business logic
- **Mocking**: External service mocking

### Integration Testing
- **Framework**: CAP test utilities
- **Scope**: Service endpoints and data flows
- **Database**: In-memory SQLite for tests

### End-to-End Testing
- **Framework**: Playwright or similar (planned)
- **Scope**: Complete user journeys
- **Environment**: Staging environment with mock services

## Monitoring and Observability

### Logging
- **Framework**: CAP built-in logging
- **Levels**: Error, warn, info, debug
- **Correlation**: Request correlation IDs

### Metrics
- **Performance**: Response times and throughput
- **Business**: Entity creation and modification rates
- **Integration**: External service call success rates

### Health Checks
- **Service**: Built-in CAP health endpoints
- **External**: SuccessFactors connectivity checks
- **Database**: Connection and query validation
