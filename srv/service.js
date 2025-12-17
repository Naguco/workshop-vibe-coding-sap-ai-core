const cds = require('@sap/cds');
const {
    readSFSF_User,
    createEmployee,
    updateEmployee,
    createItem,
    deleteChildren,
    deleteUnassignedEmployees,
    beforeSaveProject,
    afterSaveProject
} = require('./lib/handlers');

module.exports = cds.service.impl(async function () {

    const {
        Project,
        Member,
        SFSF_User,
    } = this.entities;

    this.on('READ', SFSF_User, readSFSF_User);


    this.before('CREATE', Member, createEmployee);
    this.before('UPDATE', Member, updateEmployee);
    this.before('DELETE', Project, deleteChildren);
    this.before('DELETE', Member, deleteChildren);
    this.before('SAVE', Project, beforeSaveProject);

    this.after('CREATE', Member, createItem);
    this.after('UPDATE', Member, deleteUnassignedEmployees);
    this.after('DELETE', Project, deleteUnassignedEmployees);
    this.after('DELETE', Member, deleteUnassignedEmployees);
    this.after('SAVE', Project, afterSaveProject);
});
