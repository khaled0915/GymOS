# GymOS — Design System

## 1. Design Direction

GymOS should feel like a serious fitness performance product rather than a generic gym website.

Design characteristics:

* Clean
* Modern
* Athletic
* Data-driven
* Minimal
* Fast
* Mobile-first

Avoid excessive gradients, excessive animations, and unnecessary decoration.

## 2. Primary UX Priority

The workout logger is the most important interface.

A user standing in a gym should be able to:

1. Open the app.
2. Start today's workout.
3. See previous performance.
4. Enter weight/reps.
5. Complete a set.
6. Start rest timer.

with minimal interaction.

## 3. Main Navigation

Desktop:

```text
Dashboard
Workouts
Exercises
Progress
Nutrition
Profile
```

Mobile:

Use a bottom navigation bar.

Recommended:

```text
Home
Workout
Progress
Nutrition
Profile
```

## 4. Dashboard

Sections:

* Greeting
* Today's workout
* Weekly activity
* Recent PRs
* Weight trend
* Training volume
* Recent workouts

## 5. Workout Screen

Prioritize:

* Exercise name
* Previous performance
* Current set input
* Weight
* Reps
* RPE
* Complete button
* Rest timer

Avoid putting large amounts of secondary information on the workout screen.

## 6. Visual Hierarchy

Important actions should be visually dominant.

Examples:

Start Workout
Complete Set
Finish Workout

Secondary actions:

Edit
Delete
Notes

## 7. Charts

Charts should answer questions rather than merely display data.

Examples:

"Am I getting stronger?"

"How has my weight changed?"

"How much volume am I doing?"

## 8. Responsive Design

Design for:

* Small mobile screens
* Large mobile screens
* Tablet
* Desktop

Mobile workout experience receives highest priority.

## 9. Accessibility

Support:

* Keyboard navigation
* Focus states
* Screen readers
* Reduced motion
* Accessible form labels
* Accessible buttons
* Sufficient contrast

## 10. Empty States

Every major page needs a useful empty state.

Example:

"No workouts yet."

Then provide:

"Create your first workout"

rather than showing an empty screen.

## 11. Loading States

Use:

* Skeletons
* Disabled action states
* Optimistic UI where safe

Avoid unnecessary loading spinners.

## 12. Error States

Errors should explain:

* What happened
* What the user can do next

Avoid generic:

"Something went wrong."

## 13. Animation

Use animation sparingly.

Useful cases:

* Completing a set
* Starting a workout
* PR celebration
* Navigation transitions

Do not animate core interactions excessively.
