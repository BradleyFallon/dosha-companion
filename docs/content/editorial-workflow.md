# Editorial Workflow

> Status: Practical repository workflow implemented; expert approval process remains provisional.

1. An editor drafts content.
2. An Ayurvedic expert reviews it.
3. Required safety metadata is added.
4. An authorized reviewer approves it.
5. The content is scheduled or published.
6. Revisions and approvals are tracked.

For the demo, editors follow `content/editor-guide.md`, keep new work `provisional`, use `draft` until it is ready to preview, and run content generation plus tests before review. A published provisional item is visible with an explicit not-expert-approved label; publication does not imply approval.

Git review records revisions. A withdrawn item stays in source but disappears from application queries. Named expert sign-off, approval audit fields, service levels, emergency withdrawal ownership, and formal re-review triggers still need product governance before any item may be marked approved.
