# Navigation

The focused onboarding and assessment flow hides primary navigation. After Results, the persistent destinations are Today, Questions, My Balance, and Learn.

Settings is reached from Today and My Balance rather than occupying a bottom-navigation slot. The unavailable Assistant is reached from Today. Location editing is a nested Settings/My Balance flow and returns to its caller.

Incomplete deep links redirect to the next onboarding or assessment resume point. Coverage-repair links open a specific canonical question with a return-to-Results instruction. Development fixture state is query-only, is accepted only in development/test builds, and is never persisted.
