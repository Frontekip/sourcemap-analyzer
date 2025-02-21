# React Native Error Source Map Analyzer

This project helps developers analyze and debug React Native errors by providing source map analysis capabilities.

## Prerequisites

- Docker installed on your system
- React Native project with source maps

## Getting Started

1. Pull the Docker image:
```bash
docker pull yasaricli/sourcemap-analyzer
```

2. Run the analyzer:
```bash
docker run -p 3000:3000 yasaricli/sourcemap-analyzer
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/yasaricli/sourcemap-analyzer.git
cd sourcemap-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build Docker image locally:
```bash
docker build -t sourcemap-analyzer .
```

5. Run locally built image:
```bash
docker run -p 3000:3000 sourcemap-analyzer
```

## Usage

1. Upload your React Native source map file
2. Paste the error stack trace
3. View the analyzed results with proper file names and line numbers

## Features

- Source map analysis for React Native errors
- Stack trace mapping for Firebase Crashlytics error reports
- Line number and column mapping
- Original source code viewing
- Easily analyze and debug minified production crashes from Crashlytics
- Precise error location identification in your original source code

## Why Use This?

This tool is particularly useful when dealing with Firebase Crashlytics crash reports. When your React Native app crashes in production, Crashlytics provides minified stack traces that are hard to read. This analyzer helps you:

- Decode minified stack traces from Crashlytics
- Locate exact file, line, and column in your original source code
- Save time in debugging production issues
- Better understand crash patterns in your production app

## License

MIT
