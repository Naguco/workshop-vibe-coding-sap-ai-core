const cds = require('@sap/cds');

describe('Project CRUD Test', () => {
  const { GET, POST, PATCH, DELETE, expect } = cds.test(__dirname + '/..', '--with-mocks');

  describe('Project Entity (Draft-Enabled)', () => {
    let draftId, activeProjectId;

    beforeAll(async () => {
      // Create a draft project
      const testProject = {
        name: 'Test Project',
        description: 'A simple test project',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status_ID: 1
      };

      // Step 1: Create draft
      const draftResponse = await POST('/projman/Project', testProject);
      draftId = draftResponse.data.ID;
      
      // Step 2: Activate draft to create active record
      const activateResponse = await POST(`/projman/Project(ID=${draftId},IsActiveEntity=false)/draftActivate`);
      activeProjectId = activateResponse.data.ID;
    });

    it('should create a draft project successfully', async () => {
      expect(draftId).to.exist;
    });

    it('should activate draft to create active project', async () => {
      expect(activeProjectId).to.exist;
    });

    it('should read the active project', async () => {
      const response = await GET(`/projman/Project(ID=${activeProjectId},IsActiveEntity=true)`);
      
      expect(response.status).to.equal(200);
      expect(response.data.name).to.equal('Test Project');
      expect(response.data.ID).to.equal(activeProjectId);
    });

    it('should update the active project', async () => {
      // Edit the active record (creates new draft)
      const editResponse = await POST(`/projman/Project(ID=${activeProjectId},IsActiveEntity=true)/draftEdit`);
      const editDraftId = editResponse.data.ID;
      
      // Update the draft
      const updates = {
        description: 'Updated test project description'
      };
      
      const patchResponse = await PATCH(`/projman/Project(ID=${editDraftId},IsActiveEntity=false)`, updates);
      expect(patchResponse.status).to.equal(200);
      
      // Activate the updated draft
      const activateResponse = await POST(`/projman/Project(ID=${editDraftId},IsActiveEntity=false)/draftActivate`);
      expect(activateResponse.status).to.equal(200);
      expect(activateResponse.data.description).to.equal('Updated test project description');
    });

    it('should list all active projects', async () => {
      const response = await GET('/projman/Project');
      
      expect(response.status).to.equal(200);
      expect(response.data.value).to.be.an('array');
      expect(response.data.value.length).to.be.greaterThan(0);
      
      // Find our test project
      const testProject = response.data.value.find(p => p.ID === activeProjectId);
      expect(testProject).to.exist;
      expect(testProject.name).to.equal('Test Project');
    });

    afterAll(async () => {
      // Clean up the active project
      if (activeProjectId) {
        await DELETE(`/projman/Project(ID=${activeProjectId},IsActiveEntity=true)`);
      }
    });
  });
});
