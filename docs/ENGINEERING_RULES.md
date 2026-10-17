# Engineering Rulebook

Permanent engineering standards for this repository. They apply to every project, file and
line of code, whether written by a person or an AI agent. Project-specific blocking rules
(no hardcoded text or colors, light-default theme) are in [../CLAUDE.md](../CLAUDE.md).

## Core principles

- **DRY (Don't Repeat Yourself)**: every piece of logic exists in exactly one place. Extract, reuse and centralize; never copy-paste logic.
- **KISS (Keep It Simple)**: the simplest solution wins. Complexity is a bug; if it feels over-engineered, it is.
- **SOLID**, at all times:
  - **S**ingle responsibility: every class and function does one thing.
  - **O**pen/closed: open for extension, closed for modification.
  - **L**iskov substitution: subtypes must be substitutable for their base types.
  - **I**nterface segregation: no client depends on methods it doesn't use.
  - **D**ependency inversion: depend on abstractions, never on concretions.
- **YAGNI (You Ain't Gonna Need It)**: never write code for features that don't exist yet. Build only what is required now.
- **Clean, readable code**: written for humans first, machines second. Every line must be instantly understandable.
- **Testable code**: pure functions, minimal side effects, injectable dependencies.
- **Separation of concerns**: UI, business logic, data access and utilities never mix. Each layer owns its responsibility.
- **Refactor regularly**: after a feature works, improve structure, naming and efficiency before moving on.

## Thinking and decision making

- **Architecture Decision Records**: log every major technical decision in `docs/decisions/`: what was decided, why, and which alternatives were rejected.
- **Threat modeling before building**: for any feature touching data, auth or user input, identify attack surfaces and design defenses first.
- **Dependency auditing**: every external library must be justified: actively maintained, no critical CVEs, and not solving something you could write in 10 lines.
- **Plan before you code**: define data models, API contracts, component hierarchy and data flow first.
- **Continuous learning**: stay current with tools, patterns and best practices.

## Architecture and design

- **Feature-based folders**: organize by feature/domain (`features/auth/` holds its components, services, tests and types), not by type.
- **Hexagonal architecture (ports and adapters)**: core business logic never depends directly on frameworks, databases or external services; depend on abstractions so the core is swappable and testable.
- **API versioning from day one**: version APIs from the start (`/api/v1/`).
- **Config and environment separation**: zero hardcoded configuration. Environment-specific values (URLs, keys, ports, flags) live in environment variables, documented in a committed `.env.example`.
- **Circuit breakers**: external service calls fail fast and degrade gracefully with a fallback when a dependency keeps failing.
- Every module, file and function has one clear purpose.
- Design for scalability and maintainability from day one.

## Code quality and formatting

- Simple, self-documenting code; never "clever" at the cost of clarity.
- PR checklist verified and breaking changes noted.
- **Semantic versioning**: releases follow MAJOR.MINOR.PATCH and are recorded in `CHANGELOG.md`.

## CI/CD and deployment

- **Pipeline as code**: CI/CD is defined in version-controlled config, never configured by hand in a UI.
- **Zero-downtime deployments**: blue-green, canary or rolling.
- **Rollback plan**: every deployment has a documented, tested rollback executable in under 5 minutes.
- **Infrastructure as code**: servers, databases, queues and DNS are defined in code; no manual console configuration.

## Developer experience

- `docs/setup.md`: step-by-step guide from zero to running on a new machine in under 15 minutes.
- Common commands (start, test, build, lint, migrate, seed) run through one task runner (package.json scripts, Makefile or equivalent).
- `docs/contributing.md`: what reviewers check, how to give feedback, and the approval criteria.

## Delivery checklist

Before delivering code, verify:

- [ ] DRY, KISS, SOLID and YAGNI applied throughout
- [ ] No function exceeds its single responsibility
- [ ] No duplicated logic
- [ ] Functions documented with docstrings and comments where the intent isn't obvious
- [ ] `docs/` files complete and accurate
- [ ] Unit tests for every function and module
- [ ] Integration and end-to-end tests for all flows
- [ ] Full system logic tested and verified
- [ ] UI responsiveness tested across all breakpoints
- [ ] Localization verified for all supported locales (no hardcoded text, see CLAUDE.md)
- [ ] No hardcoded colors (tokens only, see CLAUDE.md)
- [ ] All inputs validated and all errors handled gracefully
- [ ] OWASP Top 10 self-audit completed
- [ ] Security headers implemented
- [ ] Performance budget defined and enforced
- [ ] Structured logging and correlation IDs
- [ ] Health check endpoints
- [ ] CI/CD pipeline defined in code
- [ ] SemVer applied and changelog updated
- [ ] ADR filed for major technical decisions
- [ ] WCAG 2.1 AA accessibility audit passed
- [ ] Linting and formatting enforced via pre-commit hooks
- [ ] Clean-code review passed with zero violations

## Mindset

- Will the next developer understand this at 2 a.m. during a production incident? If not, rewrite it.
- What happens when this fails? Design the failure path before the happy path.
- Am I building this because it's needed or because it's interesting?
- Can I explain this design decision in one sentence? If not, simplify.
- Have I seen this logic elsewhere in the codebase? If yes, extract it.
- Would I be comfortable if the whole team saw exactly what I'm doing and why?
- Am I solving the right problem, or just the obvious one?
- Is this the simplest thing that could possibly work?

## Response format for agents

- Deliver complete, working code: no placeholders, TODOs or "implement later".
- Multi-file changes start with the file tree of files created or modified.
- After the code: a short design-decisions section, then the checklist above with each item confirmed or marked as not done with the reason.
