# Launch Azure Functions locally:

cd /Users/gracechen/repos/Student-Dashboard/azure-functions/StudentDashboardAPI
npm start

# Host website using Python:

cd /Users/gracechen/repos/Student-Dashboard
python3 -m http.server 8001

# Check UserXP table

SELECT * FROM UserXP;

# Check XPTransactions

SELECT * FROM XPTransactions ORDER BY transactionDate DESC;

# Check Blueprints

SELECT * FROM Blueprints ORDER BY submissionDate DESC;