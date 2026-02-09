const cds = require('@sap/cds')

const { GET, POST, expect, axios } = cds.test (__dirname+'/..')
axios.defaults.auth = { username: 'alice', password: '' }

describe('OData APIs', () => {

  it('serves PLTUserManagement.User', async () => {
    const { data } = await GET `/odata/v4/pltuser-management/PLTUserManagement.User ${{ params: { $select: 'userId,addressLine1' } }}`
    expect(data.value).to.containSubset([
      {"userId":"User-4893991","addressLine1":"addressLine1-4893991"},
    ])
  })

  it('executes getUserNameFormat', async () => {
    const { data } = await POST `/odata/v4/pltuser-management/getUserNameFormat ${
      {"locale":"locale-28987204"}
    }`
    // TODO finish this test
    // expect(data.value).to...
  })
  it('executes getPasswordPolicy', async () => {
    const { data } = await POST `/odata/v4/pltuser-management/getPasswordPolicy ${
      {"locale":"locale-27376229"}
    }`
    // TODO finish this test
    // expect(data.value).to...
  })
})
