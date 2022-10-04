const { spawnSync } = require('child_process');

function runCommitLintOnMsg(inputMsg: string) {
    return spawnSync('npx', ['commitlint', '--verbose'], { input: inputMsg });
}

test('type-space-after-colon1', () => {
    let commitMsgWithNoSpace = 'foo:bar';
    let typeSpaceAfterColon1 = runCommitLintOnMsg(commitMsgWithNoSpace);
    expect(typeSpaceAfterColon1.status).not.toBe(0);
});


test('type-space-after-colon2', () => {
    let commitMsgWithSpace = 'foo: bar';
    let typeSpaceAfterColon2 = runCommitLintOnMsg(commitMsgWithSpace);
    expect(typeSpaceAfterColon2.status).toBe(0);
});


test('type-space-after-colon3', () => {
    let commitMsgWithNoSpaceBeforeColonButAtTheEnd = 'foo: a tale of bar:baz';
    let typeSpaceAfterColon3 = runCommitLintOnMsg(commitMsgWithNoSpaceBeforeColonButAtTheEnd);
    expect(typeSpaceAfterColon3.status).toBe(0);
});


test('subject-lowercase1', () => {
    let commitMsgWithUppercaseAfterColon = "foo: Bar baz";
    let subjectLowerCase1 = runCommitLintOnMsg(commitMsgWithUppercaseAfterColon);
    expect(subjectLowerCase1.status).not.toBe(0);
});


test('subject-lowercase2', () => {
    let commitMsgWithLowercaseAfterColon = "foo: bar baz";
    let subjectLowerCase2 = runCommitLintOnMsg(commitMsgWithLowercaseAfterColon);
    expect(subjectLowerCase2.status).toBe(0);
});


test('subject-lowercase3', () => {
    let commitMsgWithAcronymAfterColon = "foo: BAR baz";
    let subjectLowerCase3 = runCommitLintOnMsg(commitMsgWithAcronymAfterColon);
    expect(subjectLowerCase3.status).toBe(0);
});


test('subject-lowercase4', () => {
    let commitMsgWithNonAlphanumericAfterColon = "foo: 3 tests added";
    let subjectLowerCase4 = runCommitLintOnMsg(commitMsgWithNonAlphanumericAfterColon);
    expect(subjectLowerCase4.status).toBe(0);
});


test('subject-lowercase5', () => {
    let commitMsgWithRareCharInArea1 = "foo.bar: Baz";
    let subjectLowerCase5 = runCommitLintOnMsg(commitMsgWithRareCharInArea1);
    expect(subjectLowerCase5.status).not.toBe(0);
});


test('subject-lowercase6', () => {
    let commitMsgWithRareCharInArea2 = "foo-bar: Baz";
    let subjectLowerCase6 = runCommitLintOnMsg(commitMsgWithRareCharInArea2);
    expect(subjectLowerCase6.status).not.toBe(0);
});


test('subject-lowercase7', () => {
    let commitMsgWithRareCharInArea3 = "foo,bar: Baz";
    let subjectLowerCase7 = runCommitLintOnMsg(commitMsgWithRareCharInArea3);
    expect(subjectLowerCase7.status).not.toBe(0);
});


test('type-space-after-comma1', () => {
    let commitMsgWithSpaceAfterCommaInType = "foo, bar: bla bla blah";
    let typeSpaceAfterComma1 = runCommitLintOnMsg(commitMsgWithSpaceAfterCommaInType);
    expect(typeSpaceAfterComma1.status).not.toBe(0);
});


test('type-space-after-comma2', () => {
    let commitMsgWithNoSpaceAfterCommaInType = "foo,bar: bla bla blah";
    let typeSpaceAfterComma2 = runCommitLintOnMsg(commitMsgWithNoSpaceAfterCommaInType);
    expect(typeSpaceAfterComma2.status).toBe(0);
});


test('body-max-line-length1', () => {
    let tenChars = "1234567890";
    let sixtyChars = tenChars + tenChars + tenChars + tenChars + tenChars + tenChars;
    let commitMsgWithOnlySixtyFourCharsInBody =
        "foo,bar: bla bla blah" + "\n\n" + sixtyChars + "1234";
    let bodyMaxLineLength1 = runCommitLintOnMsg(commitMsgWithOnlySixtyFourCharsInBody);
    //console.log("=============>" + bodyMaxLineLength1.stdout);
    expect(bodyMaxLineLength1.status).toBe(0);
});


test('body-max-line-length2', () => {
    let tenChars = "1234567890";
    let sixtyChars = tenChars + tenChars + tenChars + tenChars + tenChars + tenChars;
    let commitMsgWithOnlySixtyFiveCharsInBody =
        "foo,bar: bla bla blah" + "\n\n" + sixtyChars + "12345";
    let bodyMaxLineLength2 = runCommitLintOnMsg(commitMsgWithOnlySixtyFiveCharsInBody);
    //console.log("=============>" + bodyMaxLineLength2.stdout);
    expect(bodyMaxLineLength2.status).not.toBe(0);
});

