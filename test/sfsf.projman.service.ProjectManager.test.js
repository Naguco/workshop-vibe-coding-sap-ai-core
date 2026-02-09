const cds = require('@sap/cds')

const { GET, POST, expect, axios } = cds.test (__dirname+'/..')
axios.defaults.auth = { username: 'alice', password: '' }

describe('OData APIs', () => {

  it('serves sfsf.projman.service.ProjectManager.Project', async () => {
    const { data } = await GET `/projman/sfsf.projman.service.ProjectManager.Project ${{ params: { $select: 'ID,name' } }}`
    expect(data.value).to.containSubset([
      {"ID":"26651125-883e-4172-9fd1-0771903d65e1","name":"name-26651125"},
    ])
  })

  it('serves SFSF_User from remote service', async () => {
    const { data } = await GET `/projman/SFSF_User('jdoe')`
    expect(data).to.containSubset({
      "userId": "jdoe",
      "defaultFullName": "John Doe",
      "division": "N/A",
      "department": "Sales",
      "title": null,
      "email": "john.doe@example.com",
      "username": "jdoe"
    })
  })

})
