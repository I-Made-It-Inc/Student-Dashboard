# Project Background Context:

I am running a startup called I Made It (IMI) and want to design a student portal UI prototype to show investors. This portal is a sub-page of our main website, and is only accessible if the student logs in, preferably using their microsoft account in our tenant. The hierarchy will be something like [imi.com/student_dashboard](http://imi.com/student_dashboard)

I want you to help me design the UI/UX for the student dashboard page plus relevant sub-pages. Focus on front-end appearance and not back-end functionality. I just want to get a rough draft of the website layout to brainstorm with my team and finalize the design.

High school students take training courses with us over the span of 8 months. For the first 4 months, they learn the basics of co-op tasks such as designing marketing flyers using AI. They are assigned fake tasks as practice. For the next 4 months, they choose a company that IMI contracts with, in an industry of their interest. They then complete projects relating to that company, such as designing an event poster for that company or doing background research for a product that the company wants to release. 

Their co-ops during high school are unpaid and may count towards volunteering hours instead. However, they may be able to intern or work full-time at those companies in the future once they enter university or graduate.

Every week, the students are encouraged to read a periodical article (e.g. from WSJ, Bloomberg, TechCrunch) and write short reflections relating the article to their career path. We're calling this the Blueprint for the Future for now.

We want to track everything they do at IMI such as assignments submitted, articles read, work done on coop projects. We will use AI to analyze their interests and suggest articles, co-ops, university majors, and careers that align with the student's interests.

IMI occasionally hosts industry networking events where students can directly talk to executives at the companies they work for (we aim to partner with small & medium-cap businesses where executives are more accessible). By forming these close relationships, students can ask for letters of recommendation from CEOs and boost their future university or internship applications.

The overall goal is to help the high school students discover their career interest by getting exposure to many industries and real work within those industries before they enter university and pick a major.

IMI also envisions that students will stay in our network for the rest of their life, for example seeking internship counselling after entering university, finding jobs after graduation, or needing help for a career change. We want to act as their lifelong career partner.

Here are some functionalities I envision for the student portal/dashboard. I am limiting this conversation to the student dashboard itself, not how it interconnects with the rest of the website (ex. company portal) or my business model in general. I just want a visual design of organizing the many elements in a coherent and user-friendly manner.

# Core Philosophy: The "Zero to One" Mindset

The core purpose of this platform is to shift users from a mindset of **imitative competition** to one of **creative and collaborative innovation**. Inspired by Peter Thiel's "Zero to One," the system is designed to reward unique thinking and collective progress, not zero-sum rivalry.

- **System Goal:** To be a "pull" environment where users are intrinsically motivated to explore, create, and connect.
- **Core Principle:** Success is not about being #1 on a leaderboard; it's about building a unique "Blueprint for the Future" and contributing to a global innovation ecosystem.

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
    - Automatically identify who's in which picture & upload to student's page, event page, and other students who are in that picture's page
    - Helps link to companies and peers they met with

# Blueprint for the Future Setup

## The Core Gameplay Loop: The Weekly "Blueprint for the Future"

This is the central, repeatable action that drives the entire system.

- **User Action:** Each week, the user selects one article from the IMadeIt resource library (e.g., *Harvard Business Review, MIT Technology Review, Wired*).
- **User Task:** The user writes a 500-word "Blueprint" reflection based on the article. This submission is the primary method for earning Experience Points (XP).
- **Required Blueprint Structure:** The submission must be structured around the following five "Innovator Archetypes":
    1. **The Trendspotter:** Identify the core trend or shift revealed in the article.
    2. **The Future Visionary:** Describe a plausible, exciting vision for the future in 5-10 years based on this trend.
    3. **The Innovation Catalyst:** Propose how this trend could be applied in a completely different field to create something new.
    4. **The Connector:** Identify which industries, skill sets, or communities would need to collaborate to make this vision a reality.
    5. **The Growth Hacker:** Reflect on how this new knowledge changes their personal career path, alters their future vision, and what one small action they can take now.

## The Gamification Engine: Experience Points (XP) & Progression

The XP system is designed to reward effort, consistency, and collaboration.

- **Earning XP:**
    - **+100 XP:** For each successful submission of a weekly "Blueprint for the Future."
    - **+25 XP (Connector Bonus):** Awarded when a user reads a "Peer Blueprint" and meaningfully connects its ideas to their own in their next weekly submission.
    - **+50 XP (Featured Insight Bonus):** Awarded if an insight from a user's Blueprint is selected by the AI Mentor to be shared with the community.
- **Important:** Completing co-op projects also grants experience points which are accumulated together with the "blueprint for the future" points
- **Fundamental Rule: No Public Leaderboards.** The system must not rank users against each other. XP is a personal measure of a user's journey and a currency for unlocking opportunities.
- **The "Blue Spark" Visual Reward System ✨:**
    - **Function:** To provide immediate, visual recognition for consistent participation. This is not a "verification" status but a dynamic indicator of active engagement.
    - **Mechanic:** Upon every successful Blueprint submission or when bonus XP is earned, a glowing **"Blue Spark"** icon appears next to the user's name on their profile.
    - **Persistence:** The Blue Spark remains active for one week, rewarding recent activity.

## The AI Mentor & Global Innovation Exchange

This is the intelligent core that makes the system personalized and interconnected.

- **The AI Mentor (Personalized "Pull" System):**
    - **Function:** The AI analyzes each user's article choices and Blueprint content over time.
    - **Analysis:** It identifies patterns in interests, skills, and thinking styles (e.g., a recurring interest in biotech or a talent for "Connector" style thinking).
    - **Output:** It provides the user with personalized recommendations for future articles, online courses, and potential career paths they might have missed, creating a unique "pull" for each user.
- **The Innovation Exchange (Collaborative System):**
    - **Function:** The AI identifies powerful, high-quality, and anonymized insights from Blueprints across the entire global user base.
    - **Sharing Mechanism:** When the AI detects a user with similar interests, it forwards these "Peer Blueprints" to them as inspiration.
    - **Goal:** To create a global dialogue where an idea from one user can spark an innovation for another, fostering a collaborative and interconnected environment.

## The Opportunity Marketplace: Redeeming XP

This is what gives the points tangible value. The system is based on a **Milestone Model**, where rewards are unlocked by reaching personal XP thresholds, not by ranking.

- **Tier 1: Opportunity Access (e.g., 2,500 XP Milestone)**
    - **Exclusive Workshops:** Redeem XP for a seat in special workshops with industry leaders.
    - **"Coffee with a Mentor" Lottery:** Use XP as tickets to enter a lottery for one-on-one virtual meetings with experts.
- **Tier 2: Career Accelerators (e.g., 5,000 XP Milestone)**
    - **Blueprint Portfolio Review:** Unlock a one-on-one session with an IMadeIt coach to review their collection of Blueprints and get personalized career advice.
    - **Micro-Internship Access:** Spend a significant amount of XP to get priority application status for exclusive micro-internships and CO-OPs with partner companies.
- **Tier 3: Community Leadership (e.g., 10,000 XP Milestone)**
    - **Peer Mentor Status:** Qualify to become a Peer Mentor, a recognized role within the community to help guide new users.

### Dynamic & Inclusive Access to Opportunities

- **Tiered "Flash Events":** World event: for a high-demand opportunity (like a workshop or a special Q&A with an industry leader), access is granted in waves.
    - **Wave 1 (Early Access):** Users with a high XP milestone (e.g., over 5,000 XP) get a 24-hour priority window to redeem their points for a spot.
    - **Wave 2 (Open Access):** Any remaining spots are opened to all users on a first-come, first-served basis, regardless of their XP total.
- **Weighted Lottery System:** For extremely rare opportunities, like a one-on-one mentorship with a CEO, use a lottery where points act as a "luck multiplier."
    - **Example:** Any user can spend 500 XP to buy a ticket. However, a user in the "Community Leadership" tier might have their ticket entered 5 times, while a user in the "Resource Unlocks" tier is entered once.
- **Collaborative Bidding & Crowdfunding with XP**
    - **Project Bounties:** IMadeIt or its corporate partners can post a "bounty" for a real-world micro-project. Users can form teams and **pledge their collective XP** to bid on the project.
    - **Crowdfunding Innovations:** A user with a brilliant "Zero to One" idea from their Blueprint can post it to the Opportunity Marketplace. Other users can then **"invest" their own XP** into promising ideas.
- **AI-Triggered "Surprise & Delight" Rewards:** The AI Mentor can reward deep curiosity by automatically unlocking surprise rewards for users who demonstrate sustained interest in specific topics.

# Implementation Specifics

- Coop Work Assignment: The students should have a dedicated workspace that displays all ongoing projects at their coop companies, with a clear indicator for which project they're actively engaged in
    - Students can click on other projects at their company and request to collaborate. For example, if the student wants to suggest an idea or learn something from another team within that company
- There should be a dedicated space for students to see all available coop companies partnered with IMI.
    - Students can use the search bar to filter for companies (OR logic: display companies that meet any of the criteria)
    - AI can recommend companies for students to coop at (that they haven't tried before)
        - The recommendation is shown on the main dashboard, and clicking "view all" takes the student to the company catalogue
    - Students can give and see reviews for companies
        - Reviews use the 5 star system, but also other dimensions like project quality, culture/support/mentorship, opportunity for growth etc.
        - When writing reviews, students can also give private feedback as a textbox which will only be shown to IMI and not published
- There should be a subpage or section to display the list of all periodicals we subscribe to, with a button to take the student to that website
    - We are currently using Bitwarden (or another password manager) to share login details with the students, so there should be a section with instruction on installing the password manager browser extension and requesting access
- In the resources section, list all AI tools students will use to complete their coop projects.
    - Right now, we mainly have Perplexity, Google Gemini, and NotebookLM, but make this section extendable to many more
    - Students can click a button to go to that tool's website
    - If students want to know how to use a particular tool, the resources page contains training instructions and interactive tutorials
- We want to track how long each student spends on blueprint submissions, company projects, and general reading (outside of blueprints; for personal growth)
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

## Virtual Data Rooms

The platform includes a professional Virtual Data Room feature that functions similar to data rooms used in corporate mergers and acquisitions. This space allows students to showcase their professional materials to recruiters when applying for jobs.

### Core Features

- **Multiple Room Creation**: Students can create multiple customized rooms tailored to different applications
- **Access Control**: Each room can be set to:
  - **Public**: Visible to anyone with the link
  - **Unpublished**: Not visible to anyone (draft mode)
  - **Visible by Request**: Recruiters can request access
    - Student receives email notification with requester's name and company
    - Student can grant access with optional time limit

### Content Management

- **Centralized Upload**: Students upload documents to their profile in organized sections (e.g., reference letters, certificates, projects)
- **Room-Specific Selection**: For each room, students use a hierarchical dropdown to select which files to include
- **Customization Options**:
  - Re-organize display order of items
  - Set items as read-only or downloadable
  - Preview room from published perspective
- **Security**: Print attempts are logged and IMI is notified

### Recruiter Interaction

- **Commenting**: Companies can leave comments on individual items
- **Interview Requests**: Easy interview request system that sends emails to student's inbox

### Future Expansions

**Enhanced Security & Tracking:**
- Dynamic watermarking with viewer's name/company and timestamp
- Session tracking: time spent on documents, download attempts, viewing patterns
- Expiring links with view-count limits (e.g., "expires after 10 views or 7 days")

**Templates & Efficiency:**
- Industry-specific templates (tech, finance, healthcare)
- Quick clone functionality to duplicate successful room configurations

**Rich Content:**
- Embedded video introductions (Loom-style explanations)
- Interactive portfolios with live demos for design/coding students
- Structured asynchronous Q&A sections
- Recruiter bookmarking for internal discussions

**Smart Notifications:**
- Activity digest emails with weekly viewing summaries
- Anonymous viewing option with reveal-on-interest

**Network Integration:**
- Highlight existing relationships with IMI partner companies
- Display mutual connections between student and viewing company
- Showcase IMI certifications and milestone achievements

**Analytics & Intelligence:**
- Engagement heatmaps showing document attention
- AI-powered suggestions based on job descriptions
- ML-based document arrangement optimization
- Missing document alerts for target roles

**Sharing & Discovery:**
- Teaser mode showing titles/descriptions before granting access
- QR code generation for in-person networking events

# Core Principles for Implementation

- **Fair & Inclusive by Design:** The Milestone Model ensures that every user who puts in the effort has access to the same opportunities, regardless of how quickly they accumulate points.
- **Personalized Journey:** The user experience must feel unique and responsive to individual curiosity.
- **Collaborative by Default:** System features should actively encourage and reward the sharing of ideas and the building of connections.

# General Notes

- Assume that I have a git repo and can host this demo dashboard on github pages
- If adding subpages, make sure buttons that reference those subpages link correctly.
- Style the website according to our current company website: https://imadeit.ai/
    - Here are the colour codes we use: Blue: `#042847` Yellow: `#ffd502` Dark Gray: `#231f20`