// ghetto unit tests: just run it as a script
//   node test.js
//   node --inspect-brk test.js // to debug
const objectUnderTest = require('./MergeCalendarsTogether.gs')

it('should find event in origin when it exists', () => {
  const origin = {primary: {
    [new Date(1111).toUTCString()]: [{ summary: 'Find me' }]
  }}
  const mergedEvent = {
    start: {dateTime: 1111},
    summary: `${objectUnderTest.MERGE_PREFIX}Find me`
  }
  return objectUnderTest.ExistsInOrigin(origin, mergedEvent)
})

it('should NOT find event in origin when it does not exist', () => {
  const origin = {primary: {
    [new Date(1111).toUTCString()]: [{ summary: 'Do not find me' }]
  }}
  const mergedEvent = {
    start: {dateTime: 1111},
    summary: `${objectUnderTest.MERGE_PREFIX}Will not find anything`
  }
  return !objectUnderTest.ExistsInOrigin(origin, mergedEvent)
})

it('should find event in destination when it exists', () => {
  const destination = {merged: {
    [new Date(1111).toUTCString()]: [{
      summary: `${objectUnderTest.MERGE_PREFIX}Find me`,
      description: 'some desc'
    }]
  }}
  const originEvent = {
    start: {dateTime: 1111},
    summary: 'Find me',
    description: 'some desc'
  }
  return objectUnderTest.ExistsInDestination(destination, originEvent)
})

it('should NOT find event in origin when summary does not match', () => {
  const destination = {merged: {
    [new Date(1111).toUTCString()]: [{
      summary: `${objectUnderTest.MERGE_PREFIX}Do not find me`,
      description: 'asdf'
    }]
  }}
  const originEvent = {
    start: {dateTime: 1111},
    summary: 'Will not find anything',
    description: 'asdf'
  }
  return !objectUnderTest.ExistsInDestination(destination, originEvent)
})

it('should NOT find event in origin when description does not match; not obscured', () => {
  objectUnderTest.TEST_INCLUDE_DESC = true
  const destination = {merged: {
    [new Date(1111).toUTCString()]: [{
      summary: `${objectUnderTest.MERGE_PREFIX}Matches`,
      description: objectUnderTest.DESC_NOT_COPIED_MSG
    }]
  }}
  const originEvent = {
    start: {dateTime: 1111},
    summary: 'Matches',
    description: 'one'
  }
  return !objectUnderTest.ExistsInDestination(destination, originEvent)
})

it('should NOT find event in origin when description does not match; is obscured', () => {
  objectUnderTest.TEST_INCLUDE_DESC = false
  const destination = {merged: {
    [new Date(1111).toUTCString()]: [{
      summary: `${objectUnderTest.MERGE_PREFIX}Matches`,
      description: 'should be obscured'
    }]
  }}
  const originEvent = {
    start: {dateTime: 1111},
    summary: 'Matches',
    description: 'one'
  }
  return !objectUnderTest.ExistsInDestination(destination, originEvent)
})

it('should find when desc incorrectly excluded', () => {
  objectUnderTest.TEST_INCLUDE_DESC = true
  const event = { description: objectUnderTest.DESC_NOT_COPIED_MSG }
  return objectUnderTest.isDescWrong(event)
})

it('should find when desc is incorrectly included', () => {
  objectUnderTest.TEST_INCLUDE_DESC = false
  const event = { description: 'blah blah' }
  return objectUnderTest.isDescWrong(event)
})

it('should pass when desc is correctly included', () => {
  objectUnderTest.TEST_INCLUDE_DESC = true
  const event = { description: 'blah blah' }
  return !objectUnderTest.isDescWrong(event)
})

it('should pass when desc is correctly excluded', () => {
  objectUnderTest.TEST_INCLUDE_DESC = false
  const event = { description: objectUnderTest.DESC_NOT_COPIED_MSG }
  return !objectUnderTest.isDescWrong(event)
})

function it(msg, fn) {
  try {
    if (fn()) {
      console.info(`PASS: ${msg}`)
      return
    }
    console.warn(`FAIL(assertion): ${msg}`)
  } catch (err) {
    console.error(`FAIL(error): ${msg}; error=${err.toString()}`)
  }
  process.exitCode = 1
}
