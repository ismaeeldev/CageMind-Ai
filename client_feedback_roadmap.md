# Client Feedback & Roadmap

This document outlines the client's latest feedback points and the proposed technical solutions for each.

## 1. Active vs. Retired Fighters Sorting
- **Problem:** Retired fighters are still appearing as "Active" in the application and sorting/filtering by active/retired status is either incorrect or not working properly.
- **Solution:** 
  - Update the scraper/updater logic to pull fighter active/retired status from either `ufc.com` or `roster.watch` (or via fallback parsing of tapology/ufc api).
  - Add/ensure the `isActive` boolean field in the database `Fighter` model matches the current status.
  - Implement a sorting and filtering toggle in the Frontend (e.g. Fighters directory page) to allow filtering by "Active", "Retired", or "All", and sort them accordingly.

## 2. Elo Engine UFC Win Multiplier & Upsets Scaling
- **Problem:** The Elo engine does not value UFC wins highly enough compared to regional/non-UFC wins, and does not reward underdog upsets with sufficient Elo rating shifts.
- **Solution:**
  - Modify the ELO calculation engine so that fights flagged as UFC events scale the win/loss rating impact (`K` factor or actual change) by **2x** compared to non-UFC fights.
  - Scale ELO rating change for upset wins based on the pre-fight probability (implied by odds or ELO difference) so that greater upsets yield a larger ELO reward for the winner and greater penalty for the loser.

## 3. Tapology Scraper for Full Fight Cards
- **Problem:** Only the main events of cards are loading into the application. Prelims and early prelims are missing, preventing the display and prediction of full fight cards.
- **Solution:**
  - Implement/refactor the event scraper to target `tapology.com` (or parse its fight cards) to extract the complete card structure including: Main Card, Preliminary Card, and Early Preliminary Card.
  - Map and store all card segments and fights to the database.

## 4. Incorrect Fighter Matching / Name Mapping
- **Problem:** Certain fighters are incorrectly mapped in fight records. For example, Ismael Bonfim is shown instead of Gabriel Bonfim, and Ronys Torres instead of Manuel Torres.
- **Solution:**
  - Enhance the fighter fuzzy matching and alias mapping logic in the scraper.
  - Implement a lookup/alias dictionary or check against exact UFC roster profiles/Tapology URLs to distinguish fighters with similar names (e.g., matching using full name, division, and/or unique source ID).
  - Correct the existing mismatched data in the database.

## 5. Spider Chart Reach Advantage Loading
- **Problem:** The reach advantage metric is not loading/rendering on the spider chart component when viewed in the events tab.
- **Solution:**
  - Verify if reach data is correctly fetched from the database and passed to the spider chart component.
  - Fix the key mapping (e.g., mapping `reachAdvantage` vs `reach` difference) and handle null or missing values gracefully so the spider chart renders the reach metric correctly.

## 6. Performance (Past Event Results) Tab Restoration & Backtesting
- **Problem:** The Performance tab is not visible or available, and we need to back-test the last event (Song vs Figueiredo) for the full card (main, prelims, early prelims), show predictions, and automatically update statistics going forward when events end.
- **Solution:**
  - Restore/add the Performance tab (renamed to "Past Event Results" or similar) in the navigation and UI layout.
  - Run/back-test predictions for all fights (main, prelims, early prelims) of the Song vs Figueiredo card.
  - Update the ELO engine and AI prediction pipeline to process completed events post-fight, inserting them into `Past Event Results` database tables, and dynamically updating charts and statistics (ROI, accuracy, etc.).

## 7. Fighter Photos on Events Tab
- **Problem:** The events card/tab only displays fighter names, which looks plain and lacks a premium visual aesthetic.
- **Solution:**
  - Integrate fighter profile images next to their names on the Events page.
  - Use a high-quality fallback profile icon/placeholder if the image is missing, and ensure clean image loading and styling to match the CageMind AI theme.
