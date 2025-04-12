module.exports = {
    reporters: [
      "default",
      ["jest-html-reporter", {
        pageTitle: "Jest Unit Test Report",
        outputPath: "Jest-unit-test-reports.html"
      }]
    ],
    testTimeout: 60000,
};