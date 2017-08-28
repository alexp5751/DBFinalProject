# Team 78 | Phase 3 | CS 4400 
## Testing Things Locally
1. Install Node.js (and be sure to include the command line tools when installing).
2. Run `npm install http-server -g` in a terminal. This will install this module globally for node, allowing it to be used in any directory inside a terminal.
3. Navigate to the app folder inside the Team78_Phase3 repository within the terminal (if you haven't cloned this repository locally, you will have to do that first).
4. Run `http-server .`.
5. Visit <http://localhost:8080> in any browser to view the site as-is. You can make changes to HTML, CSS, and Javascript (only front end, like AngularJS) that are immediately updated upon refresh (be sure to clear browser cache, or it'll look the same).
6. This is all well and good, but you'll notice that nothing is working! This is because our site is currently not connected to the database. There's currently a very simplistic API written that should fix that.
7. In a separate terminal (leave the one running `http-server` alone, as you'll want to be able to view the site and access the database), navigate to the server folder inside the Team78_Phase3 repository.
8. Run `npm install` to install all dependencies for our server. This includes `mysql` (duh), `express` (allows us to create the REST API), and `body-parser` (allows for parsing of data in requests and responses for the API).
9. Once that finishes, run `node server.js`. This should print a single line about listening on a specific port, but it doesn't matter all that much.
10. Once again, test the app at <http://localhost:8080>. This time, things that are connected to the database should function properly.
11. Do a jig.
12. Stay in school, kids.
13. Winning.
