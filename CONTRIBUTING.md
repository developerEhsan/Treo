# Contributing to Treo

Thank you for your interest in contributing to Treo! This project is an Electron-based Windows application built with modern web technologies. We appreciate contributions of all kinds, including bug fixes, feature implementations, documentation improvements, and performance optimizations.

## Getting Started

### Fork & Clone the Repository

To contribute, follow these steps:

1. Fork the repository by clicking the **Fork** button on the repository page.
2. Clone your forked repository:
   ```sh
   git clone https://github.com/Your-Ehsan/Treo.git
   cd Treo
   ```

### Install Dependencies

We use `pnpm` as our package manager. If you haven't installed it globally yet, run:

```sh
npm install -g pnpm
```

Then install the project dependencies:

```sh
pnpm install
```

### Running the Development Server

To start the development environment, run:

```sh
pnpm dev
```

## Building the Application

Currently, the build process supports **Windows** only. To build the application, execute:

```sh
pnpm build:win
```

## Database Migrations

If you make changes to the database schema, generate a new migration using:

```sh
pnpm db:generate
```

## Technology Stack

This project is built using the following technologies:

- **TypeScript** - Ensures type safety and maintainability.
- **Electron** - Enables cross-platform desktop application development (Windows-focused).
- **TanStack Router** - A powerful routing solution for modern applications.
- **TanStack Query** - Efficiently manages server-state and data fetching.
- **Zustand** - A minimalistic and flexible state management library.
- **Drizzle ORM** - A type-safe SQL-based ORM for database management.
- **Better-SQLite3** - A high-performance SQLite database library.
- **shadcn/ui** - A collection of pre-styled, accessible UI components.

## Contribution Guidelines

To ensure a smooth contribution process, please follow these guidelines:

- Adhere to the existing code style and project conventions.
- Write clear and descriptive commit messages.
- Include appropriate documentation for any new features or changes.
- Add tests where applicable to maintain code quality and stability.
- Open an issue before implementing significant changes to discuss feasibility and approach.
- Ensure compatibility with the existing codebase before submitting changes.

## Pull Request Process

1. Create a feature branch from `main`:
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. Implement your changes and commit them:
   ```sh
   git commit -m "feat: add feature-name"
   ```
3. Push your changes to your fork:
   ```sh
   git push origin feature/your-feature-name
   ```
4. Open a **Pull Request (PR)** against the `main` branch of the original repository.
5. Mention the correct issue number in the PR description to help maintainers track changes easily.
6. Include a **recording or screenshot** demonstrating the feature or bug fix in action, if applicable.
7. Address any feedback or requested changes from maintainers promptly.

## Code of Conduct

Please follow our [Code of Conduct](https://www.contributor-covenant.org/) to maintain a professional and inclusive environment.

## Additional Contribution Guidelines

- **Bug Reports**: If you encounter a bug, open an issue with a clear description and steps to reproduce.
- **Feature Requests**: Suggest improvements or new features via an issue.
- **Security Issues**: Report vulnerabilities privately to maintainers before disclosure.
- **Documentation Updates**: Improve clarity and completeness by updating existing documentation.

## Need Help?

If you have any questions, feel free to open an issue or start a discussion. We appreciate your contributions and look forward to collaborating with you!

Happy coding! 🚀
