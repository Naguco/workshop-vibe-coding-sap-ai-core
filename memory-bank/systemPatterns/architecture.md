# System Architecture Patterns

## Overall Architecture

### Layered Architecture Pattern
The application follows a clean layered architecture:

```
┌─────────────────────────────────────┐
│           UI Layer (Fiori)          │
│        app/project1/webapp/         │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Service Layer (CAP)         │
│      srv/service.cds + srv/         │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│        Data Layer (CDS)             │
│           db/model.cds              │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│      External Systems (SFSF)        │
│    PLTUserManagement + ECEmployee   │
└─────────────────────────────────────┘
```

## Service Layer Patterns

### Handler-Based Event Processing
- **Pattern**: Event-driven service handlers
- **Implementation**: `srv/service.js` delegates to `srv/lib/handlers.js`
- **Events**: `before`, `after`, `on` handlers for CRUD operations
- **Benefits**: Separation of concerns, testable business logic

### External Service Integration Pattern
- **Pattern**: Service-to-Service communication
- **Implementation**: CAP's `cds.connect.to()` for external services
- **Services**:
  - `PLTUserManagement`: User data retrieval
  - `ECEmployeeProfile`: Assignment creation
- **Error Handling**: Graceful degradation with try-catch blocks

## Data Patterns

### Entity Relationship Patterns

#### Composition Pattern (1:N with Cascade)
```cds
entity Project : cuid {
    team: Composition of many Member on team.parent = $self;
    activities: Composition of many Activity on activities.parent = $self;
}
```
- **Use Case**: Parent-child relationships with cascade delete
- **Behavior**: Deleting Project automatically deletes Members and Activities

#### Association Pattern (N:1 Reference)
```cds
entity Member : cuid {
    member: Association to one Employee;
    role: Association to one Role;
}
```
- **Use Case**: Reference relationships without ownership
- **Behavior**: Referential integrity without cascade delete

#### Code List Pattern (@readonly entities)
```cds
@readonly
@cds.autoexpose
entity Role : sap.common.CodeList {
    key ID : Integer;
}
```
- **Use Case**: Static reference data
- **Behavior**: Read-only, auto-exposed for value help

## Integration Patterns

### Synchronization Pattern
- **Challenge**: Keep CAP and SuccessFactors data consistent
- **Solution**: Event-driven synchronization on CRUD operations
- **Pattern**: Dual-write with compensation logic

### Cache-Aside Pattern
```javascript
async function executeCreateEmployee(req, userId) {
    const employee = await cds.tx(req).run(SELECT.one.from('Employee').where({userId}));
    if (!employee) {
        const sfsfUser = await userService.tx(req).run(SELECT.one.from('User').where({userId}));
        if (sfsfUser) {
            await cds.tx(req).run(INSERT.into('Employee').entries(sfsfUser));
        }
    }
}
```
- **Use Case**: Employee data caching from SuccessFactors
- **Pattern**: Check local cache first, fetch from source if needed

### Transaction Management Pattern
- **Implementation**: `cds.tx(req)` for transaction boundaries
- **Scope**: Each request gets isolated transaction context
- **Rollback**: Automatic rollback on errors

## Draft Pattern for Fiori

### Draft-Enabled Entities
```cds
@odata.draft.enabled
entity Project as projection on model.Project;
```
- **Feature**: Allows users to save work-in-progress
- **Implementation**: CAP automatically handles draft tables
- **Handlers**: Special `beforeSave` and `afterSave` handlers

### Draft State Management
- **Active vs Draft**: Separate storage for published vs draft records
- **Merge Logic**: Complex logic in `beforeSaveProject` and `afterSaveProject`
- **Validation**: Business rules applied during activation

## Error Handling Patterns

### Service-Level Error Handling
```javascript
try {
    // Business logic
    return result;
} catch (err) {
    req.error(err.code, err.message);
}
```
- **Pattern**: Consistent error response format
- **Propagation**: Errors bubble up through service layers
- **User Experience**: Meaningful error messages in UI

### External Service Resilience
- **Pattern**: Circuit breaker with fallback
- **Implementation**: Try-catch around external service calls
- **Fallback**: Graceful degradation when SFSF is unavailable

## Performance Patterns

### Query Optimization
```javascript
// Remove non-sortable columns from ORDER BY
req.query = removeColumnsFromOrderBy(req.query, ['defaultFullName']);
```
- **Pattern**: Query transformation for external services
- **Use Case**: Adapting CAP queries for SuccessFactors limitations

### Lazy Loading
- **Implementation**: Associations loaded on-demand
- **Benefits**: Reduced initial payload size
- **Trade-off**: Additional requests for related data

## Security Patterns

### Service-Level Authorization
- **Pattern**: Entity-level and operation-level restrictions
- **Implementation**: CAP authorization annotations (to be added)
- **Integration**: SuccessFactors user context for permissions

### Data Isolation
- **Pattern**: Tenant-aware data access (future consideration)
- **Current**: Single-tenant implementation
- **Expansion**: Multi-tenant capability through CAP features
