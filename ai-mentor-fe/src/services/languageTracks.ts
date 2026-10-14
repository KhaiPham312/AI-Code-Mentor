export interface LanguageOption {
  id: string;
  label: string;
  filename: string;
  monacoLang: string;
  starterCode: string;
}

// 1. Algorithms, Data Structures, Mathematics (21 HackerRank languages)
export const ALGORITHMS_LANGUAGES: LanguageOption[] = [
  {
    id: 'cpp17',
    label: 'C++17',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'c',
    label: 'C',
    filename: 'solution.c',
    monacoLang: 'c',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp11',
    label: 'C++11',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp14',
    label: 'C++14',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp20',
    label: 'C++20',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <ranges>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'csharp',
    label: 'C#',
    filename: 'Solution.cs',
    monacoLang: 'csharp',
    starterCode: `using System;

class Solution {
    static void Main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    }
}
`,
  },
  {
    id: 'go',
    label: 'Go',
    filename: 'solution.go',
    monacoLang: 'go',
    starterCode: `package main

import "fmt"

func main() {
    // Enter your code here. Read input from STDIN. Print output to STDOUT
    fmt.Println()
}
`,
  },
  {
    id: 'haskell',
    label: 'Haskell',
    filename: 'solution.hs',
    monacoLang: 'haskell',
    starterCode: `module Main where

main :: IO ()
main = do
    -- Enter your code here. Read input from STDIN. Print output to STDOUT
    putStrLn ""
`,
  },
  {
    id: 'java8',
    label: 'Java 8',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
  {
    id: 'java15',
    label: 'Java 15',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
  {
    id: 'java17',
    label: 'Java 17',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
  {
    id: 'javascript',
    label: 'JavaScript (Node.js)',
    filename: 'solution.js',
    monacoLang: 'javascript',
    starterCode: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8');
    // Enter your code here. Read input from STDIN. Print output to STDOUT
}

main();
`,
  },
  {
    id: 'kotlin',
    label: 'Kotlin',
    filename: 'Solution.kt',
    monacoLang: 'kotlin',
    starterCode: `import java.util.Scanner

fun main(args: Array<String>) {
    val scanner = Scanner(System.\`in\`)
    // Enter your code here. Read input from STDIN. Print output to STDOUT
}
`,
  },
  {
    id: 'php',
    label: 'PHP',
    filename: 'solution.php',
    monacoLang: 'php',
    starterCode: `<?php
// Enter your code here. Read input from STDIN. Print output to STDOUT
?>
`,
  },
  {
    id: 'pypy3',
    label: 'PyPy 3',
    filename: 'solution.py',
    monacoLang: 'python',
    starterCode: `import sys

def main():
    # Enter your code here. Read input from STDIN. Print output to STDOUT
    pass

if __name__ == '__main__':
    main()
`,
  },
  {
    id: 'python3',
    label: 'Python 3',
    filename: 'solution.py',
    monacoLang: 'python',
    starterCode: `import sys

def main():
    # Enter your code here. Read input from STDIN. Print output to STDOUT
    pass

if __name__ == '__main__':
    main()
`,
  },
  {
    id: 'ruby',
    label: 'Ruby',
    filename: 'solution.rb',
    monacoLang: 'ruby',
    starterCode: `# Enter your code here. Read input from STDIN. Print output to STDOUT
`,
  },
  {
    id: 'rust',
    label: 'Rust',
    filename: 'solution.rs',
    monacoLang: 'rust',
    starterCode: `use std::io::{self, BufRead};

fn main() {
    // Enter your code here. Read input from STDIN. Print output to STDOUT
}
`,
  },
  {
    id: 'scala',
    label: 'Scala',
    filename: 'Solution.scala',
    monacoLang: 'scala',
    starterCode: `object Solution {
    def main(args: Array[String]) {
        // Enter your code here. Read input from STDIN. Print output to STDOUT
    }
}
`,
  },
  {
    id: 'swift',
    label: 'Swift',
    filename: 'solution.swift',
    monacoLang: 'swift',
    starterCode: `import Foundation

// Enter your code here. Read input from STDIN. Print output to STDOUT
`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    filename: 'solution.ts',
    monacoLang: 'typescript',
    starterCode: `import * as fs from 'fs';

function main(): void {
    const input = fs.readFileSync(0, 'utf-8');
    // Enter your code here. Read input from STDIN. Print output to STDOUT
}

main();
`,
  },
];

// 2. SQL & Databases (6 HackerRank engines)
export const SQL_LANGUAGES: LanguageOption[] = [
  {
    id: 'mysql',
    label: 'MySQL',
    filename: 'solution.sql',
    monacoLang: 'sql',
    starterCode: `/* Enter your MySQL query here */
SELECT *
FROM Students;
`,
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    filename: 'solution.sql',
    monacoLang: 'sql',
    starterCode: `/* Enter your PostgreSQL query here */
SELECT *
FROM Students;
`,
  },
  {
    id: 'mssql',
    label: 'MS SQL Server',
    filename: 'solution.sql',
    monacoLang: 'sql',
    starterCode: `/* Enter your T-SQL query here */
SELECT *
FROM Students;
`,
  },
  {
    id: 'oracle',
    label: 'Oracle (PL/SQL enabled)',
    filename: 'solution.sql',
    monacoLang: 'sql',
    starterCode: `/* Enter your Oracle PL/SQL query here */
SELECT *
FROM Students;
`,
  },
  {
    id: 'db2',
    label: 'DB2',
    filename: 'solution.sql',
    monacoLang: 'sql',
    starterCode: `/* Enter your IBM DB2 query here */
SELECT *
FROM Students;
`,
  },
  {
    id: 'sqlite',
    label: 'SQLite',
    filename: 'solution.sql',
    monacoLang: 'sql',
    starterCode: `/* Enter your SQLite query here */
SELECT *
FROM Students;
`,
  },
];

// 3. C++ Track (5 HackerRank C++ versions)
export const CPP_LANGUAGES: LanguageOption[] = [
  {
    id: 'cpp17',
    label: 'C++17',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp11',
    label: 'C++11',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp14',
    label: 'C++14',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp20',
    label: 'C++20',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <ranges>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'cpp23',
    label: 'C++23 (GCC 13.2)',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <print>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
];

// 4. C Track (4 versions)
export const C_LANGUAGES: LanguageOption[] = [
  {
    id: 'c_gcc',
    label: 'C (GCC 11.4)',
    filename: 'solution.c',
    monacoLang: 'c',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'c99',
    label: 'C99 (GCC)',
    filename: 'solution.c',
    monacoLang: 'c',
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'c11',
    label: 'C11 (Clang 14)',
    filename: 'solution.c',
    monacoLang: 'c',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
  {
    id: 'c17',
    label: 'C17 (GCC)',
    filename: 'solution.c',
    monacoLang: 'c',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}
`,
  },
];

// 5. Python & AI Track (4 versions)
export const PYTHON_LANGUAGES: LanguageOption[] = [
  {
    id: 'py311',
    label: 'Python 3 (3.11)',
    filename: 'solution.py',
    monacoLang: 'python',
    starterCode: `import sys

def main():
    # Enter your code here. Read input from STDIN. Print output to STDOUT
    pass

if __name__ == '__main__':
    main()
`,
  },
  {
    id: 'py310',
    label: 'Python 3 (3.10)',
    filename: 'solution.py',
    monacoLang: 'python',
    starterCode: `import sys

def main():
    # Enter your code here. Read input from STDIN. Print output to STDOUT
    pass

if __name__ == '__main__':
    main()
`,
  },
  {
    id: 'pypy3',
    label: 'PyPy 3',
    filename: 'solution.py',
    monacoLang: 'python',
    starterCode: `import sys

def main():
    # Enter your code here. Read input from STDIN. Print output to STDOUT
    pass

if __name__ == '__main__':
    main()
`,
  },
  {
    id: 'py_numpy',
    label: 'Python 3 (NumPy / SciPy)',
    filename: 'solution.py',
    monacoLang: 'python',
    starterCode: `import sys
import numpy as np

def solve():
    # Enter your AI / Data processing code here
    pass

if __name__ == '__main__':
    solve()
`,
  },
];

// 6. Java Track (4 versions)
export const JAVA_LANGUAGES: LanguageOption[] = [
  {
    id: 'java17',
    label: 'Java 17',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
  {
    id: 'java8',
    label: 'Java 8',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
  {
    id: 'java15',
    label: 'Java 15',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
  {
    id: 'java21',
    label: 'Java 21',
    filename: 'Solution.java',
    monacoLang: 'java',
    starterCode: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. */
    }
}
`,
  },
];

// 7. Linux Shell Track (4 tools)
export const LINUX_LANGUAGES: LanguageOption[] = [
  {
    id: 'bash',
    label: 'Bash',
    filename: 'solution.sh',
    monacoLang: 'shell',
    starterCode: `#!/bin/bash
# Enter your Bash script here
`,
  },
  {
    id: 'zsh',
    label: 'Zsh',
    filename: 'solution.zsh',
    monacoLang: 'shell',
    starterCode: `#!/bin/zsh
# Enter your Zsh script here
`,
  },
  {
    id: 'awk',
    label: 'Awk',
    filename: 'solution.awk',
    monacoLang: 'shell',
    starterCode: `#!/usr/bin/awk -f
# Enter your Awk script here
{
    print $0
}
`,
  },
  {
    id: 'sed',
    label: 'Sed',
    filename: 'solution.sed',
    monacoLang: 'shell',
    starterCode: `# Enter your Sed script here
s/foo/bar/g
`,
  },
];

// 8. Functional Programming Track (7 languages)
export const FP_LANGUAGES: LanguageOption[] = [
  {
    id: 'haskell_ghc',
    label: 'Haskell (GHC 9.4)',
    filename: 'solution.hs',
    monacoLang: 'haskell',
    starterCode: `module Main where

main :: IO ()
main = do
    -- Enter your code here. Read input from STDIN. Print output to STDOUT
    putStrLn ""
`,
  },
  {
    id: 'clojure',
    label: 'Clojure',
    filename: 'solution.clj',
    monacoLang: 'clojure',
    starterCode: `(ns solution)
;; Enter your Clojure code here
`,
  },
  {
    id: 'scala',
    label: 'Scala',
    filename: 'Solution.scala',
    monacoLang: 'scala',
    starterCode: `object Solution {
    def main(args: Array[String]) {
        // Enter your code here. Read input from STDIN. Print output to STDOUT
    }
}
`,
  },
  {
    id: 'erlang',
    label: 'Erlang',
    filename: 'solution.erl',
    monacoLang: 'erlang',
    starterCode: `-module(solution).
-export([main/0]).

main() ->
    ok.
`,
  },
  {
    id: 'elixir',
    label: 'Elixir',
    filename: 'solution.ex',
    monacoLang: 'elixir',
    starterCode: `defmodule Solution do
  def main do
    # Enter your Elixir code here
  end
end
`,
  },
  {
    id: 'ocaml',
    label: 'OCaml',
    filename: 'solution.ml',
    monacoLang: 'ocaml',
    starterCode: `(* Enter your OCaml code here *)
let () =
  print_endline ""
`,
  },
  {
    id: 'fsharp',
    label: 'F#',
    filename: 'solution.fs',
    monacoLang: 'fsharp',
    starterCode: `open System

[<EntryPoint>]
let main argv =
    // Enter your F# code here
    0
`,
  },
];

export interface CourseTrackConfig {
  id: string;
  name: string;
  options: LanguageOption[];
  defaultLangLabel: string;
}

export const CANONICAL_COURSES: CourseTrackConfig[] = [
  {
    id: 'algorithms',
    name: 'Thuật toán (Algorithms)',
    options: ALGORITHMS_LANGUAGES,
    defaultLangLabel: 'C++17',
  },
  {
    id: 'data-structures',
    name: 'Cấu trúc dữ liệu (Data Structures)',
    options: ALGORITHMS_LANGUAGES,
    defaultLangLabel: 'C++17',
  },
  {
    id: 'mathematics',
    name: 'Toán học (Mathematics)',
    options: ALGORITHMS_LANGUAGES,
    defaultLangLabel: 'Python 3',
  },
  {
    id: 'ai',
    name: 'Trí tuệ nhân tạo (AI)',
    options: PYTHON_LANGUAGES,
    defaultLangLabel: 'Python 3 (NumPy / SciPy)',
  },
  {
    id: 'c',
    name: 'Lập trình C (C Language)',
    options: C_LANGUAGES,
    defaultLangLabel: 'C (GCC 11.4)',
  },
  {
    id: 'cpp',
    name: 'Lập trình C++ (C++)',
    options: CPP_LANGUAGES,
    defaultLangLabel: 'C++17',
  },
  {
    id: 'java',
    name: 'Lập trình Java (Java)',
    options: JAVA_LANGUAGES,
    defaultLangLabel: 'Java 17',
  },
  {
    id: 'python',
    name: 'Lập trình Python (Python)',
    options: PYTHON_LANGUAGES,
    defaultLangLabel: 'Python 3 (3.11)',
  },
  {
    id: 'sql',
    name: 'Cơ sở dữ liệu SQL (SQL)',
    options: SQL_LANGUAGES,
    defaultLangLabel: 'PostgreSQL',
  },
  {
    id: 'databases',
    name: 'Hệ cơ sở dữ liệu (Databases)',
    options: SQL_LANGUAGES,
    defaultLangLabel: 'MySQL',
  },
  {
    id: 'linux-shell',
    name: 'Hệ điều hành Linux (Linux Shell)',
    options: LINUX_LANGUAGES,
    defaultLangLabel: 'Bash',
  },
  {
    id: 'functional-programming',
    name: 'Lập trình hàm (Functional Programming)',
    options: FP_LANGUAGES,
    defaultLangLabel: 'Haskell (GHC 9.4)',
  },
];

/**
 * Resolve language options for an exercise based on its trackIds, category, or language
 */
export function getLanguageOptionsForContext(
  courseOrTrackId?: string,
  category?: string,
  exerciseLang?: string,
  trackIds?: string[]
): LanguageOption[] {
  const normalizedId = (courseOrTrackId || '').toLowerCase().trim();
  const normalizedCat = (category || '').toLowerCase().trim();
  const tracks = (trackIds || []).map((t) => t.toLowerCase().trim());

  // Check SQL first
  if (
    normalizedId.includes('sql') ||
    normalizedId.includes('database') ||
    normalizedCat.includes('sql') ||
    normalizedCat.includes('database') ||
    tracks.includes('sql') ||
    tracks.includes('databases') ||
    exerciseLang === 'sql'
  ) {
    return SQL_LANGUAGES;
  }

  // Check C++
  if (
    normalizedId === 'cpp' ||
    normalizedId.includes('c++') ||
    normalizedCat.includes('c++') ||
    (tracks.includes('cpp') && !tracks.includes('algorithms')) ||
    exerciseLang === 'cpp'
  ) {
    // If it's specifically C++ track, return C++ options.
    // However, if it's an algorithm problem that supports C++, return ALGORITHMS_LANGUAGES
    if (
      tracks.includes('algorithms') ||
      tracks.includes('data-structures') ||
      tracks.includes('mathematics')
    ) {
      return ALGORITHMS_LANGUAGES;
    }
    return CPP_LANGUAGES;
  }

  // Check C
  if (
    normalizedId === 'c' ||
    normalizedCat.includes('c language') ||
    normalizedCat.includes('lập trình c ') ||
    (tracks.includes('c') && !tracks.includes('algorithms')) ||
    exerciseLang === 'c'
  ) {
    if (
      tracks.includes('algorithms') ||
      tracks.includes('data-structures')
    ) {
      return ALGORITHMS_LANGUAGES;
    }
    return C_LANGUAGES;
  }

  // Check Linux Shell
  if (
    normalizedId.includes('linux') ||
    normalizedId.includes('shell') ||
    normalizedCat.includes('linux') ||
    normalizedCat.includes('shell') ||
    tracks.includes('linux-shell') ||
    exerciseLang === 'bash'
  ) {
    return LINUX_LANGUAGES;
  }

  // Check Functional Programming
  if (
    normalizedId.includes('func') ||
    normalizedId === 'fp' ||
    normalizedCat.includes('hàm') ||
    tracks.includes('fp')
  ) {
    return FP_LANGUAGES;
  }

  // Check Java
  if (
    normalizedId === 'java' ||
    normalizedCat.includes('java') ||
    (tracks.includes('java') && !tracks.includes('algorithms')) ||
    exerciseLang === 'java'
  ) {
    if (tracks.includes('algorithms') || tracks.includes('data-structures')) {
      return ALGORITHMS_LANGUAGES;
    }
    return JAVA_LANGUAGES;
  }

  // Check Python / AI
  if (
    normalizedId === 'ai' ||
    normalizedCat.includes('trí tuệ nhân tạo') ||
    tracks.includes('ai')
  ) {
    return PYTHON_LANGUAGES;
  }

  if (
    normalizedId === 'python' ||
    normalizedCat.includes('lập trình python') ||
    (tracks.includes('python') && !tracks.includes('algorithms') && !tracks.includes('data-structures'))
  ) {
    return PYTHON_LANGUAGES;
  }

  // Default to Algorithms / Data Structures (Full 21 languages)
  return ALGORITHMS_LANGUAGES;
}

/**
 * Find best matching default language option for an exercise
 */
export function getInitialOptionForExercise(
  options: LanguageOption[],
  exerciseLang: string = 'python',
  _boilerplateCode: string = ''
): LanguageOption {
  const normLang = exerciseLang.toLowerCase().trim();

  // Try exact label match or ID prefix match
  if (normLang === 'cpp' || normLang === 'c++') {
    return (
      options.find((o) => o.id === 'cpp17') ||
      options.find((o) => o.monacoLang === 'cpp') ||
      options[0]
    );
  }
  if (normLang === 'c') {
    return (
      options.find((o) => o.id === 'c_gcc') ||
      options.find((o) => o.id === 'c') ||
      options.find((o) => o.monacoLang === 'c') ||
      options[0]
    );
  }
  if (normLang === 'java') {
    return (
      options.find((o) => o.id === 'java17') ||
      options.find((o) => o.monacoLang === 'java') ||
      options[0]
    );
  }
  if (normLang === 'sql') {
    return (
      options.find((o) => o.id === 'postgresql') ||
      options.find((o) => o.monacoLang === 'sql') ||
      options[0]
    );
  }
  if (normLang === 'bash' || normLang === 'shell') {
    return (
      options.find((o) => o.id === 'bash') ||
      options.find((o) => o.monacoLang === 'shell') ||
      options[0]
    );
  }
  if (normLang === 'python' || normLang === 'py') {
    return (
      options.find((o) => o.id === 'py311') ||
      options.find((o) => o.id === 'python3') ||
      options.find((o) => o.monacoLang === 'python') ||
      options[0]
    );
  }

  // Fallback to first
  return options[0];
}
