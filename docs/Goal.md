# FastEnough Goal and Technical Requirements

## Product Goal
Build a mobile-first car-themed web app with a speedometer interface that shows:
- Speed from 0 to 300 km/h (or mph equivalent)
- Time saved or lost for a trip

## Functional Requirements
- User can choose distance/speed unit: kilometers (default) or miles
- User can input travel distance
- User can set current speed
- User can set route speed limit to compare legal travel time versus current speed
- User can choose language (English, Spanish, and other major languages)
- Time calculation must show gained or lost time based on the difference between current speed and speed-limit pace

## Future Scope
- Support route segments/tramos with different distances and speed limits
- Show gained/lost time per segment and aggregated trip summary

## UX and Platform Requirements
- Car-focused, elegant, sleek visual theme
- Phone-friendly and mobile-first layout
- Full PWA support (manifest + service worker + installable experience)

## Acceptance Criteria
- `npm run dev` works
- `npm run test:run` passes
- `npm run build` passes
- App is installable as a PWA
- Documentation matches implementation
