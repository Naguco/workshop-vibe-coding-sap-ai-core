sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"project1/test/integration/pages/ProjectList",
	"project1/test/integration/pages/ProjectObjectPage"
], function (JourneyRunner, ProjectList, ProjectObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('project1') + '/test/flp.html#app-preview',
        pages: {
			onTheProjectList: ProjectList,
			onTheProjectObjectPage: ProjectObjectPage
        },
        async: true
    });

    return runner;
});

