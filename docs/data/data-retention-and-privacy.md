# Data Retention and Privacy

> Status: Placeholder requiring privacy and legal review

TODO: Define purpose limitation, consent, retention, deletion, export, access control, audit logging, analytics, LLM data sharing, subprocessors, regional obligations, and incident response for each data category.

## Current browser-local implementation

The limited MVP stores an allowlisted version-3 profile and assessment snapshot in `localStorage`. Restore logic validates fields and canonical question/answer relationships, migrates versions 1 and 2, and safely resets corrupt or incompatible data. Passwords, transient selections, restore notices, and save status are not persisted. Coordinates are coarsened before storage.

Storage failures leave the in-memory session usable and display that changes are not saved. This is not secure account storage, cross-device synchronization, legal deletion/export support, or a production retention policy.
