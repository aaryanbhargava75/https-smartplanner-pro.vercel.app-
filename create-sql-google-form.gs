/**
 * ============================================================================
 * AUTOMATIC GOOGLE FORM CREATOR: SQL LEARNING PAIN POINTS & USER SEGMENTATION
 * ============================================================================
 * 
 * HOW TO USE (Takes 30 seconds):
 * 1. Open https://script.new in your browser (Google Apps Script).
 * 2. Delete any default code inside the editor.
 * 3. Copy and paste this ENTIRE script into the editor.
 * 4. Click the "Save" (disk icon) and then click "Run" (play icon ▶️).
 * 5. Grant permissions if prompted (Standard Google authorization).
 * 6. The Execution Log at the bottom will display your LIVE Form URL and EDIT URL!
 */

function createSqlSurveyGoogleForm() {
  // 1. Create the Form
  const form = FormApp.create('SQL Learning Experience & Pain Points Survey 🚀');
  form.setDescription(
    'Hey! We are conducting research to understand the real challenges, roadblocks, and friction points learners face when learning SQL. ' +
    'Your honest responses will help us design a 10x better, interactive way to master SQL.\n\n' +
    '⏱️ Time required: 3-4 minutes\n' +
    '🔒 Responses are anonymous and used strictly for product research.'
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);

  // ==========================================================================
  // SECTION 1: USER SEGMENTATION (WHAT DO YOU DO?)
  // ==========================================================================
  form.addSectionHeaderItem()
    .setTitle('📍 Section 1: User Profile & Background')
    .setHelpText('Help us understand who you are and where you are in your career journey.');

  // Q1: Current Role / Segment
  form.addMultipleChoiceItem()
    .setTitle('1. Which of the following best describes your current profile?')
    .setChoiceValues([
      'College Student / Fresh Graduate (Tech / CS / IT)',
      'College Student / Fresh Graduate (Non-Tech / Commerce / Arts / Science)',
      'Working Professional looking to switch into Data (Analyst / Scientist / Engineer)',
      'Software Developer / Backend Engineer looking to level up database skills',
      'Product Manager / Business Analyst / Growth Marketer needing SQL for metrics',
      'Finance / Operations / Business Operations professional',
      'Other'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q2: Current SQL Proficiency
  form.addMultipleChoiceItem()
    .setTitle('2. How would you rate your current SQL skill level?')
    .setChoiceValues([
      'Complete Beginner (Never written a query or just started SELECT * )',
      'Beginner (Comfortable with basic SELECT, WHERE, ORDER BY, LIMIT)',
      'Intermediate (Can write JOINs, GROUP BY, aggregates, but struggle with complex queries)',
      'Advanced Intermediate (Know subqueries, window functions, but struggle with optimization)',
      'Advanced (Confident writing complex queries and schema design)'
    ])
    .setRequired(true);

  // Q3: Tech & Coding Background
  form.addMultipleChoiceItem()
    .setTitle('3. What is your prior coding / technical background?')
    .setChoiceValues([
      'Strong coding background (Know Python, Java, C++, or JavaScript)',
      'Basic coding familiarity (Know basic syntax or Python for data)',
      'No coding background at all (Excel / Spreadsheets is my main tool)',
      'Zero technical background (Starting completely from scratch)'
    ])
    .setRequired(true);

  // Q4: Daily Tool Usage
  form.addCheckboxItem()
    .setTitle('4. Which tools do you currently use most often for work or study?')
    .setChoiceValues([
      'Microsoft Excel / Google Sheets',
      'Power BI / Tableau / Looker',
      'Python / R / Jupyter Notebooks',
      'SQL databases (PostgreSQL, MySQL, SQL Server, BigQuery, etc.)',
      'None of the above'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // ==========================================================================
  // SECTION 2: MOTIVATION & GOALS (WHY DO YOU NEED SQL?)
  // ==========================================================================
  const sec2 = form.addPageBreakItem();
  sec2.setTitle('🎯 Section 2: Motivation & Career Goals');
  sec2.setHelpText('Tell us why learning SQL is important to you right now.');

  // Q5: Primary Motivation
  form.addMultipleChoiceItem()
    .setTitle('5. What is the #1 primary reason you are learning or need SQL?')
    .setChoiceValues([
      'Cracking job interviews & landing a job (Data Analyst, BI Engineer, Data Scientist)',
      'Cracking tech placements / Software Engineering interviews',
      'Self-serve data at my current job (Stop waiting on data engineers/analysts)',
      'Academic coursework, college exams, or thesis research',
      'Automating daily repetitive manual reports in Excel/Sheets',
      'Building web apps / backend products that require database integration',
      'General curiosity & personal skill upgrade'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q6: Target Roles
  form.addCheckboxItem()
    .setTitle('6. If you are learning for job opportunities, which target roles are you aiming for?')
    .setChoiceValues([
      'Data Analyst / Junior Data Analyst',
      'Business Analyst / BI Analyst',
      'Data Engineer / Analytics Engineer',
      'Data Scientist / Machine Learning Engineer',
      'Backend Software Developer / Full-Stack Developer',
      'Product Manager / Operations Manager',
      'Not looking for a new job currently'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // Q7: Urgency / Timeline
  form.addMultipleChoiceItem()
    .setTitle('7. How urgent is learning SQL for you?')
    .setChoiceValues([
      'Immediate (Have interviews scheduled or urgent work deliverables in < 1 month)',
      'High Priority (Targeting a career switch / job within the next 1-3 months)',
      'Medium Priority (Planning to be proficient in the next 3-6 months)',
      'Low Priority / Casual (Learning at my own pace with no strict deadline)'
    ])
    .setRequired(true);

  // ==========================================================================
  // SECTION 3: CORE PAIN POINTS & CONCEPTUAL BLOCKERS (WHAT ARE THE PROBLEMS?)
  // ==========================================================================
  const sec3 = form.addPageBreakItem();
  sec3.setTitle('🚧 Section 3: Conceptual Blockers & Pain Points');
  sec3.setHelpText('Be brutally honest about what confuses, frustrates, or slows you down.');

  // Q8: Hardest SQL Concepts
  form.addCheckboxItem()
    .setTitle('8. Which SQL concepts do you find the most confusing or difficult to grasp?')
    .setChoiceValues([
      'JOINs (INNER vs LEFT vs RIGHT vs FULL vs CROSS vs SELF JOIN)',
      'GROUP BY vs HAVING clause (Knowing when to filter before vs after aggregation)',
      'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, OVER, PARTITION BY)',
      'Subqueries & Nested Queries (Correlated subqueries, CTEs / WITH clause)',
      'NULL value behavior & handling (IS NULL, COALESCE, ternary logic traps)',
      'Date & Time manipulation (DATE_TRUNC, intervals, timezone math)',
      'Query execution order (e.g., FROM -> WHERE -> GROUP BY -> HAVING -> SELECT)',
      'Indexing, EXPLAIN plans & Performance optimization',
      'Schema design & Normalization (1NF, 2NF, 3NF, Foreign Keys)',
      'Basic syntax feels easy, but solving complex business questions is hard'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q9: Setup & Environment Pain
  form.addMultipleChoiceItem()
    .setTitle('9. Have you faced issues with database setup or local environments?')
    .setChoiceValues([
      'Yes, installing MySQL / PostgreSQL / pgAdmin locally was frustrating and threw errors',
      'Yes, finding realistic practice databases (mock company tables) to practice on was hard',
      'I prefer browser-based SQL playgrounds so I do not have to install anything locally',
      'No, setup was smooth for me'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q10: Transition from Excel/Sheets to SQL
  form.addMultipleChoiceItem()
    .setTitle('10. If you came from an Excel/Sheets background, what felt like the biggest mental shift?')
    .setChoiceValues([
      'Not being able to physically see the whole spreadsheet grid while writing queries',
      'Thinking in "Sets & Relational Tables" instead of cell formulas (VLOOKUP, INDEX-MATCH)',
      'Aggregating with GROUP BY instead of dragging a Pivot Table',
      'Not applicable (Did not come from an Excel background)'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // Q11: Error Messages & Debugging
  form.addScaleItem()
    .setTitle('11. How frustrating do you find SQL error messages when a query fails?')
    .setBounds(1, 5)
    .setLabels('1 (Crystal clear & easy to fix)', '5 (Cryptic, vague & zero clue what broke)')
    .setRequired(true);

  // Q12: Problem Solving Block
  form.addParagraphTextItem()
    .setTitle('12. In your own words, what is the single biggest roadblock you face when practicing SQL questions?')
    .setHelpText('e.g., "I know the theory, but looking at a blank question I do not know which table or join to start with."')
    .setRequired(false);

  // ==========================================================================
  // SECTION 4: PRACTICE HABITS & LEARNING PREFERENCES
  // ==========================================================================
  const sec4 = form.addPageBreakItem();
  sec4.setTitle('📚 Section 4: Practice Habits & Solution Preferences');
  sec4.setHelpText('Tell us about where you learn and what would make SQL stick effortlessly.');

  // Q13: Current Learning Resources
  form.addCheckboxItem()
    .setTitle('13. What resources have you used so far to learn SQL?')
    .setChoiceValues([
      'YouTube tutorials (e.g. freeCodeCamp, Alex The Analyst, Luke Barousse, etc.)',
      'Interactive platforms (e.g. LeetCode, HackerRank, StrataScratch, DataLemur)',
      'Paid Courses (e.g. Udemy, Coursera, DataCamp, Maven Analytics)',
      'Official documentation / W3Schools / SQLZoo',
      'College / University lectures',
      'ChatGPT / Claude / AI assistance',
      'Just started / Haven’t chosen a resource yet'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q14: Why learners drop off / quit
  form.addMultipleChoiceItem()
    .setTitle('14. If you ever stopped or paused learning SQL, what was the primary reason?')
    .setChoiceValues([
      'Got overwhelmed or bored by abstract examples (e.g. Department ID, Employee ID with 3 rows)',
      'Lack of realistic, messy real-world datasets (e.g. Swiggy, Netflix, Spotify data)',
      'Could not stay consistent / No clear daily learning path',
      'Did not have anyone to ask questions or review my queries when stuck',
      'I haven’t paused; I am actively practicing consistently'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q15: Daily Time Available
  form.addMultipleChoiceItem()
    .setTitle('15. How much time can you realistically dedicate to learning/practicing SQL each week?')
    .setChoiceValues([
      'Under 2 hours / week',
      '3 to 5 hours / week (about 30-45 mins / day)',
      '6 to 10 hours / week (1-2 hours / day)',
      '10+ hours / week (Full-time job prep / intensive)'
    ])
    .setRequired(true);

  // Q16: Real-World Business Context
  form.addMultipleChoiceItem()
    .setTitle('16. How important is practicing on real brand case studies (e.g. Swiggy order data, Zerodha trades, Netflix retention)?')
    .setChoiceValues([
      'Extremely Important (Helps me see how companies actually use SQL)',
      'Somewhat Important (Nice to have, but generic tables work too)',
      'Neutral (I just need to pass syntax tests / LeetCode)',
      'Not Important'
    ])
    .setRequired(true);

  // Q17: AI Assistance Experience
  form.addMultipleChoiceItem()
    .setTitle('17. Do you use AI (ChatGPT, Claude, etc.) while learning SQL, and how does it feel?')
    .setChoiceValues([
      'Yes, I use it often, but it often gives the direct answer instead of teaching me how to think',
      'Yes, it helps explain syntax and error messages well',
      'Rarely, I prefer to solve problems myself without AI hints',
      'No, I have not tried using AI for SQL practice'
    ])
    .showOtherOption(true)
    .setRequired(false);

  // Q18: Dream Learning Feature
  form.addCheckboxItem()
    .setTitle('18. Which of these features would make learning SQL 10x easier for you?')
    .setChoiceValues([
      'Visual Schema Map that highlights table relationships and JOIN paths live',
      'Step-by-step query execution visualizer (shows rows before and after JOIN/GROUP BY)',
      'AI tutor that gives hints on problem-solving logic instead of spilling the code',
      'Real company case studies with messy, real-world data (E-commerce, FinTech, EdTech)',
      'Interactive browser editor with instant automated feedback & performance score',
      'Interview Question Cheat Sheets categorized by role (Analyst vs Engineer)'
    ])
    .setRequired(true);

  // Q19: Willingness to Pay
  form.addMultipleChoiceItem()
    .setTitle('19. If an interactive platform completely solved your SQL roadblocks and prepared you for job interviews, what would you consider a fair price?')
    .setChoiceValues([
      'I would only use a 100% free tool with ads/community',
      '₹499 - ₹999 ($6 - $12) one-time lifetime access',
      '₹299 - ₹499 ($4 - $6) monthly subscription during prep',
      '₹1,499 - ₹2,999 ($18 - $35) for a comprehensive guided cohort/certificate'
    ])
    .setRequired(false);

  // Q20: Open Feedback & Contact
  form.addParagraphTextItem()
    .setTitle('20. Any other thoughts, frustrations, or specific SQL topics you wish someone explained simply?')
    .setHelpText('Feel free to share anything else, or drop your email/Twitter if you would like early beta access to our interactive SQL tool!')
    .setRequired(false);

  // ==========================================================================
  // LOG OUTPUT
  // ==========================================================================
  const publishedUrl = form.getPublishedUrl();
  const editUrl = form.getEditUrl();

  Logger.log('===============================================================');
  Logger.log('🎉 GOOGLE FORM CREATED SUCCESSFULLY!');
  Logger.log('===============================================================');
  Logger.log('🔗 PUBLIC SHAREABLE LINK (Send to users):');
  Logger.log(publishedUrl);
  Logger.log('');
  Logger.log('✏️ EDITABLE LINK (To view/edit in Google Forms):');
  Logger.log(editUrl);
  Logger.log('===============================================================');
}
