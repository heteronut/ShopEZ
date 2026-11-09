# Phase-Wise Template: Phase 1, Project Setup and Configuration

Project: ShopEZ: One-Stop Shop for Online Purchases
Student: Silman Ahsanul Qoul
Phase dates (from the LMS calendar): ____________________

## Objective

Create the project skeleton exactly as the brief requires: one folder with
a client subfolder and a server subfolder, a React app built with Vite in
client, an npm package in server with the source organised into models,
controllers and routes, and a README that states the project objective.

## Work completed

- Created the ShopEZ folder with client/ and server/ subfolders.
- Scaffolded the client as a Vite React app (JavaScript template) and
  confirmed it serves on http://localhost:5173 with npm run dev.
- Initialised the server package with npm init -y style metadata, created
  index.js as the entry point and the folders config, models, controllers,
  routes, middleware, utils, data and test.
- Wrote README.md stating the objective: a working e-commerce store for
  customers and an admin, on MongoDB, Express, React and Node.js.
- Wrote DESIGN.md recording the design direction taken from the official
  project documentation, with a reason for each visual decision.

## Output produced

- client/ running Vite React shell
- server/ package with folder structure in place
- README.md and DESIGN.md at the project root

## Verification evidence

- npm run dev in client serves the app shell on port 5173.
- The folder tree matches the brief: client, server, and inside server the
  models, controllers and routes folders exist before any feature code.

## Issues faced and how they were resolved

- The development laptop has no local MongoDB installation. Resolved in
  this phase by planning two supported paths: a DRIVER_LINK connection
  string for a local or Atlas database in server/.env, and an in-memory
  MongoDB runner (server/dev-memory.js) used for tests and the demo.

## Next phase

Phase 2 builds the database: Mongoose connection and the five schemas.
