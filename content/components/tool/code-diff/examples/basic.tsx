"use client"

import { CodeDiff } from "@/components/ui/tool-code-diff"

const oldCode = `function greet(name: string): string {
  return "Hello, " + name + "!";
}

function add(a: number, b: number): number {
  return a + b;
}

// Legacy implementation
function fetchData(url: string) {
  return fetch(url).then(res => res.json());
}`

const newCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

function add(a: number, b: number): number {
  return a + b;
}

// Modern async implementation
async function fetchData(url: string) {
  const res = await fetch(url);
  return res.json();
}

function multiply(a: number, b: number): number {
  return a * b;
}`

export default function Demo() {
  return (
    <CodeDiff
      id="demo-basic-diff"
      oldCode={oldCode}
      newCode={newCode}
      language="typescript"
      filename="utils.ts"
      maxCollapsedLines={30}
    />
  )
}
