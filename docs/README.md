<img src="logo.svg" width="100%" height="300" alt="Sync Multiple Google Calendars Together" />

# Sync Multiple Google Calendars Together

When you want to sync multiple Google Calendars together. Currently Google Calendar doesn't have this option and [IFTTT]/[Zapier] don't allow an easy way to do this.

This is useful for client + internal calendars

# Requirements

- All accounts must be Google accounts (Google Suites are fine)
- Only install on one of the merged calendar accounts
  - The account needs to have "Make changes to events" to all calendars; some clients may disable
    this access to external accounts - in this case you'll need to setup the script on the client
    account and allow access to it to the R&P calendar

## Getting Starting

1. Make sure every calendar you want sync is shared with the account that will run this script
1. Log into the account that holds the shared calendar and go to the [Google Apps Scripts] website.
1. Click on "New Project".
1. Replace everything in `Code.gs` with the contents of [MergeCalendarsTogether.gs].
1. Update `CALENDARS_TO_MERGE`, `SYNC_DAYS_IN_PAST`, and `SYNC_DAYS_IN_FUTURE` variables. Be sure to save.
1. Create a new script file called `BatchRequests.gs` with the contents of [BatchRequests.gs]
1. Click the `Project Settings` Gear icon on the left panel. Check the `Show "appsscript.json" manifest file in editor`. Go back to code editor on the left, and update its content with [appsscript.json].
1. Click `Run`. This will load the `Authorization required` window since it's your first time running the script. Click on `Review permissions` and give it permission to your account.
1. Click on `Triggers` clock icon on the left panel to add a trigger. Click on `Add Trigger`.

   - You have two choices, "Time-driven" or "From calendar".
   - Time-driven will run every X minutes/hours/etc. Use this if you have calendars that update frequently (more than 5-10 times in a 15 minute timespan)
   - "From calendar" will run when a given calendar updates. Use this if you want instant merging.

     a. **Time-driven**

     - "Choose which function to run": `MergeCalendarsTogether`
     - "Choose which deployment should run": `Head`
     - "Select event source": `Time-driven`
     - "Select type of time based trigger": choose what works for you.
     - Click "Save"

     b. **From calendar**

     - "Choose which function to run": `MergeCalendarsTogether`
     - "Choose which deployment should run": `Head`
     - "Select event source": `From calendar`
     - "Enter calendar details": enter one of the calendars you are merging.
     - Click "Save"
     - Repeat these steps for every calendar you're merging.

10. Enjoy!

## Notes

- Google App Scripts has a daily quote of 5k events created per day. See [Quotas for Google Services]
- Be sure to turn off "notifications".

## Icon Attributions

[event favorite], [event unknown], [event user], and [event warning] by arjuazka from the Noun Project
[Merge] by Travis Avery from the Noun Project
[Exchange Arrows] by [ImageCatalog] from the Noun Project

## License

MIT © [Ali Karbassi]

[ali karbassi]: http://karbassi.com
[trigger-icon]: trigger.png
[google apps scripts]: https://script.google.com/intro
[mergecalendarstogether.gs]: ../MergeCalendarsTogether.gs
[batchrequests.gs]: ../BatchRequests.gs
[appsscript.json]: ../appsscript.json
[quotas for google services]: https://developers.google.com/apps-script/guides/services/quotas
[ifttt]: https://ifttt.com/
[zapier]: https://zapier.com/
[event favorite]: https://thenounproject.com/arjuazka/collection/calendar/?i=548613
[event unknown]: https://thenounproject.com/arjuazka/collection/calendar/?i=548618
[event warning]: https://thenounproject.com/arjuazka/collection/calendar/?i=548620
[event user]: https://thenounproject.com/arjuazka/collection/calendar/?i=548621
[exchange arrows]: https://thenounproject.com/icon/exchange-arrows-405829/
[merge]: https://thenounproject.com/travisavery/collection/cursers-pointers-solid/?i=2286624
[imagecatalog]: https://thenounproject.com/anastasyastocks/  
