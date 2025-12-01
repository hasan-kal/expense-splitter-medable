# Expense Splitter

A small React + TypeScript application that helps a group of people track shared expenses and figure out who owes whom.  
Users can add people, record expenses, choose how each expense is split, and see the final balances along with simplified settlement suggestions.

This project was built as part of an assignment.

---

## Features

### 1. People Management
- Add new people to the group  
- Remove people when needed  
- Prevents duplicate names  
- Updates all related sections (forms, expense splits, balances)  

### 2. Expense Management
Each expense includes:
- Description  
- Amount  
- Paid by  
- Date  
- Split between (selected people)  
- Split type: **equal** or **custom**  

Additional options:
- Delete an expense  
- View a clear list of all expenses  
- See total number of expenses  

### 3. Balance Calculation
The app calculates:
- Total paid by each person  
- Total owed based on their share  
- Net balance  
  - Positive → person should receive money  
  - Negative → person owes money  

Also shows:
- Total group spending  
- Suggested settlements (minimum number of payments required for everyone to settle)

---

## How to Run

1. Install dependencies:
   ```bash
   npm install
   # Expense Splitter

A small React + TypeScript application that helps a group of people track shared expenses and figure out who owes whom.  
Users can add people, record expenses, choose how each expense is split, and see the final balances along with simplified settlement suggestions.

This project was built as part of an assignment.

---

## Features

### 1. People Management
- Add new people to the group  
- Remove people when needed  
- Prevents duplicate names  
- Updates all related sections (forms, expense splits, balances)  

### 2. Expense Management
Each expense includes:
- Description  
- Amount  
- Paid by  
- Date  
- Split between (selected people)  
- Split type: **equal** or **custom**  

Additional options:
- Delete an expense  
- View a clear list of all expenses  
- See total number of expenses  

### 3. Balance Calculation
The app calculates:
- Total paid by each person  
- Total owed based on their share  
- Net balance  
  - Positive → person should receive money  
  - Negative → person owes money  

Also shows:
- Total group spending  
- Suggested settlements (minimum number of payments required for everyone to settle)

---

## How to Run

1. Install dependencies:

   npm install

2. Start the development server:

    npm run dev

3.	Open the URL shown in the terminal (usually http://localhost:5173).