# Employee Management System

This is an employee management system built with Angular 17. The application supports both English and Arabic languages with automatic RTL/LTR layout switching.

## Project Structure

The project is organized into the following main folders:

- auth: Contains the login component for user authentication
- core/services: Contains shared services like HTTP client wrapper and session management
- employees: Contains all employee-related components (list, details, add/edit forms)
- shared/components: Contains reusable UI components like buttons, cards, search, and form inputs
- welcome-page: The landing page component
- assets/i18n: Contains translation files for English and Arabic

## Libraries Used

This project uses the following main libraries:

Tailwind CSS

PrimeNG

Transloco for translation

SweetAlert2

RxJS

## Main Goal: Multi-Tab Session Management

The main challenge this application solves is allowing multiple users to log in on the same browser using different tabs.

Our solution uses (sessionStorage) with unique session IDs. Here's how it works:

When a user logs in, we generate a unique session ID using the current timestamp and a random number. This ID is unique to that specific tab.

We store the user's company ID using this session ID as the key. We also store a reference to the current session ID separately.

When we need to check if a user is logged in or get their company ID, we first get the current session ID, then use it to retrieve the company ID.

This approach has several benefits:

Multiple users can log in on different tabs in the same browser without interfering with each other. Each tab has its own isolated session.

If a user manually opens a new tab, they need to log in again because it's a new session. But if the application opens a new tab programmatically, the session persists.

Different company IDs can exist in the same browser at the same time, with each tab operating independently.

## Language Support

The application supports English and Arabic with full RTL/LTR support. When you switch languages, the entire interface changes direction and all text is translated. This includes UI labels, API data fields, dropdown options, and even confirmation dialogs.

## Test Login

You can test the application with these credentials:

- Email: noureladawy418@gmail.com
- Password: 123@123

&&

-Email: RAMY@RAMY.RAMY
-Password: 123@123
