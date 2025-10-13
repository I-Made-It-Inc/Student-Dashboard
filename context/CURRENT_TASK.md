I just finished adding a login page that allows the user to sign in, either as a developer or with a Microsoft account.

Developer mode is purely meant to be a frontend demo. That means all of the data come from hardcoded default values. Edits persist during the session but resets to default on hard refresh (ctrl + shift + R).

Microsoft mode is what I'm currently working on, adding backend integration incrementally. I just finished adding a Dataverse connection using Azure Functions with email as the linking key. When the user logs in, a new Dataverse Contact is either created using Azure AD info or an existing Contact is found. I've sync'ed most of the student profile fields to Dataverse.

The next task is fixing UI bugs in Microsoft mode.