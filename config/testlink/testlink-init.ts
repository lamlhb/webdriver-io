import {TestLink} from 'testlink-xmlrpc';
import {ExecutionStatus, TestCaseStatus} from "testlink-xmlrpc/build/constants";
const fs = require('fs');


const testlink = new TestLink({
    host: "5.189.141.238",
    path: "/testlink/",
    rpcPath: "lib/api/xmlrpc/v1/xmlrpc.php",
    port: 80, // Set if you are not using default port
    secure: false, // Use https, if you are using http, set to false.
    apiKey: "54179fe4cf6c64f8bc635ad841717924" // The API KEY from TestLink. Get it from user profile.
});

export async function updateTestExecution(testCasesId: string, testPrjName: string, testPlanName: string, buildName: string,
                                          resultUrl: string, note: string, isPassed: boolean) {

    let testPlans = await testlink.getTestPlanByName({testprojectname: testPrjName, testplanname: testPlanName});

    let testPlanId = testPlans.filter(tp => tp.name == testPlanName)?.[0].id;
    console.log(testPlanId);

    let tc = await testlink.getTestCase({testcaseexternalid: testCasesId});

    let builds = await testlink.getBuildsForTestPlan({testplanid: testPlanId});
    console.log(builds);
    let buildId = builds.filter(b => b.name == buildName)?.[0].id;
    console.log(buildId);

    let content = base64_encode(resultUrl);
    console.log(content);

    let ex = await testlink.setTestCaseExecutionResult({testcaseexternalid: testCasesId,
            status: isPassed ? ExecutionStatus.PASSED : ExecutionStatus.FAILED,
            testplanid: testPlanId, steps: [{step_number: 1, result: ExecutionStatus.PASSED}],
            buildid: buildId, notes: note});

    console.log('-------');
    console.log(ex);

    const now = new Date();

    testlink.uploadExecutionAttachment({executionid: ex?.[0].id, filename: now.toISOString() + '.png', filetype: 'png', content: content});

    // testlink.updateTestCase({testcaseexternalid: testCasesId, status: TestCaseStatus.READY_FOR_REVIEW});
}

export async function updateTestCases(testCasesId: string, status: TestCaseStatus) {

     testlink.updateTestCase({testcaseexternalid: testCasesId, status: status});
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


module.exports.init = function () {
    console.log('hi');
};