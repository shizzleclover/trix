<div align="center">
  <h1>🚀 TRIX</h1>
  <p><strong>Universal Project Generator for Modern Web Applications</strong></p>

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo/trix)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-repo/trix/pulls)
</div>

---

Trix is a powerful, interactive CLI tool designed to help developers bootstrap full-stack applications in seconds. It provides a curated selection of frameworks, libraries, and modules, all perfectly configured to work together.

## ✨ Key Features

- ⚛️ **Framework Diversity**: Choose from React, Vue 3, Svelte, Express, Fastify, and NestJS.
- 🎨 **Modern Styling**: Out-of-the-box support for Tailwind CSS, shadcn/ui, and more.
- 🔐 **Auth Ready**: Integrated authentication with Clerk, Privy, or custom JWT.
- � **Data Power**: Easily set up PostgreSQL, MySQL, or MongoDB with Prisma or Mongoose.
- 🎯 **TypeScript First**: Every single template is built with TypeScript performance and safety in mind.
- 📦 **Multi-Manager**: Works seamlessly with npm, yarn, pnpm, and bun.

## 🛠 Supported Tech Stack

### 🖼️ Frontend
- **Frameworks**: React, Vue 3, Svelte 4
- **Styling**: Tailwind CSS, shadcn/ui, DaisyUI
- **State**: Zustand, Redux Toolkit
- **API**: TanStack Query, Axios, SWR

### 🏗️ Backend
- **Runtimes**: Node.js, Bun
- **Frameworks**: Express, Fastify, NestJS
- **Database**: PostgreSQL, MySQL, MongoDB
- **ORM**: Prisma, Drizzle, Mongoose

---

## 🚀 Quick Start

Get your project up and running in minutes:

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/trix.git
cd trix

# 2. Install and build
npm install
npm run build

# 3. Link globally
npm link

# 4. Generate your project!
create-trix
```

## 📖 Usage

### Interactive Mode (Recommended)
Simply run `create-trix` and follow the beautiful terminal prompts to curate your stack.

```bash
create-trix
```

### Quick Project Creation
Skip the initial name prompt by providing it as an argument:

```bash
create-trix my-new-app
```

---

## 🏗 Project Structure

- `src/core/` - Core CLI logic & configuration builder.
- `src/prompts/` - Interactive user experience.
- `templates/` - Curated project templates (Handlebars).
- `src/generators/` - File generation and code injection logic.
- `src/installers/` - Dependency installation & package manager handling.

## 🧪 Development

### Running Tests
```bash
npm test
```

### Building
```bash
npm run build
```

## 🤝 Contributing

We welcome contributions! Whether it's a new template, a bug fix, or a feature request, feel free to open an issue or submit a PR.

1. **Fork** the repo
2. **Clone** your fork
3. **Commit** your changes
4. **Push** to your branch
5. **Open** a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ for developers by developers.</p>
</div>
