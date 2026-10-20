# SQL Learning Experience & Pain Points Survey 🚀
## Master Survey Questions & User Segmentation Guide

A structured 20-question research survey designed to uncover user segments, motivations, blockers, and product opportunities in the SQL learning landscape.

---

### 📍 Section 1: User Profile & Segmentation (Who are they?)
1. **Which of the following best describes your current profile?** *(Single Choice + Other)*
   - College Student / Fresh Graduate (Tech / CS / IT)
   - College Student / Fresh Graduate (Non-Tech / Commerce / Arts / Science)
   - Working Professional looking to switch into Data (Analyst / Scientist / Engineer)
   - Software Developer / Backend Engineer looking to level up database skills
   - Product Manager / Business Analyst / Growth Marketer needing SQL for metrics
   - Finance / Operations / Business Operations professional
   - Other [Text]

2. **How would you rate your current SQL skill level?** *(Single Choice)*
   - Complete Beginner (Never written a query or just started `SELECT *`)
   - Beginner (Comfortable with basic `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`)
   - Intermediate (Can write `JOIN`s, `GROUP BY`, aggregates, but struggle with complex queries)
   - Advanced Intermediate (Know subqueries, window functions, but struggle with optimization)
   - Advanced (Confident writing complex queries and schema design)

3. **What is your prior coding / technical background?** *(Single Choice)*
   - Strong coding background (Know Python, Java, C++, or JavaScript)
   - Basic coding familiarity (Know basic syntax or Python for data)
   - No coding background at all (Excel / Spreadsheets is my main tool)
   - Zero technical background (Starting completely from scratch)

4. **Which tools do you currently use most often for work or study?** *(Checkboxes)*
   - Microsoft Excel / Google Sheets
   - Power BI / Tableau / Looker
   - Python / R / Jupyter Notebooks
   - SQL databases (PostgreSQL, MySQL, SQL Server, BigQuery, etc.)
   - None of the above / Other

---

### 🎯 Section 2: Motivation & Goals (Why do they need it?)
5. **What is the #1 primary reason you are learning or need SQL?** *(Single Choice)*
   - Cracking job interviews & landing a job (Data Analyst, BI Engineer, Data Scientist)
   - Cracking tech placements / Software Engineering interviews
   - Self-serve data at my current job (Stop waiting on data engineers/analysts)
   - Academic coursework, college exams, or thesis research
   - Automating daily repetitive manual reports in Excel/Sheets
   - Building web apps / backend products that require database integration
   - General curiosity & personal skill upgrade

6. **If you are learning for job opportunities, which target roles are you aiming for?** *(Checkboxes)*
   - Data Analyst / Junior Data Analyst
   - Business Analyst / BI Analyst
   - Data Engineer / Analytics Engineer
   - Data Scientist / Machine Learning Engineer
   - Backend Software Developer / Full-Stack Developer
   - Product Manager / Operations Manager
   - Not looking for a new job currently

7. **How urgent is learning SQL for you?** *(Single Choice)*
   - Immediate (Have interviews scheduled or urgent work deliverables in < 1 month)
   - High Priority (Targeting a career switch / job within the next 1-3 months)
   - Medium Priority (Planning to be proficient in the next 3-6 months)
   - Low Priority / Casual (Learning at my own pace with no strict deadline)

---

### 🚧 Section 3: Core Pain Points & Blockers (Where do they get stuck?)
8. **Which SQL concepts do you find the most confusing or difficult to grasp?** *(Checkboxes)*
   - `JOIN`s (`INNER` vs `LEFT` vs `RIGHT` vs `FULL` vs `CROSS` vs `SELF JOIN`)
   - `GROUP BY` vs `HAVING` clause (Knowing when to filter before vs after aggregation)
   - Window Functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `OVER`, `PARTITION BY`)
   - Subqueries & Nested Queries (Correlated subqueries, CTEs / `WITH` clause)
   - `NULL` value behavior & handling (`IS NULL`, `COALESCE`, 3-valued logic traps)
   - Date & Time manipulation (`DATE_TRUNC`, intervals, timezone math)
   - Query execution order (e.g., `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT`)
   - Indexing, `EXPLAIN` plans & Performance optimization
   - Schema design & Normalization (1NF, 2NF, 3NF, Foreign Keys)
   - Basic syntax feels easy, but solving complex business questions is hard

9. **Have you faced issues with database setup or local environments?** *(Single Choice)*
   - Yes, installing MySQL / PostgreSQL / pgAdmin locally was frustrating and threw errors
   - Yes, finding realistic practice databases (mock company tables) to practice on was hard
   - I prefer browser-based SQL playgrounds so I do not have to install anything locally
   - No, setup was smooth for me

10. **If you came from an Excel/Sheets background, what felt like the biggest mental shift?** *(Single Choice)*
    - Not being able to physically see the whole spreadsheet grid while writing queries
    - Thinking in "Sets & Relational Tables" instead of cell formulas (`VLOOKUP`, `INDEX-MATCH`)
    - Aggregating with `GROUP BY` instead of dragging a Pivot Table
    - Not applicable (Did not come from an Excel background)

11. **How frustrating do you find SQL error messages when a query fails?** *(Linear Scale 1 to 5)*
    - 1: Crystal clear & easy to fix
    - 5: Cryptic, vague & zero clue what broke

12. **In your own words, what is the single biggest roadblock you face when practicing SQL questions?** *(Long Text / Open Ended)*
    - *Prompt text:* e.g., "I understand the theory, but looking at a blank question I freeze and don't know which table or join to start with."

---

### 📚 Section 4: Practice Habits & Ideal Solution (What would fix this?)
13. **What resources have you used so far to learn SQL?** *(Checkboxes)*
    - YouTube tutorials (e.g. freeCodeCamp, Alex The Analyst, Luke Barousse, etc.)
    - Interactive platforms (e.g. LeetCode, HackerRank, StrataScratch, DataLemur)
    - Paid Courses (e.g. Udemy, Coursera, DataCamp, Maven Analytics)
    - Official documentation / W3Schools / SQLZoo
    - College / University lectures
    - ChatGPT / Claude / AI assistance
    - Just started / Haven’t chosen a resource yet

14. **If you ever stopped or paused learning SQL, what was the primary reason?** *(Single Choice)*
    - Got overwhelmed or bored by abstract examples (e.g. Department ID, Employee ID with 3 rows)
    - Lack of realistic, messy real-world datasets (e.g. Swiggy, Netflix, Spotify data)
    - Could not stay consistent / No clear daily learning path
    - Did not have anyone to ask questions or review my queries when stuck
    - I haven’t paused; I am actively practicing consistently

15. **How much time can you realistically dedicate to learning/practicing SQL each week?** *(Single Choice)*
    - Under 2 hours / week
    - 3 to 5 hours / week (about 30-45 mins / day)
    - 6 to 10 hours / week (1-2 hours / day)
    - 10+ hours / week (Full-time job prep / intensive)

16. **How important is practicing on real brand case studies (e.g. Swiggy order data, Zerodha trades, Netflix retention)?** *(Single Choice)*
    - Extremely Important (Helps me see how companies actually use SQL)
    - Somewhat Important (Nice to have, but generic tables work too)
    - Neutral (I just need to pass syntax tests / LeetCode)
    - Not Important

17. **Do you use AI (ChatGPT, Claude, etc.) while learning SQL, and how does it feel?** *(Single Choice)*
    - Yes, I use it often, but it often gives the direct answer instead of teaching me how to think
    - Yes, it helps explain syntax and error messages well
    - Rarely, I prefer to solve problems myself without AI hints
    - No, I have not tried using AI for SQL practice

18. **Which of these features would make learning SQL 10x easier for you?** *(Checkboxes)*
    - Visual Schema Map that highlights table relationships and JOIN paths live
    - Step-by-step query execution visualizer (shows rows before and after JOIN/GROUP BY)
    - AI tutor that gives hints on problem-solving logic instead of spilling the code
    - Real company case studies with messy, real-world data (E-commerce, FinTech, EdTech)
    - Interactive browser editor with instant automated feedback & performance score
    - Interview Question Cheat Sheets categorized by role (Analyst vs Engineer)

19. **If an interactive platform completely solved your SQL roadblocks and prepared you for job interviews, what would you consider a fair price?** *(Single Choice)*
    - I would only use a 100% free tool with ads/community
    - ₹499 - ₹999 ($6 - $12) one-time lifetime access
    - ₹299 - ₹499 ($4 - $6) monthly subscription during prep
    - ₹1,499 - ₹2,999 ($18 - $35) for a comprehensive guided cohort/certificate

20. **Any other thoughts, frustrations, or specific SQL topics you wish someone explained simply?** *(Long Text / Open Ended)*
    - *Prompt text:* Share anything else, or drop your email/Twitter if you would like early beta access!
