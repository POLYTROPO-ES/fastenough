# 01 Vite React TypeScript Cloudflare Baseline

- Status: accepted
- Date: 2026-03-22

## Context
New repositories need a repeatable starter to reduce setup time and improve reliability.

## Decision
Use Vite + React + TypeScript as default frontend baseline and Cloudflare Pages + Functions as hosting and edge runtime baseline.

## Rationale
- Fast local development
- Strong TypeScript support
- Easy static and edge deployment
- Good compatibility with modern testing tooling

## Consequences
- Project can be cloned and used immediately with consistent scripts and documentation.
- CI and deployment paths are defined from day one.
