[video opens with two calendars open side-by-side, one labeled Company R, other Company C]
samwiseatgandalf@gmail.com
sammymcgammy@gmail.com

Hi there
My name is Jeremy and I had a problem: I have two Google Calendars from two different companies that
I needed to keep in-sync. 

[in the background, add events to each calendar, named to be clearly for that company]


For me, this meant that every time someone invited me to a meeting on one calendar, I had to create
a dummy meeting on my other calendar. 

[in the background, add "busy" events on the opposite calendar]

I tried using Apple's Calendar software and copy/pasting the
events, but that often resulted in accidentally inviting everyone to my placeholder event... from
the wrong email account. I tried a few other solutions, but everything had drawbacks and took more
time than I thought it should.

So, I wrote a script to do it for me. Here's how you set it up.

First, you'll need to pick one of your accounts to run the script. On the other account, hover over
your main calendar, click the three-dot menu, and choose "Settings and sharing".

[Follow the above steps]

In here, find "Share with specific people", and click the "+ Add people" button.

[Yup]

Enter the email address of the account that will run the script, then change the "Permissions"
dropdown to be "Make changes to events".

[add email address and reveal dropdown values] 

If this option isn't available (it can be disabled in Google Suites), you'll need to setup the
script on the other account - Follow the previous steps for the other account.

Hit send, then go to the other accounts' inbox and add the calendar.

[Do that]

Now, before you go any further you need to handle the duplicates. The script will treat anything it
doesn't create as a real meeting - including the duplicates you've created yourself. Go through and
delete them now.

[Do that]

Now you're ready to setup the script. Head over to script.google.com on the browser for the account
you'll run the script on.

Go read steps from HowTo

Click the save button; You're now done editing files! Open the Code.gs file again, and look at the
top of the screen: be sure this area says "MergeCalendarsTogether," then click "Run". Since this is
the first time you're running a new script, it will prompt you for some access requests.

Click "Review permissions", then click the account running the script. You may be required to also
provide your password for account validation; this isn't sent or saved in the project.

If you see this screen, click "Advanced", then click "Go to Untitled project (unsafe)"

The final screen is telling you what permissions you're allowing. The first is for creating and
managing calendar entries for this account, and the second is for creating/managing entries for the
second account. Click "Allow" to continue.

After allowing the script access, you'll see the log of which events will be created/deleted.

To automatically run the script whenever a change is made to an event, click on the Triggers icon on
the left, then click the "Add Trigger" button in the bottom-right.

Ensure the top box has "MergeCalendarsTogether" selected, then change "Select event source" to "From
calendar". Enter one of the account addresses into the "Calendar owner email" field. Then click
Save.

Repeat for the other address.


Click on "Untitled Project" at the top of the screen, and name it something you'll remember if you
have to come back to this page, then click Rename. Lastly, Open the Editor, locate line 12, and
change the value of "const DEBUG_ONLY" to "false". This will allow the script to begin maintaining
your calendars.

Click "Save", then "Run" to see it's output - then go check your calendar!

As you can see, because both account's calendar is displayed on the right, you see both the
originals and the placholder events. Looking at only one calendar, as on the left, you see the
"other calendar's" events as placeholders. This is also the view that someone trying to book an
appointment with you will see.

Let's try creating a new event and seeing what happens. After a few moments, you'll see two new
events appear on the right; one is from the external calendar and one is the placeholder. Here, lets
turn off the external calendar; we don't need it anymore!

I hope you find this script useful!
