A student JavaScript assignment focused on use of Local Storage, Class inheritance, import/export of functions, and refactoring AI Agent code. Assignment prompt 

Assignment prompt: 

Project 5: Collection Manager -----

You can use AI for this BUT you gotta know what it does!

Build a small app that manages a collection for a topic you choose (books, games, recipes, workouts, courses, etc.). Use a base class and two subclasses, keep items in an array of prepopulated data, organize code in separate files (ES modules), include sorting and filtering, and validate the user inputs.

Requirements -----

Pick a topic you care about (e.g., Books, Games, Recipes, Workouts, Courses).

Classes & Inheritance -----
  Create a base class with shared properties (e.g., title, createdAt) and a small method (e.g., summary()).

  Create two subclasses that extend the base class and add 1–2 topic-specific properties or override a method.

Array of Prepopulated Data -----
  
  Begin with at least 12 items (a mix of both subclasses).
  
  All rendering, sorting, and filtering should use this array.

UI -----

  Show a list of items rendered from the array (no hard-coded list items).
  
  Provide a form to add a new item; selecting a type should instantiate the correct subclass and push it into the array.

  Use RegExp to validate the user input.

  Clicking an item should show a brief detail/preview (inline is fine).

Sorting & Filtering -----

  Filter by one property (e.g., category/type/boolean flag).

  Sort by a field (e.g., title A→Z, rating high→low, date newest→oldest).

Files / ES Modules -----

  Use <script type="module"> in index.html.
  
  Put classes in js/models/ and export/import them.

  Keep DOM/event code in js/app.js; styles in css/styles.css.

Usability -----

  Clear labels, basic validation (don’t add incomplete items), readable light theme.

Extra Credit (optional) -----

  Edit & delete items (keep array and UI in sync).

  Persist to localStorage (serialize minimal fields, re-create class instances on load).

  Multiple filters or multi-criteria sort (e.g., category + availability, title then date).
