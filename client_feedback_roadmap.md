# Octagon AI - Client Feedback & Solution Roadmap

This document outlines the issues reported by the client and provides a technical roadmap for implementing the necessary corrections.

## 1. Elo Ratings Engine
**Problem:** All fighters currently have the same Elo rating.
**Solution Roadmap:**
- **Integration:** Integrate the provided Elo engine script into the data pipeline.
- **Recalculation:** Create a script or batch job to process all historical fight data chronologically and calculate accurate, dynamic Elo ratings for each fighter.
- **Database Update:** Ensure the database schema stores these dynamic Elo ratings and updates them after each event.
- **Frontend Display:** Ensure the frontend fetches and displays the correctly calculated Elo per fighter rather than a hardcoded default value.

## 2. Event Data and Fighter Accuracy
**Problem:** Incorrect fighters are showing up on events (e.g., wrong Manuel Torres, wrong Burns). Also, most upcoming and past fight cards only show the main event instead of the full card.
**Solution Roadmap:**
- **Fighter Disambiguation:** Update the scraper and database insertion logic (`src/scrapers/ufc-event-scraper.ts`) to match fighters using unique identifiers (like Sherdog/Tapology URLs or an ID) rather than just their names.
- **Full Card Scraping:** Modify the event scraper to ensure it traverses and saves all bouts on a given card, rather than stopping at or only targeting the main event.
- **Data Backfill:** Run a data backfill script to populate missing fights for both past and currently announced events.

## 3. Featured Fight AI Breakdown
**Problem:** Missing a featured fight breakdown when clicking an event, which should include an AI blurb for the most confident pick, confidence level, predicted method, round, and upset risk.
**Solution Roadmap:**
- **Logic:** Implement backend logic to automatically identify the fight with the highest prediction confidence on a given card.
- **AI Integration:** Use an LLM or predefined heuristics to generate a short "blurb" incorporating the confidence, predicted method, round, and upset risk metrics.
- **UI Component:** Create a new `FeaturedFightBreakdown` component and place it prominently at the top of the event detail page.

## 4. Event Tab Quick Stats
**Problem:** The events tab requires un-collapsing individual fights to see pick percentage, odds, method, and value (star rating).
**Solution Roadmap:**
- **UI Update:** Redesign the collapsed state of the fight list items on the events page.
- **Data Badges:** Add small data badges (Pick %, Odds, Method, Value Stars) to the top-level visible row of each fight so the information is accessible at a glance.

## 5. Individual Fight UI and Missing Data
**Problem:** Text is squished on one side of the individual fight view, and many stats are showing as "N/A".
**Solution Roadmap:**
- **UI Fix:** Adjust the CSS/Tailwind classes on the individual fight view. Utilize proper flexbox or grid layouts with `flex-grow` or defined widths to prevent text from being squished.
- **Data Audit:** Audit the fighter stats fetching logic (`src/actions/fighters.ts`) to investigate why data is missing. Implement fallback scraping or ensure "N/A" states are handled gracefully if the data truly does not exist.

## 6. Prediction Tab Sorting & Filtering
**Problem:** The prediction tab is missing sorting (by confidence, value, finish %) and filtering (all, favorites, underdogs, finishes).
**Solution Roadmap:**
- **State Management:** Add local state for sorting and filtering to the Predictions tab.
- **Sorting Logic:** Implement sorting functions that order the displayed array based on confidence, value, and finish %.
- **Filtering Logic:** Implement toggle filters that subset the array for favorites, underdogs, or fights predicted to end in a finish.

## 7. Best Bets & Edges
**Problem:** The predictions tab is missing a "Best Bets and Edges" area listing edges from best to worst.
**Solution Roadmap:**
- **Calculation:** Calculate the "Edge" (e.g., the difference between the model's implied probability and the sportsbook's implied probability).
- **Component:** Create a `BestBetsSection` component that sorts all predicted fights by this calculated Edge value in descending order.
- **Placement:** Add this section to the Predictions tab.

## 8. Misplaced Past Event (Song vs. Figueiredo)
**Problem:** "Song vs Figueriedo" is still in the upcoming tab and is missing all of its fights and predictions.
**Solution Roadmap:**
- **Status Update:** Correct the date and status of the "Song vs Figueriedo" event in the database so it correctly maps to the Past Events tab.
- **Scrape & Predict:** Trigger the scraper to fetch the full card and results for this event, and run the historical prediction models on it.

## 9. Parlay Builder
**Problem:** The Performance tab is missing a Parlay Builder (AI generated safe, value, longshot, method prop parlays, and custom builder).
**Solution Roadmap:**
- **AI Parlays Logic:** Create backend functions to generate specific parlays based on defined criteria (e.g., "Safe" = top 3 highest confidence favorites, "Longshot" = highest EV underdogs).
- **Custom Builder UI:** Create an interactive UI where users can select multiple predictions, automatically calculating combined odds and implied probability.
- **Integration:** Embed these features in a new `ParlayBuilder` module on the Performance tab.

## 10. Matchup Lab Detailed Stats
**Problem:** Matchup lab predictions do not show the full stat-by-stat list (age, reach, wins, SLpM, Str. Acc, TD/15m, TD acc, Sub/15m).
**Solution Roadmap:**
- **Component Update:** Update the `MatchupLab` component to fetch and display a comprehensive, side-by-side comparison table of these exact statistics for both fighters.

## 11. Spider Charts for Predictions
**Problem:** All predictions (including the Matchup Lab) are missing a spider chart comparing fighter statistics.
**Solution Roadmap:**
- **Charting Library:** Integrate a charting library like `recharts` or `chart.js`.
- **Data Normalization:** Normalize the key fighter stats to a consistent scale (e.g., 0-100 percentile rankings) for visual comparison.
- **Component Creation:** Create a `FighterSpiderChart` component and embed it into the UI for all individual predictions and the Matchup Lab.

## 12. Elo Ranking Tab
**Problem:** Completely missing an Elo ranking tab with full rankings of everyone in the database, sortable by division.
**Solution Roadmap:**
- **Routing:** Create a new page route `/rankings`.
- **Data Fetching:** Fetch all fighters ordered by their recalculated Elo rating (from Step 1).
- **UI:** Build a datatable with a tab or dropdown system to filter the rankings by individual weight class divisions.

## 13. Performance Tracking Tab
**Problem:** Completely missing a Performance tab displaying backtested fights, results from Song vs Figueiredo, pick accuracy, simulated ROI, events graded, and sample size. Also missing a "High Confidence" (>60%) sub-tab with extensive tracking metrics and charts (bankroll progression, rolling win rate, event-by-event ROI).
**Solution Roadmap:**
- **Data Aggregation:** Create aggregation queries on the backend to compile historical performance metrics for both "All Picks" and picks with ">60% Confidence".
- **Dashboard Construction:** Build the main Performance tab UI with top-level summary cards (Accuracy, ROI, P/L, Bankroll).
- **Sub-tabs:** Implement UI tabs to switch between the overall dataset and the high-confidence subset.
- **Data Visualization:** Use charting libraries to build:
  - A line chart for Bankroll Progression over time.
  - A line chart for Rolling Win Rate.
  - A bar chart for Event-by-Event ROI.
- **Data Verification:** Ensure the backtested data from the provided model, including the Song vs Figueiredo event, is fully imported and reflected in these metrics.
