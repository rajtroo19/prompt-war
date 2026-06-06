# Contributing to MindPrep

Thank you for your interest in contributing to MindPrep! This project aims to support the mental wellness of Indian students preparing for competitive exams.

## Development Setup

```bash
git clone https://github.com/rajtroo19/prompt-war.git
cd prompt-war
npm install
cp .env.example .env.local
npm run dev
```

## Code Standards

- **TypeScript**: Strict mode enabled. No `any` types unless absolutely necessary.
- **Components**: PascalCase for component files. One component per file.
- **Variables**: camelCase for variables and functions.
- **CSS**: Use CSS custom properties from `globals.css`. Avoid arbitrary inline colors.
- **Accessibility**: All buttons must have `aria-label`. All inputs must have labels.
- **No console.log**: Remove all debugging logs before committing.

## Testing

```bash
npm test
```

All new features should include tests. Aim for coverage of core logic functions.

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Write tests for your changes
4. Ensure `npm run build` passes with zero errors
5. Ensure `npm run lint` passes with zero warnings
6. Submit a pull request with a clear description

## Architecture Decisions

- **localStorage**: All data is stored client-side. No backend needed.
- **API Routes**: Only used for proxying to Claude API (server-side secrets).
- **Rate Limiting**: In-memory rate limiter on API routes.
- **Dynamic Imports**: Heavy components (charts, exercises) are lazy-loaded.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
