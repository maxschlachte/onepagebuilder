#!/usr/bin/env python3
"""
find_bracket_labels.py

Scan a directory (recursively) for .ts files containing object-literal
entries with a "label" field whose value has a parenthesized part, e.g.:

    { label: "Ironfist", cost: 20, adds: ["Armored"] }
    { label: "Vulture (Ignores Cover)", cost: 10,
      addEquipment: [customWeapon("Vulture", { range: 36, attacks: "1",
                                                rules: rules("Ignores Cover") })] }

For each such entry, extracts the text inside the parentheses in the label
(e.g. "Armored", "Ignores Cover") and checks whether that exact string also
appears inside an `adds` array or a `rules` field/call within the same
enclosing object (i.e. the full entry, including any nested calls).

Usage:
    python3 find_bracket_labels.py <directory>
"""

import os
import re
import sys

LABEL_RE = re.compile(r'label\s*:\s*"([^"]*)"')


def extract_first_bracket(label_value):
    """
    Return the text inside the FIRST top-level parenthesis group in the
    label, matching nested parentheses correctly.

    e.g. "Test (Wizard(1))" -> "Wizard(1)", not "1".
    """
    start = label_value.find('(')
    if start == -1:
        return None

    depth = 0
    for i in range(start, len(label_value)):
        c = label_value[i]
        if c == '(':
            depth += 1
        elif c == ')':
            depth -= 1
            if depth == 0:
                return label_value[start + 1:i]
    return None  # unbalanced parentheses


def find_enclosing_object(text, label_pos):
    """
    Given the position of the 'label' keyword match, find the enclosing
    top-level object literal '{ ... }' that contains it, by scanning
    backwards to the nearest unmatched '{' and then forward to its
    matching '}'.
    """
    # Scan backwards to find the '{' that opens the object containing label_pos.
    depth = 0
    start = None
    i = label_pos
    while i >= 0:
        c = text[i]
        if c == '}':
            depth += 1
        elif c == '{':
            if depth == 0:
                start = i
                break
            depth -= 1
        i -= 1
    if start is None:
        return None

    # Scan forward from start to find the matching closing brace.
    depth = 0
    j = start
    n = len(text)
    while j < n:
        c = text[j]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return text[start:j + 1]
        j += 1
    return None


def analyze_file(path):
    """Return a list of result dicts for a given file."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
    except (UnicodeDecodeError, OSError):
        return []

    results = []
    for m in LABEL_RE.finditer(text):
        label_value = m.group(1)
        bracket_text = extract_first_bracket(label_value)
        if bracket_text is None:
            continue  # label has no parenthesized part, skip

        bracket_text = bracket_text.strip()

        entry_block = find_enclosing_object(text, m.start())
        if entry_block is None:
            entry_block = ""

        found_in_adds = False
        found_in_rules = False

        adds_match = re.search(r'\badds\s*:\s*\[([^\]]*)\]', entry_block)
        if adds_match and bracket_text in adds_match.group(1):
            found_in_adds = True

        # Covers both `rules: rules("Ignores Cover")` and `rules("Ignores Cover")`
        rules_match = re.search(r'\brules\s*(?::\s*rules)?\s*\(([^)]*)\)', entry_block)
        if rules_match and bracket_text in rules_match.group(1):
            found_in_rules = True

        results.append({
            "label": label_value,
            "bracket_text": bracket_text,
            "in_adds": found_in_adds,
            "in_rules": found_in_rules,
        })

    return results


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <directory>")
        sys.exit(1)

    root_dir = sys.argv[1]
    if not os.path.isdir(root_dir):
        print(f"Error: '{root_dir}' is not a directory.")
        sys.exit(1)

    any_found = False

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in sorted(filenames):
            if not filename.endswith(".ts"):
                continue

            file_path = os.path.join(dirpath, filename)
            results = analyze_file(file_path)
            if not results:
                continue

            any_found = True
            print(file_path)
            for r in results:
                if r["in_adds"] and r["in_rules"]:
                    note = f'"{r["bracket_text"]}" found in adds AND rules'
                elif r["in_adds"]:
                    note = f'"{r["bracket_text"]}" found in adds'
                elif r["in_rules"]:
                    note = f'"{r["bracket_text"]}" found in rules'
                else:
                    note = f'"{r["bracket_text"]}" NOT found in adds or rules'
                print(f'  - {r["label"]}: {note}')
            print()

    if not any_found:
        print("No matching labels with bracketed text found.")


if __name__ == "__main__":
    main()

