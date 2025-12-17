# Data Model Patterns

## Entity Design Patterns

### Core Domain Entities

#### Project Entity (Aggregate Root)
```cds
entity Project : cuid {
    name        : String(128);
    description : String(1024);
    startDate   : Date;
    endDate     : Date;
    status      : Association to one Status;
    team        : Composition of many Member on team.parent = $self;
    activities  : Composition of many Activity on activities.parent = $self;
}
```

**Design Patterns Applied:**
- **CUID Pattern**: Inherits from `cuid` for UUID-based keys
- **Aggregate Root Pattern**: Project owns and manages Member and Activity lifecycles
- **Composition Pattern**: Uses `Composition of many` for owned child entities
- **Association Pattern**: Uses `Association to one` for reference data

#### Member Entity (Child Aggregate)
```cds
entity Member : cuid {
    parent        : Association to one Project;
    member        : Association to one Employee;
    role          : Association to one Role;
    hasAssignment : Boolean default false;
}
```

**Design Patterns Applied:**
- **Child Entity Pattern**: Belongs to Project aggregate
- **Reference Pattern**: Points to Employee and Role entities
- **State Tracking Pattern**: `hasAssignment` tracks SFSF synchronization state
- **Default Value Pattern**: Boolean fields have sensible defaults

#### Activity Entity (Child Aggregate)
```cds
entity Activity : cuid {
    parent      : Association to one Project;
    assignedTo  : Association to one Member;
    name        : String(128);
    description : String(1024);
    dueDate     : Date;
    status      : Association to one Status;
}
```

**Design Patterns Applied:**
- **Child Entity Pattern**: Belongs to Project aggregate
- **Cross-Reference Pattern**: References Member within same aggregate
- **Temporal Pattern**: Includes date-based fields for scheduling

## Reference Data Patterns

### Code List Pattern
```cds
@readonly
@cds.autoexpose
entity Role : sap.common.CodeList {
    key ID : Integer;
}

@readonly
@cds.autoexpose
entity Status : sap.common.CodeList {
    key ID          : Integer;
        criticality : Integer;
}
```

**Benefits:**
- Standardized structure across code lists
- Auto-exposure for OData value lists
- Read-only enforcement prevents accidental modification
- Integer keys for performance
- Additional fields like `criticality` for UI semantics

### External Entity Pattern
```cds
@readonly
@cds.autoexpose
entity Employee {
    key userId          : String(100);
        username        : String(100);
        defaultFullName : String;
        email           : String;
        division        : String(128);
        department      : String(128);
        title           : String(255);
}
```

**Characteristics:**
- **Read-Only**: Prevents local modifications to external data
- **Cache Pattern**: Local storage of external system data
- **String Key**: Matches external system identifier format
- **Denormalized**: Stores frequently accessed fields locally

## Relationship Patterns

### Parent-Child Composition
```
Project (1) ←→ (N) Member
Project (1) ←→ (N) Activity
```
- **Cascade Delete**: Deleting Project removes all Members and Activities
- **Referential Integrity**: Children cannot exist without parent
- **Transaction Scope**: All changes within same transaction boundary

### Cross-Aggregate References
```
Member (N) → (1) Employee
Member (N) → (1) Role
Activity (N) → (1) Member
Activity (N) → (1) Status
```
- **Loose Coupling**: References don't imply ownership
- **Data Integrity**: Foreign key constraints ensure valid references
- **Navigation**: Enables traversal between entities

## Data Consistency Patterns

### Eventual Consistency with External Systems
- **Pattern**: Dual-write to CAP and SuccessFactors
- **Challenge**: Network failures, system unavailability
- **Solution**: State tracking (`hasAssignment`) + compensation logic

### Transactional Consistency within Aggregate
- **Pattern**: ACID transactions for aggregate boundaries
- **Implementation**: CAP's transaction management
- **Scope**: Project + Members + Activities in single transaction

## Data Lifecycle Patterns

### Cascade Operations
```javascript
// Before delete: project
await deepDelete(cds.tx(req), req.data.ID, 'Activity');
await deepDelete(cds.tx(req), req.data.ID, 'Member');
```
- **Pattern**: Explicit cascade deletion in handlers
- **Reason**: Complex business logic beyond simple FK cascades
- **Implementation**: Custom `deepDelete` helper function

### Orphan Cleanup
```javascript
// Clean up unassigned employees
const members = SELECT.distinct.from('Member').columns(['member_userId']);
const unassigned = SELECT.distinct.from('Employee').where({
    userId: { 'NOT IN': members }
});
```
- **Pattern**: Periodic cleanup of unused reference data
- **Trigger**: After member deletions/updates
- **Performance**: Uses NOT IN queries for batch operations

## Service Layer Data Patterns

### Projection Pattern
```cds
entity Project as projection on model.Project;

entity Member as select from model.Member {
    *,
    member.defaultFullName as member_name
};
```
- **Purpose**: Customize entity exposure in services
- **Techniques**: Projections for direct mapping, SELECT for transformations
- **Benefits**: Service-specific views without changing underlying model

### Value List Pattern
```cds
@readonly
entity SFSF_User as select from UM_API.User {
    key userId,
        username,
        defaultFullName,
        email,
        division,
        department,
        title
};

annotate SFSF_User with @(cds.odata.valuelist);
```
- **Purpose**: Provide searchable lists for UI dropdown/lookup
- **Implementation**: OData value list annotations
- **Performance**: Direct pass-through to external service

## Data Validation Patterns

### Type Safety
- **String Lengths**: Explicit length constraints (e.g., `String(128)`)
- **Date Types**: Proper temporal data types
- **Required Fields**: Key fields and business-critical attributes

### Business Rule Validation
- **Service Layer**: Complex validation in handler functions
- **Model Layer**: Simple constraints and defaults
- **UI Layer**: Client-side validation for user experience

## Performance Optimization Patterns

### Selective Loading
```cds
// Only load necessary fields
SELECT.one.from('Employee').columns(['userId']).where({userId});
```
- **Pattern**: Explicit column selection
- **Benefit**: Reduced network and memory usage
- **Application**: Existence checks, lookup operations

### Query Transformation
```javascript
// Remove unsortable columns before external service call
req.query = removeColumnsFromOrderBy(req.query, ['defaultFullName']);
```
- **Pattern**: Adapt internal queries for external service capabilities
- **Use Case**: SuccessFactors API limitations
- **Implementation**: Query manipulation in handlers

## Draft Support Patterns

### Draft-Enabled Entities
```cds
@odata.draft.enabled
entity Project as projection on model.Project;
```
- **Pattern**: Fiori draft capabilities
- **Implementation**: CAP automatic draft table creation
- **Behavior**: Separate storage for draft vs. active records

### Draft State Management
- **Active Records**: Published, visible to all users
- **Draft Records**: Work-in-progress, user-specific
- **Activation**: Validation and business rule enforcement
- **Discarding**: Cleanup of abandoned drafts
