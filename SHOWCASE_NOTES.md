# Nagorik Sathi — Showcase Update Notes

## Updated

- Replaced the previous top-left brand mark with the supplied Nagorik Sathi logo; added a dark-header version and favicon.
- Updated the project title and visible brand references.
- Expanded the text ML training data to 839 synthetic rows across seven categories and three language styles.
- Added the missing drainage category to text classification and responsibility routing.
- Added Water, Healthcare, and Food departments, officers, and responsibility rules to the seed catalog and bundled SQLite database.
- Added a trained HOG + RBF SVM image advisory model and 21 upload samples (three per category).
- Connected image predictions to the suggested category and department while keeping staff verification mandatory.
- Added a bilingual DOM translation fallback for remaining raw Bengali UI strings.
- Split route pages into lazy-loaded chunks, converted static JPG assets to WebP, consolidated font loading, and enabled lazy loading for selected images.

## Showcase limitations

- The text and image datasets are generated/augmented demo data, not verified civic records.
- The image classifier has only 21 samples; its cross-validation score is not a real-world accuracy claim.
- The image model's confidence is an uncalibrated relative margin score.
- Human review remains mandatory for image-based routing.
- This package is intended for project presentation and testing, not production deployment.
