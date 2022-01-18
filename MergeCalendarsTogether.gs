// Calendars to merge.
const CALENDARS_TO_MERGE = [  
  'calendar-id1@gmail.com',
  'calendar-id2@gmail.com',
];

// Number of days in the past and future to sync.
const SYNC_DAYS_IN_PAST = 7;
const SYNC_DAYS_IN_FUTURE = 30;
// While set to "true", this script will make ABSOLUTELY NO CHANGES to any Calendar
// Set this to "false" when your happy with the debug output!
const DEBUG_ONLY = true;

// ----------------------------------------------------------------------------
// DO NOT TOUCH FROM HERE ON
// ----------------------------------------------------------------------------

const ENDPOINT_BASE = 'https://www.googleapis.com/calendar/v3/calendars';
const MERGE_PREFIX = '🔄 ';

function GetMergeSummary(event) {
  return `${MERGE_PREFIX}${event.summary}`;
}

function GetRealStart(event) {
  // Convert all date-times to UTC for comparisons
  return new Date(event.start.dateTime).toUTCString();
}

function DateObjectToItems(dateObject) {
  return Object.keys(dateObject).reduce((items, day) => items.concat(dateObject[day]), [])
}

function CheckOrigin(origin, mergedEvent) {
  const realStart = GetRealStart(mergedEvent);
  return !!origin.primary[realStart]?.some(originEvent => mergedEvent.summary === GetMergeSummary(originEvent))
}

function CheckDestination(destination, originEvent) {
  const realStart = GetRealStart(originEvent);
  return !!destination.merged[realStart]?.some(mergedEvent => mergedEvent.summary === GetMergeSummary(originEvent))
}

function MergeCalendarsTogether() {
  // Midnight today
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  startTime.setDate(startTime.getDate() - SYNC_DAYS_IN_PAST);

  const endTime = new Date(startTime.valueOf());
  endTime.setDate(endTime.getDate() + SYNC_DAYS_IN_FUTURE);

  const calendars = RetrieveCalendars(startTime, endTime);
  MergeCalendars(calendars);
}

function RetrieveCalendars(startTime, endTime) {
  let calendars = []
  CALENDARS_TO_MERGE.forEach(calendarId => {
    calendarCheck = CalendarApp.getCalendarById(calendarId);

    if (!calendarCheck) {
      console.log(`Calendar not found: ${calendarId}. Be sure you've shared the calendar to this account AND accepted the share!`);
      return;
    }

    // Find events
    const events = Calendar.Events.list(calendarId, {
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // If nothing find, move to next calendar
    if (!(events.items && events.items.length > 0)) {
      return;
    }

    let primary = {};
    let merged = {};

    events.items.forEach((event) => {
      // Don't copy "free" events.
      if (event.transparency && event.transparency === 'transparent') {
        return;
      }
      const realStart = GetRealStart(event);

      let set = event.summary.startsWith(MERGE_PREFIX) ? merged : primary;

      if (!set[realStart]) {
        set[realStart] = [];
      } else if (set[realStart].some(e => e.summary === event.summary)) {
        // duplicate event
        event.isDuplicate = true;
      }

      set[realStart].push(event);
    });

    calendars.push({
      calendarId,
      primary,
      merged,
    });
  });

  return calendars;
}

function MergeCalendars (calendars) {
  // One Calender per batch...
  let payloadSets = {};

  calendars.forEach(({calendarId, primary, merged}) => {
    // Now that we have all events for all calendars, ensure each calendar's primary events are merged to others
    DateObjectToItems(primary).forEach(originEvent => {
      calendars
        .filter(destination => destination.calendarId !== calendarId) // Don't send to the current calendar
        .forEach(destination => {
          let calendarRequests = payloadSets[destination.calendarId] || [];
          if (!CheckDestination(destination, originEvent)) {
            calendarRequests.push({
              method: 'POST',
              endpoint: `${ENDPOINT_BASE}/${destination.calendarId}/events`,
              summary: GetMergeSummary(originEvent), // Only used in debugging statements
              requestBody: {
                summary: GetMergeSummary(originEvent),
                location: originEvent.location,
                reminders: {
                  useDefault: false,
                  overrides: [], // No reminders
                },
                description: originEvent.description,
                start: originEvent.start,
                end: originEvent.end,
              },
            });
          }
          payloadSets[destination.calendarId] = calendarRequests;
        });
    });
    // Also make sure that all of our merged appointments still exist in some other calendar's primary list
    DateObjectToItems(merged).forEach(mergedEvent => {
      const primaryFound = calendars.some(origin => origin.calendarId !== calendarId && CheckOrigin(origin, mergedEvent));
      if (!primaryFound || mergedEvent.isDuplicate) {
        let calendarRequests = payloadSets[calendarId] || [];
        calendarRequests.push({
          method: 'DELETE',
          endpoint: `${ENDPOINT_BASE}/${calendarId}/events/${mergedEvent.getId().replace('@google.com', '')}`,
          summary: mergedEvent.summary, // Only used in debugging statements
        });
        payloadSets[calendarId] = calendarRequests;
      }
    });
  });

  Object.keys(payloadSets).forEach(calendarId => {
    let calendarRequests = payloadSets[calendarId];
    if (calendarRequests && calendarRequests.length) {
      if (!DEBUG_ONLY) {
        const result = new BatchRequest({
          batchPath: 'batch/calendar/v3',
          requests: calendarRequests,
        });

        if (result.getResponseCode() !== 200) {
          console.log(result)
        }

        console.log(`${calendarRequests.length} events modified for ${calendarId}:`);
      }
      const loggable = calendarRequests.map(({method, endpoint, summary}) => ({method, endpoint, summary}))
      console.log(JSON.stringify(loggable, null, 2));
    } else {
      console.log(`No events to modify for ${calendarId}.`);
    }
  });
}
