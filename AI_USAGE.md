# AI Usage

## Tools
Claude Code was used throughout the project for code generation, architecture decisions, and documentation.

## Accepted / Rejected

**Mock database format (accepted):** Claude suggested JSON files over CSV. JSON was the right call because it maps directly to the domain objects the app already uses, requires no parsing logic, and handles optional fields naturally.

**Session storage (rejected):** Claude proposed Zustand persist with localStorage. I identified the XSS vulnerability and suggested switching to httpOnly cookies instead. Claude implemented it.

## Own decisions
- Single input field for email or phone instead of two separate fields.
