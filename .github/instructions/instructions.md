---
applyTo: "**"
---

# High-Standard React-TS + Tailwind CSS + pnpm Guidelines

## Core Philosophy

- Write **clean**, **reusable**, and **high-performance** React-TS code with TailwindCSS, using **pnpm/npm**.
- **DRY-compliant**: Eliminate redundancy; prefer reusable components and utilities.
- **Bug-resistant & predictable**: Warn about edge cases; suggest error-handling strategies.
- **Unit-test friendly**: Ensure **90%+ test coverage** (e.g., Jest + React Testing Library).
- **Documentation-oriented**: Use JSDoc comments and occasional emojis to improve clarity.
- **Component-aware**: Check for existing components before creating new ones.

## React Component Development Guidelines

- Fully type props (`type Props = { ... }`) with default values when applicable.
- Optimize performance: Use `useMemo`, `useCallback`, and `React.memo` judiciously.
- Minimize unnecessary re-renders.
- Prefer React’s native state and hooks; avoid unnecessary external state libs when possible.

don't use type any or type unknown
