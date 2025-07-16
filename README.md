# Expense Tracker

A modern and themeable expense tracking web application built with Next.js, PostgreSQL, Tailwind CSS, and shadcn/ui. Supports light/dark mode, customizable color themes, responsive UI, and real-time balance tracking.



# Features

- Add, edit, delete, and filter transaction records
--Filter by category, type, and date range
- Interactive charts for analyzing
- Date-range filtering & sorting
- Responsive UI with color themes (blue, green, yellow, etc.)
- Light/Dark/System mode switch


# Technologies Used

- Next.js 15 (App Router)
- PostgreSQL (via direct queries in server components)
- Tailwind CSS + ShadCN/UI
- next-themes for theming
- Lucide Icons 

# Installation & Setup

git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

Install dependencies
npm install

# Create `.env` file

Create a .env.local file in the root with the following:

Environment Variables
Create a .env file and add:
PG_USER=user
PG_PASSWORD=password
PG_HOST=localhost
PG_DATABASE=database
PG_PORT=port
JWT_SECRET=Secret key
NEXT_PUBLIC_BASE_URL=base url

# Database Setup


CREATE TABLE usertable (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
  password TEXT NOTNULL,
  balance INTEGER,
  budget INTEGER
);
 

CREATE TABLE records (
  transid SERIAL PRIMARY KEY,
  transtype VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50) NOT NULL,
  note TEXT,
  payer VARCHAR(50),
  dates DATE NOT NULL,
  times TIME WITHOUT TIME ZONE NOT NULL,
  balance INTEGER NOT NULL,
  value INTEGER NOT NULL,
  userid INTEGER REFERENCES usertable(id)
);
