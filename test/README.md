# SSFF Project Tests

This directory contains tests for the SSFF Project Management System, focusing on Member entity CRUD operations through Project composition.

## Test Files

### 1. `member.test.js` - Jest Integration Tests
- Automated tests using CAP's test framework
- Tests Member operations via Project composition
- May have connection issues with external services in mock mode

### 2. `member.http` - Manual HTTP Tests
- Manual tests using VS Code REST Client extension
- Allows testing with a running server
- More reliable for validating actual service behavior

## Running HTTP Tests

### Prerequisites
1. Install the "REST Client" extension in VS Code
2. Start the server: `cds watch` or `npm start`
3. Server should be running on `http://localhost:4004`

### How to Use HTTP Tests

1. **Open `member.http` in VS Code**
2. **Execute tests step by step** - Click "Send Request" above each HTTP request
3. **Copy IDs between requests** - Replace placeholders like `<PROJECT_ID>` with actual IDs from responses
4. **Follow the sequence** - Tests are numbered and should be executed in order

### Test Flow Overview

#### 1. Project Setup (Steps 1-2)
- Create a test project (draft)
- Activate the project to make it available for member operations

#### 2. Member Creation (Steps 3-7)
- Edit the project to start adding members
- Create multiple members with different roles and assignment statuses
- Activate the draft to save all members

#### 3. Member Reading (Steps 8-12)
- Read project with expanded team members
- Test various expand operations (member details, role details)
- Access specific members via composition paths

#### 4. Member Updates (Steps 13-20)
- Update member roles and assignment status
- Change employee assignments
- Verify changes are persisted

#### 5. Member Filtering (Steps 21-23)
- Filter team members by role
- Filter by assignment status
- Filter by specific employee

#### 6. Member Deletion (Steps 24-27)
- Delete members through project composition
- Verify deletion worked correctly

#### 7. Direct Member Service Access (Steps 28-30)
- Test Member service entity directly (not via composition)
- Test the projected `member_name` field
- Filter members by project

#### 8. Error Cases (Steps 31-33)
- Test validation with invalid employee IDs
- Test validation with invalid role IDs

#### 9. Cleanup (Steps 34-35)
- Delete test project (cascade deletes members)
- Verify cleanup completed

### Key Concepts Tested

#### Draft-Enabled Operations
- Projects are draft-enabled, so modifications require:
  1. `draftEdit` to create a draft
  2. Make changes to the draft
  3. `draftActivate` to save changes

#### Composition Relationships
- Members are accessed via Project composition: `/Project(...)/team`
- This reflects the OData composition defined in the model
- Members cannot be created directly, only through their parent Project

#### Business Logic Integration
- Tests validate the handler logic for:
  - Employee creation from SFSF data
  - Assignment creation in SuccessFactors
  - Cascade deletion operations
  - Data consistency maintenance

### Expected User Data

The tests use these user IDs from the mock data:
- `101` - John Doe (john.doe@mock.com)
- `102` - Sarah Manager (sarah.mgr@mock.com)  
- `103` - Toby HR (toby.hr@mock.com)

### Roles Used
- `1` - Project Manager
- `2` - Project Lead  
- `3` - Business Owner
- `7` - Software Engineer

### Status Used
- `1` - Not Started

## Troubleshooting

### Common Issues

1. **Server not running**: Make sure `cds watch` is running on port 4004
2. **404 errors**: Check that service path `/projman` is correct
3. **500 errors**: Check server logs for handler errors
4. **Foreign key errors**: Ensure you're using valid user IDs and role IDs

### Debugging Tips

1. **Use the additional queries at the end** to inspect current data state
2. **Check server console** for handler execution logs
3. **Verify mock data** is loaded correctly by checking SFSF_User endpoint
4. **Start fresh** if data gets inconsistent - restart the server to reload mock data

## Automated Testing

To run the Jest tests (if connection issues are resolved):

```bash
# Run all tests
npm test

# Run only member tests
npm test -- --testPathPattern=member.test.js

# Run with coverage
npm run test:coverage
```

## Next Steps

1. **Execute the HTTP tests manually** to validate Member operations
2. **Fix any issues found** in the handlers or service definitions
3. **Enhance error handling** based on test results
4. **Add more edge cases** as needed
5. **Consider automated HTTP testing** with tools like Newman or Postman CLI
