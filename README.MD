# Project Background Context:

I am running a startup called I Made It (IMI) and want to design a student portal UI prototype to show investors. This portal is a sub-page of our main website, and is only accessible if the student logs in, preferably using their microsoft account in our tenant. The hierarchy will be something like [imi.com/student_dashboard](http://imi.com/student_dashboard)

I want you to help me design the UI/UX for the student dashboard page plus relevant sub-pages. Focus on front-end appearance and not back-end functionality. I just want to get a rough draft of the website layout to brainstorm with my team and finalize the design.

High school students take training courses with us over the span of 8 months. For the first 4 months, they learn the basics of co-op tasks such as designing marketing flyers using AI. They are assigned fake tasks as practice. For the next 4 months, they choose a company that IMI contracts with, in an industry of their interest. They then complete projects relating to that company, such as designing an event poster for that company or doing background research for a product that the company wants to release. 

Their co-ops during high school are unpaid and may count towards volunteering hours instead. However, they may be able to intern or work full-time at those companies in the future once they enter university or graduate.

Every week, the students are encouraged to read a periodical article (e.g. from WSJ, Bloomberg, TechCrunch) and write short reflections relating the article to their career path. We’re calling this the Innovation Challenge for now.

We want to track everything they do at IMI such as assignments submitted, articles read, work done on coop projects. We will use AI to analyze their interests and suggest articles, co-ops, university majors, and careers that align with the student's interests.

IMI occasionally hosts industry networking events where students can directly talk to executives at the companies they work for (we aim to partner with small & medium-cap businesses where executives are more accessible). By forming these close relationships, students can ask for letters of recommendation from CEOs and boost their future university or internship applications.

The overall goal is to help the high school students discover their career interest by getting exposure to many industries and real work within those industries before they enter university and pick a major.

IMI also envisions that students will stay in our network for the rest of their life, for example seeking internship counselling after entering university, finding jobs after graduation, or needing help for a career change. We want to act as their lifelong career partner.

Here are some functionalities I envision for the student portal/dashboard. I am limiting this conversation to the student dashboard itself, not how it interconnects with the rest of the website (ex. company portal) or my business model in general. I just want a visual design of organizing the many elements in a coherent and user-friendly manner.

# Required Functionalities

- Students can see their profile summary
    - List of past courses (assignments, grades)
    - List of past internships (companies, projects, networks)
    - Which company they worked with & time period (work history)
    - Interest areas and evolution of ideas / career interest direction
- Calendar of upcoming meetings & events they signed up for
- Assigned tasks from companies
    - Quick links to MS Teams / chat channel to collaborate with classmates on the task / project
    - Advertises new projects available within that company or another company
- Allow students to submit new ideas (ex. starting a company based on something they read about an industry or a side project unrelated to a specific company but in an industry of interest)
    - Collaborate with peers on MS Teams / Notion to manifest the idea
- Students can apply to sign up for new courses through their portal
    - Their registration info will be sent to admins to create invoices
    - They will be enrolled and charged if approved for the selected course
- Suggest newsletter/substack/periodical articles to read (ex. WSJ, Bloomberg, news)
    - Recommended based on general importance, student interest, and peer viewership
    - Tracks clicks & updates student interest/career profile
- Highlights high-achieving students within the IMI network (ex. good written analysis of industry trends, general achievements)
- Help students find jobs
    - Help them explore careers based on their interests
    - If the companies they worked for / in the network are hiring & job descriptions, recommended roles
    - Activate established networks to land opportunities
    - Hold mock interviews and resume reviews
- Advertisements for upcoming courses & events
- Referral program: students can get commission for referring customers / partners to the companies contracted with IMI
    - Track deals & commissions they brought to the companies
    - Royalty sharing between IMI & students / parents
- Students can add certificates and personal website/profile links to their personal profile settings
- Store reference letters
    - Make it easy to request reference letters from past co-op companies
    - Autofills the student's achievements & connection with that company / person
- One-click send/email resumes to co-op companies
    - Apply for future co-ops or returning to companies for real jobs
    - Or one-click download a zip file of resume, AI-generated cover letter, reference letters, and a history of all interactions with the company to make application easier
- Be able to upload pictures from professional events
    - Automatically identify who’s in which picture & upload to student’s page, event page, and other students who are in that picture’s page
    - Helps link to companies and peers they met with

# Innovation Challenge Setup

- We want the Innovation Challenge to be an ongoing event that resets every season (4 months)
- All past and present students at IMI can participate
- The challenge will be gamified and have a point system. Students can accumulate points during each season by completing assignments
    - Students can also get streaks for completing assignments many weeks in a row.
    - There is a global leaderboard for points and streaks that resets every season
    - For each season the student participated in, display their accumulated points and longest weekly streak
- There is a dedicated section of the website for students to write (textbox) and submit their weekly reading reflections, so they submit it within the website itself instead of an external platform.
- Each submission is split up into 5 sections: Innovation catalyst, trend spotter, Future Visionist, Connector, and Growth Hacker
    - The student will receive 20 points for completing each of the 5 sections, but they can submit without completing all of them
    - We plan to write a clear rubric and use AI to evaluate the students' work to give them points

# Implementation Specifics

- Coop Work Assignment: The students should have a dedicated workspace that displays all ongoing projects at their coop companies, with a clear indicator for which project they're actively engaged in
    - Students can click on other projects at their company and request to collaborate. For example, if the student wants to suggest an idea or learn something from another team within that company
- There should be a dedicated space for students to see all available coop companies partnered with IMI.
    - Students can use the search bar to filter for companies (OR logic: display companies that meet any of the criteria)
    - AI can recommend companies for students to coop at (that they haven't tried before)
        - The recommendation is shown on the main dashboard, and clicking “view all” takes the student to the company catalogue
    - Students can give and see reviews for companies
        - Reviews use the 5 star system, but also other dimensions like project quality, culture/support/mentorship, opportunity for growth etc.
        - When writing reviews, students can also give private feedback as a textbox which will only be shown to IMI and not published
- There should be a subpage or section to display the list of all periodicals we subscribe to, with a button to take the student to that website
    - We are currently using Bitwarden (or another password manager) to share login details with the students, so there should be a section with instruction on installing the password manager browser extension and requesting access
- In the resources section, list all AI tools students will use to complete their coop projects.
    - Right now, we mainly have Perplexity, Google Gemini, and NotebookLM, but make this section extendable to many more
    - Students can click a button to go to that tool's website
    - If students want to know how to use a particular tool, the resources page contains training instructions and interactive tutorials
- We want to track how long each student spends on innovation challenge, company projects, and general reading (outside of innovation challenge; for personal growth)
    - These hours might count for volunteering hours so it's important to track accurately
    - Can show student engagement to parents and investors
    - For activities that occur through the student dashboard, we can track session lengths, but add someplace for students to submit their time sheet for off-site activities
- In networking, when clicking on a connected person or adding a new connection, students can write text or upload pictures to remember how they're connected to that person
    - This context is available when requesting reference letters or further outreach
- Some companies may have a referral program
    - Students can refer customers and get commission, or refer patients for clinical trials etc.
    - They will be compensated for introducing people that improve the partner company's finances
    - The referral button should be visible when clicking into a company's details
    - There should be a summary section listing all available referral programs
- When students click their personal icon on the top right, they should be able to edit their public social bio and interests for other peers to read and reach out for networking

# General Notes

- Assume that I have a git repo and can host this demo dashboard on github pages
- If adding subpages, make sure buttons that reference those subpages link correctly.
- Style the website according to our current company website: https://imadeit.ai/
    - Here are the colour codes we use: Blue: `#042847` Yellow: `#ffd502` Dark Gray: `#231f20`