/**
 * English Translations for All Exercises (HackerRank & LeetCode Standard)
 * Auto-generated and verified for zero layout shift and 100% English parity.
 */
import { Exercise } from '../types/exercise';
import { Language } from '../components/dashboard/dashboardI18n';

export interface ExerciseEnTranslation {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  category?: string;
  sampleExplanations?: string[];
}

export const EXERCISE_EN: Record<number, ExerciseEnTranslation> = {
  "1": {
    "title": "Find Prime Numbers in Array",
    "category": "Arrays & Math",
    "description": "Given an integer array `arr`, write a function `find_primes(arr)` to find and return a new array containing all prime numbers present in `arr`, preserving their original order of appearance.\n\nA positive integer $n > 1$ is a prime number if its only positive divisors are 1 and itself.",
    "inputFormat": "An integer array `arr` (e.g., `[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`)",
    "outputFormat": "List of prime numbers found in `arr` (e.g., `[2, 3, 5, 7, 11]`)",
    "sampleExplanations": [
      "The prime numbers found are 2, 3, 5, 7, 11."
    ]
  },
  "2": {
    "title": "Valid Parentheses",
    "category": "Stack",
    "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "inputFormat": "A string `s` consisting of parentheses",
    "outputFormat": "Boolean value `True` if valid, otherwise `False`",
    "sampleExplanations": [
      "All bracket pairs are properly matched and closed in the correct order."
    ]
  },
  "3": {
    "title": "Two Sum",
    "category": "Arrays & Hash Table",
    "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer sorted by index in ascending order.",
    "inputFormat": "An integer array `nums` and target integer `target`",
    "outputFormat": "A list of two integer indices `[i, j]`",
    "sampleExplanations": [
      "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]."
    ]
  },
  "4": {
    "title": "Reverse Words in a String",
    "category": "String",
    "description": "Given an input string `s`, reverse the order of the words.\n\nA word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.\n\nReturn a string of the words in reverse order concatenated by a single space, without leading or trailing spaces.",
    "inputFormat": "A string `s` containing words separated by spaces",
    "outputFormat": "A string with words reversed and normalized to single space delimiters",
    "sampleExplanations": [
      "Leading/trailing whitespace removed and words reversed in sequence."
    ]
  },
  "5": {
    "title": "Valid Palindrome",
    "category": "Two Pointers",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `True` if it is a palindrome, or `False` otherwise.",
    "inputFormat": "A string `s`",
    "outputFormat": "Boolean `True` or `False`",
    "sampleExplanations": [
      "\"amanaplanacanalpanama\" reads the same forward and backward."
    ]
  },
  "6": {
    "title": "Group Anagrams",
    "category": "Hash Map & String",
    "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "inputFormat": "An array of strings `strs`",
    "outputFormat": "A list of grouped anagram lists",
    "sampleExplanations": [
      "Words sharing the exact same sorted character counts are grouped together."
    ]
  },
  "7": {
    "title": "Longest Substring Without Repeating Characters",
    "category": "Sliding Window",
    "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
    "inputFormat": "A string `s`",
    "outputFormat": "An integer representing the maximum length of unique substring",
    "sampleExplanations": [
      "The answer is \"abc\", with the length of 3."
    ]
  },
  "8": {
    "title": "Bank Account Class Design (OOP)",
    "category": "Object-Oriented Programming (OOP)",
    "description": "Design a `BankAccount` class with methods to deposit, withdraw, and check balance.\n\nIf a withdrawal amount exceeds the current balance, raise an error or prevent the transaction and retain the current balance.",
    "inputFormat": "Initial account balance and a series of deposit/withdraw operations",
    "outputFormat": "Final account balance after all operations",
    "sampleExplanations": [
      "Balance increases by deposits and decreases by valid withdrawals."
    ]
  },
  "9": {
    "title": "N-th Fibonacci Number with Memoization",
    "category": "Dynamic Programming (DP)",
    "description": "Compute the $N$-th Fibonacci number using top-down Dynamic Programming with memoization or iterative DP to achieve $O(N)$ time complexity.\n\nRecall that $F(0) = 0, F(1) = 1$, and $F(n) = F(n-1) + F(n-2)$ for $n \\ge 2$.",
    "inputFormat": "A non-negative integer `n`",
    "outputFormat": "An integer representing $F(n)$",
    "sampleExplanations": [
      "F(10) = 55."
    ]
  },
  "10": {
    "title": "Coin Change Problem",
    "category": "Dynamic Programming (DP)",
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`. You may assume that you have an infinite number of each kind of coin.",
    "inputFormat": "An integer array `coins` and total integer `amount`",
    "outputFormat": "The minimum number of coins needed, or `-1` if impossible",
    "sampleExplanations": [
      "11 = 5 + 5 + 1 (3 coins)."
    ]
  },
  "11": {
    "title": "Reverse Array using Pointers",
    "category": "Pointers",
    "description": "In C programming, write a function `reverse_array(int* arr, int n)` that reverses an integer array in-place using two pointer arithmetic without allocating a secondary buffer.",
    "inputFormat": "An integer array `arr` and its length `n`",
    "outputFormat": "The array elements reversed in-place",
    "sampleExplanations": [
      "Elements swapped pairwise from ends towards center."
    ]
  },
  "12": {
    "title": "Find Minimum and Maximum Element",
    "category": "Pointers & Arrays",
    "description": "Write a C function to find the minimum and maximum elements in an array using pointer traversal with at most $1.5N$ comparisons.",
    "inputFormat": "An integer array `arr` and length `n`",
    "outputFormat": "Pair of minimum and maximum values `min = X, max = Y`",
    "sampleExplanations": [
      "The smallest element is 1 and the largest is 9."
    ]
  },
  "13": {
    "title": "Count Words in a String",
    "category": "String & Pointers",
    "description": "Given a C-style null-terminated string, count the number of words separated by one or more whitespace characters.",
    "inputFormat": "A character array `str`",
    "outputFormat": "Total integer count of words",
    "sampleExplanations": [
      "Whitespace sequences are treated as single separators."
    ]
  },
  "14": {
    "title": "Student Record Management with Struct",
    "category": "Structs",
    "description": "Define a `Student` struct containing `id`, `name`, and `gpa`. Implement a function to sort an array of students in descending order of GPA using `qsort`.",
    "inputFormat": "Array of student struct records",
    "outputFormat": "List of students sorted by descending GPA",
    "sampleExplanations": [
      "Students with higher GPA appear first in the sorted list."
    ]
  },
  "15": {
    "title": "Dynamic Memory Allocation with Malloc",
    "category": "Dynamic Memory",
    "description": "Dynamically allocate an array of $n$ integers using `malloc()`, compute their arithmetic mean, and safely release the memory using `free()` to prevent memory leaks.",
    "inputFormat": "Integer `n` followed by `n` integer values",
    "outputFormat": "Float arithmetic average of the elements",
    "sampleExplanations": [
      "Memory allocated dynamically and freed without leaks."
    ]
  },
  "16": {
    "title": "Reverse a Singly Linked List",
    "category": "Linked List",
    "description": "Given the `head` of a singly linked list, reverse the list in-place and return the reversed list's head pointer. Solve it iteratively in $O(N)$ time and $O(1)$ space.",
    "inputFormat": "Head node of a singly linked list `1 -> 2 -> 3 -> 4 -> 5`",
    "outputFormat": "Head node of the reversed list `5 -> 4 -> 3 -> 2 -> 1`",
    "sampleExplanations": [
      "Pointers flipped sequentially node by node."
    ]
  },
  "17": {
    "title": "Binary Search",
    "category": "Search Algorithms",
    "description": "Given an array of integers `arr` sorted in ascending order, and an integer `target`, write a function to search `target` in `arr`. If `target` exists, return its 0-based index. Otherwise, return `-1`. Must run in $O(\\log N)$ time.",
    "inputFormat": "Sorted array `arr` and integer `target`",
    "outputFormat": "0-based index of target, or `-1` if not found",
    "sampleExplanations": [
      "8 is found at index 2."
    ]
  },
  "18": {
    "title": "Square Matrix Multiplication",
    "category": "Matrices & Pointers",
    "description": "Implement matrix multiplication of two $N \\times N$ matrices $A$ and $B$, returning the product matrix $C = A \\times B$.",
    "inputFormat": "Two square matrices of dimension $N \\times N$",
    "outputFormat": "Product matrix $C$ of dimension $N \\times N$",
    "sampleExplanations": [
      "Row-by-column dot products computed for each cell."
    ]
  },
  "19": {
    "title": "Bitwise Manipulation - Hamming Weight",
    "category": "Bitwise Operations",
    "description": "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight). Solve in $O(k)$ where $k$ is the number of set bits using Brian Kernighan\\'s algorithm.",
    "inputFormat": "A positive integer `n`",
    "outputFormat": "Number of set bits (1s) in binary representation",
    "sampleExplanations": [
      "11 in binary is 1011, having 3 set bits."
    ]
  },
  "20": {
    "title": "QuickSort Algorithm",
    "category": "Sorting Algorithms",
    "description": "Implement the QuickSort algorithm in C using the Lomuto or Hoare partitioning scheme to sort an array in non-decreasing order in $O(N \\log N)$ expected time.",
    "inputFormat": "An unsorted array `arr` of size `n`",
    "outputFormat": "The array sorted in ascending order",
    "sampleExplanations": [
      "Array sorted partition by partition recursively."
    ]
  },
  "21": {
    "title": "Remove Duplicates with std::set",
    "category": "STL Containers",
    "description": "Given a `std::vector<int>`, eliminate all duplicate elements and return the unique elements in sorted ascending order using C++ STL `std::set`.",
    "inputFormat": "A vector of integers with potential duplicates",
    "outputFormat": "A sorted vector of distinct integers",
    "sampleExplanations": [
      "Duplicates 2 and 5 are eliminated and sorted."
    ]
  },
  "22": {
    "title": "Fraction Class Design",
    "category": "Classes & Operator Overloading",
    "description": "Design a C++ `Fraction` class representing rational numbers with numerator and denominator. Overload arithmetic operators (`+`, `-`, `*`, `/`) and auto-reduce fractions to lowest terms using GCD.",
    "inputFormat": "Two fractions e.g. 1/2 and 1/3",
    "outputFormat": "Simplified sum fraction 5/6",
    "sampleExplanations": [
      "1/2 + 1/3 = 5/6 in reduced form."
    ]
  },
  "23": {
    "title": "Breadth-First Search (BFS) on Graph",
    "category": "Graph Algorithms",
    "description": "Given an adjacency list representing an undirected graph with $V$ vertices and a starting vertex $s$, return the Breadth-First Search traversal order of the vertices.",
    "inputFormat": "Number of vertices $V$ and adjacency list",
    "outputFormat": "List of vertices visited in BFS order",
    "sampleExplanations": [
      "Vertices traversed layer by layer using a FIFO queue."
    ]
  },
  "24": {
    "title": "Dijkstra Shortest Path Algorithm",
    "category": "Graph Algorithms",
    "description": "Given a weighted directed graph with non-negative edge weights and a source vertex $s$, compute the shortest path distance from $s$ to all other vertices using a priority queue (min-heap).",
    "inputFormat": "Vertex count $V$, source $s$, and weighted edge list",
    "outputFormat": "Array of shortest distances from source to all vertices",
    "sampleExplanations": [
      "Greedy relaxation via min-heap yields optimal path distances."
    ]
  },
  "25": {
    "title": "Smart Pointers (std::unique_ptr)",
    "category": "Modern C++ Memory Management",
    "description": "Demonstrate RAII resource ownership and safe object lifetime using `std::unique_ptr` and ownership transfer with `std::move` to ensure deterministic memory deallocation.",
    "inputFormat": "Creation and ownership transfer of heap-allocated resource",
    "outputFormat": "Verification that resource is safely deallocated when leaving scope",
    "sampleExplanations": [
      "std::unique_ptr guarantees exactly one owner and frees memory automatically."
    ]
  },
  "26": {
    "title": "List Filtering with Java Stream API",
    "category": "Java Stream API",
    "description": "Given a list of strings, use the Java 8+ Stream API to filter words starting with the letter \\'A\\' (case-insensitive), convert them to uppercase, and collect them into a sorted list.",
    "inputFormat": "List of string elements",
    "outputFormat": "Filtered and uppercase-converted list",
    "sampleExplanations": [
      "[\"Apple\", \"Banana\", \"Ant\", \"Avocado\"] -> [\"APPLE\", \"AVOCADO\"]."
    ]
  },
  "27": {
    "title": "Thread-Safe Singleton Pattern",
    "category": "Design Patterns",
    "description": "Implement the Singleton design pattern in Java using Double-Checked Locking with a `volatile` instance variable to ensure thread-safety and high performance in multi-threaded environments.",
    "inputFormat": "Concurrent calls to `getInstance()` from multiple threads",
    "outputFormat": "Exactly one instance reference shared across all threads",
    "sampleExplanations": [
      "Double-checked locking guarantees only one instance is instantiated."
    ]
  },
  "28": {
    "title": "Binary Tree In-order Traversal",
    "category": "Binary Trees",
    "description": "Given the root of a binary tree, return the in-order traversal of its nodes\\' values (Left -> Root -> Right). Solve iteratively using an explicit Stack.",
    "inputFormat": "Root node of a binary tree",
    "outputFormat": "List of node values in in-order sequence",
    "sampleExplanations": [
      "In-order visits left subtree, root, then right subtree."
    ]
  },
  "29": {
    "title": "Find Student with Highest GPA",
    "category": "SQL Queries",
    "description": "Write a SQL query to retrieve the student(s) with the highest Grade Point Average (GPA) from the `Students` table.",
    "inputFormat": "Table `Students(id, name, gpa, major)`",
    "outputFormat": "Record(s) matching the maximum GPA in the table",
    "sampleExplanations": [
      "Returns the top-performing student record."
    ]
  },
  "30": {
    "title": "Student Count by Class Group",
    "category": "SQL Grouping & Aggregations",
    "description": "Write a SQL query using `GROUP BY` to count the total number of enrolled students in each class group, sorted in descending order of student count.",
    "inputFormat": "Tables `Classes(id, class_name)` and `Students(id, class_id)`",
    "outputFormat": "Result columns: `class_name`, `student_count`",
    "sampleExplanations": [
      "Aggregates student headcount per class."
    ]
  },
  "31": {
    "title": "Rank Students using DENSE_RANK()",
    "category": "SQL Window Functions",
    "description": "Write a SQL query using the window function `DENSE_RANK()` to rank students based on their GPA in descending order without skipping ranks for ties.",
    "inputFormat": "Table `Students(id, name, gpa)`",
    "outputFormat": "Columns: `id`, `name`, `gpa`, `rank_score`",
    "sampleExplanations": [
      "Students with identical GPA receive identical rank numbers."
    ]
  },
  "34": {
    "title": "Greatest Common Divisor (GCD) using Euclid Algorithm",
    "category": "Number Theory",
    "description": "Implement the Euclidean algorithm to find the Greatest Common Divisor (GCD) of two non-negative integers $a$ and $b$ in $O(\\log(\\min(a, b)))$ time.",
    "inputFormat": "Two integers `a` and `b`",
    "outputFormat": "Integer representing $\\gcd(a, b)$",
    "sampleExplanations": [
      "gcd(48, 18) = 6 because 48 = 18 * 2 + 12; gcd(18, 12) = 6."
    ]
  },
  "35": {
    "title": "Binary Exponentiation (a^b mod M)",
    "category": "Number Theory & Math",
    "description": "Compute $(a^b) \\pmod M$ in $O(\\log b)$ time using binary modular exponentiation (repeated squaring), preventing integer overflow for large exponents up to $10^{18}$.",
    "inputFormat": "Integers `a`, `b`, and modulus `M`",
    "outputFormat": "Integer value of $(a^b) \\bmod M$",
    "sampleExplanations": [
      "2^10 = 1024; 1024 % 1000 = 24."
    ]
  },
  "36": {
    "title": "Cosine Similarity between Vectors",
    "category": "Machine Learning & Math",
    "description": "Compute the cosine similarity between two numeric vectors $\\mathbf{A}$ and $\\mathbf{B}$ of dimension $D$:\n\n$$\\text{similarity}(\\mathbf{A}, \\mathbf{B}) = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|}$$",
    "inputFormat": "Two numeric vectors `A` and `B` of equal length",
    "outputFormat": "Cosine similarity score in range `[-1.0, 1.0]`",
    "sampleExplanations": [
      "Parallel collinear vectors have cosine similarity of 1.0."
    ]
  },
  "37": {
    "title": "K-Nearest Neighbors (KNN) Classifier",
    "category": "Machine Learning Algorithms",
    "description": "Implement the K-Nearest Neighbors (KNN) classification algorithm using Euclidean distance. Given a query point, find the $k$ closest labeled points in the training set and predict the majority class label.",
    "inputFormat": "Query point, labeled training dataset, and integer `k`",
    "outputFormat": "Predicted class label based on majority voting",
    "sampleExplanations": [
      "The majority label among the k closest neighbors is selected."
    ]
  },
  "41": {
    "title": "Sliding Window Maximum with Monotonic Deque",
    "category": "Data Structures & Deque",
    "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. Return the max sliding window values in $O(N)$ time using a monotonic double-ended queue (deque).",
    "inputFormat": "Array `nums` and sliding window size `k`",
    "outputFormat": "Array containing the maximum value for each window position",
    "sampleExplanations": [
      "Monotonic deque keeps track of candidate maximums in O(1) amortized time."
    ]
  },
  "42": {
    "title": "Merge K Sorted Lists with Min-Heap",
    "category": "Heaps & Priority Queue",
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it. Solve in $O(N \\log k)$ time using a Min-Heap.",
    "inputFormat": "Array of `k` sorted linked lists",
    "outputFormat": "A single merged sorted linked list",
    "sampleExplanations": [
      "Min-heap extracts the smallest node across all k list heads in O(log k)."
    ]
  },
  "43": {
    "title": "Trie (Prefix Tree) Implementation",
    "category": "Trie & String Search",
    "description": "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the `Trie` class with `insert`, `search`, and `startsWith` methods in $O(L)$ time per operation where $L$ is word length.",
    "inputFormat": "Sequence of Trie operations (`insert`, `search`, `startsWith`)",
    "outputFormat": "Boolean outcomes for search and prefix queries",
    "sampleExplanations": [
      "Searching prefixes and words traverses the tree character by character."
    ]
  },
  "44": {
    "title": "LRU Cache Design (Least Recently Used)",
    "category": "System Design & Data Structures",
    "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class with `get` and `put` operations in $O(1)$ average time complexity using a Hash Map and a Doubly Linked List.",
    "inputFormat": "Cache capacity and sequence of `get`/`put` operations",
    "outputFormat": "Retrieved values or `-1` if evicted or missing",
    "sampleExplanations": [
      "Least recently accessed key is evicted when capacity is reached."
    ]
  },
  "45": {
    "title": "Sieve of Eratosthenes - Prime Counting",
    "category": "Number Theory",
    "description": "Given an integer $n$, count and return all prime numbers strictly less than $n$ using the Sieve of Eratosthenes algorithm in $O(n \\log \\log n)$ time.",
    "inputFormat": "An integer `n`",
    "outputFormat": "Count of prime numbers less than `n`",
    "sampleExplanations": [
      "For n = 20, the primes are 2, 3, 5, 7, 11, 13, 17, 19 (total 8)."
    ]
  },
  "46": {
    "title": "Combinations nCr Modulo 10^9+7",
    "category": "Combinatorics & Fermat",
    "description": "Compute the binomial coefficient $\\binom{n}{r} \\pmod{10^9+7}$ for $1 \\le r \\le n \\le 10^5$. Use precomputed factorials and modular inverse via Fermat\\'s Little Theorem.",
    "inputFormat": "Integers `n` and `r` with modulus `1000000007`",
    "outputFormat": "Value of $\\binom{n}{r} \\bmod (10^9+7)$",
    "sampleExplanations": [
      "5C2 = 10 % 1000000007 = 10."
    ]
  },
  "47": {
    "title": "Prime Factorization",
    "category": "Number Theory",
    "description": "Given a positive integer $n$, find its prime factorization in the form $n = p_1^{a_1} \\cdot p_2^{a_2} \\cdots p_k^{a_k}$ where $p_i$ are distinct prime numbers sorted in ascending order.",
    "inputFormat": "An integer `n`",
    "outputFormat": "List of pairs `(prime, exponent)`",
    "sampleExplanations": [
      "360 = 2^3 * 3^2 * 5^1."
    ]
  },
  "48": {
    "title": "Polygon Area via Shoelace Formula",
    "category": "Computational Geometry",
    "description": "Given the coordinates of $n$ vertices of a simple non-self-intersecting polygon ordered counter-clockwise, compute its area using the Shoelace formula (Gauss\\'s area formula).",
    "inputFormat": "List of 2D vertex coordinate pairs `(x, y)`",
    "outputFormat": "Float polygon area rounded to 2 decimal places",
    "sampleExplanations": [
      "A 4x3 rectangle has area 12.0."
    ]
  },
  "49": {
    "title": "Catalan Numbers - Valid Binary Trees Count",
    "category": "Combinatorics & DP",
    "description": "Given an integer $n$, return the number of structurally unique Binary Search Trees (BST) that store values $1 \\dots n$. The result is given by the $n$-th Catalan number: $C_n = \\frac{1}{n+1} \\binom{2n}{n}$.",
    "inputFormat": "An integer `n`",
    "outputFormat": "The $n$-th Catalan number",
    "sampleExplanations": [
      "For n = 4, there are 14 structurally unique BSTs."
    ]
  },
  "50": {
    "title": "A* Pathfinding Algorithm on 2D Grid",
    "category": "AI & Graph Search",
    "description": "Implement the $A^*$ search algorithm on a 2D grid containing obstacles to find the shortest path from start to goal. Use Manhattan distance as the admissible heuristic $h(n)$.",
    "inputFormat": "2D grid, start coordinate, and goal coordinate",
    "outputFormat": "List of coordinate steps on the optimal path",
    "sampleExplanations": [
      "A* combines path cost g(n) and heuristic h(n) to find shortest path efficiently."
    ]
  },
  "51": {
    "title": "Minimax Algorithm with Alpha-Beta Pruning",
    "category": "Game Theory & AI",
    "description": "Implement the Minimax decision algorithm with Alpha-Beta pruning for an adversarial two-player zero-sum game (such as Tic-Tac-Toe). Prune branches that cannot influence the final decision.",
    "inputFormat": "Current game board state and search depth",
    "outputFormat": "Optimal heuristic evaluation score and best move",
    "sampleExplanations": [
      "Alpha-beta pruning eliminates subtrees without altering optimal choice."
    ]
  },
  "52": {
    "title": "Univariate Linear Regression with Gradient Descent",
    "category": "Machine Learning",
    "description": "Implement linear regression for single feature input using batch gradient descent to minimize Mean Squared Error (MSE). Update weight $w$ and bias $b$ iteratively until convergence.",
    "inputFormat": "Feature vector `X`, target vector `y`, learning rate, and epochs",
    "outputFormat": "Optimized parameters `(w, b)`",
    "sampleExplanations": [
      "Gradient descent updates w and b towards the global minimum of MSE."
    ]
  },
  "53": {
    "title": "K-Means Clustering on 2D Points",
    "category": "Unsupervised Learning",
    "description": "Implement K-Means clustering algorithm on 2D data points. Alternate between assigning points to the nearest cluster centroid (Voronoi partition) and updating centroids to the mean of their assigned points.",
    "inputFormat": "2D point dataset, cluster count `k`, and max iterations",
    "outputFormat": "Final coordinates of the `k` cluster centroids",
    "sampleExplanations": [
      "Centroids converge to cluster centers after repeated iterations."
    ]
  },
  "54": {
    "title": "Naive Bayes Spam Classifier",
    "category": "Natural Language Processing",
    "description": "Build a Multinomial Naive Bayes text classifier to predict whether an incoming message is \\'Spam\\' or \\'Ham\\' using word conditional probabilities with Laplace smoothing.",
    "inputFormat": "Text message and precomputed vocabulary word frequencies",
    "outputFormat": "Predicted category label (\"Spam\" or \"Ham\")",
    "sampleExplanations": [
      "Bayes theorem computes posterior probability of spam given token occurrences."
    ]
  },
  "55": {
    "title": "Confusion Matrix & F1-Score Evaluation",
    "category": "Model Evaluation",
    "description": "Given ground-truth labels and predicted labels for a binary classification problem, compute the Confusion Matrix (TP, FP, TN, FN) and calculate Precision, Recall, and F1-Score.",
    "inputFormat": "Binary arrays `y_true` and `y_pred`",
    "outputFormat": "Dictionary containing precision, recall, and f1_score",
    "sampleExplanations": [
      "F1-score is the harmonic mean of precision and recall."
    ]
  },
  "56": {
    "title": "Neural Network Activation Functions (Sigmoid, ReLU, Softmax)",
    "category": "Deep Learning & Math",
    "description": "Implement standard neural network activation functions:\n- $\\sigma(z) = \\frac{1}{1 + e^{-z}}$\n- $\\text{ReLU}(z) = \\max(0, z)$\n- $\\text{Softmax}(\\mathbf{z})_i = \\frac{e^{z_i - \\max(\\mathbf{z})}}{\\sum_j e^{z_j - \\max(\\mathbf{z})}}$ (numerically stable)",
    "inputFormat": "Input vector of logits `z`",
    "outputFormat": "Normalized probability distribution summing to 1.0",
    "sampleExplanations": [
      "Numerically stable Softmax prevents exponential overflow."
    ]
  },
  "57": {
    "title": "TF-IDF Text Feature Vectorizer",
    "category": "Natural Language Processing",
    "description": "Implement Term Frequency-Inverse Document Frequency (TF-IDF) feature extraction for a text corpus to reflect how important a word is to a document in a collection.",
    "inputFormat": "A corpus of text documents",
    "outputFormat": "TF-IDF weight matrix for each document",
    "sampleExplanations": [
      "Words frequent in one doc but rare in corpus receive higher TF-IDF weights."
    ]
  },
  "58": {
    "title": "Q-Learning Reinforcement Learning Maze Solver",
    "category": "Reinforcement Learning",
    "description": "Implement the tabular Q-Learning algorithm to train an agent to navigate a grid maze to reach the goal state while maximizing cumulative discounted rewards using the Bellman equation.",
    "inputFormat": "Grid environment dimensions, reward map, and discount factor gamma",
    "outputFormat": "Converged Q-table containing optimal state-action values",
    "sampleExplanations": [
      "Q-learning iteratively updates Q(s, a) towards optimal policy."
    ]
  },
  "59": {
    "title": "Generic Stack with C++ Templates",
    "category": "Templates & Generic Programming",
    "description": "Implement a generic, dynamic `Stack<T>` class using C++ templates. Provide member functions `push`, `pop`, `top`, `empty`, and `size` with proper boundary checks.",
    "inputFormat": "Type parameter `T` and sequence of stack operations",
    "outputFormat": "Observed top element and size states",
    "sampleExplanations": [
      "Template specialization allows Stack to handle int, string, or custom types."
    ]
  },
  "60": {
    "title": "RAII Resource Management & std::shared_ptr",
    "category": "Modern C++ Memory Management",
    "description": "Demonstrate shared ownership using `std::shared_ptr` and avoid cyclic reference memory leaks using `std::weak_ptr` under Resource Acquisition Is Initialization (RAII).",
    "inputFormat": "Node structures linking to each other",
    "outputFormat": "Verification that reference count drops to zero upon scope exit",
    "sampleExplanations": [
      "Weak_ptr prevents reference cycles that would otherwise cause memory leaks."
    ]
  },
  "61": {
    "title": "Custom Sorting with Lambda Expressions",
    "category": "Modern C++ STL",
    "description": "Use `std::sort` with a custom C++ lambda comparator to sort a collection of student records primarily by descending GPA, and secondarily by ascending alphabetical name.",
    "inputFormat": "Vector of student objects with name and GPA",
    "outputFormat": "Vector sorted according to multi-key comparator",
    "sampleExplanations": [
      "Students with identical GPA are ordered alphabetically by name."
    ]
  },
  "62": {
    "title": "Polymorphism & Virtual Destructors",
    "category": "Object-Oriented C++",
    "description": "Create an abstract base class `Shape` with pure virtual method `area()` and a virtual destructor. Derive `Circle` and `Rectangle` classes and compute total area polymorphically through base class pointers.",
    "inputFormat": "Vector of `Shape*` pointers pointing to derived instances",
    "outputFormat": "Total cumulative area of all shapes",
    "sampleExplanations": [
      "Virtual destructor ensures derived object destructors are invoked properly."
    ]
  },
  "63": {
    "title": "Move Semantics & std::move Optimization",
    "category": "Modern C++ Performance",
    "description": "Implement move constructor and move assignment operator for a dynamic memory buffer class to transfer resource pointers without deep copying, reducing overhead to $O(1)$.",
    "inputFormat": "Large memory buffer transferred to new owner via `std::move`",
    "outputFormat": "Confirmation that zero deep copies were performed",
    "sampleExplanations": [
      "Move semantics transfers raw pointer ownership with zero memory allocation."
    ]
  },
  "64": {
    "title": "String Parsing with std::stringstream & string_view",
    "category": "String Processing",
    "description": "Efficiently parse a sequence of whitespace-delimited integers from a string using `std::stringstream` and compute the sum of all even numbers.",
    "inputFormat": "String containing space-separated integers",
    "outputFormat": "Sum of all parsed even integers",
    "sampleExplanations": [
      "Even numbers parsed and summed without extraneous string allocations."
    ]
  },
  "65": {
    "title": "Custom Exception in Banking Transactions",
    "category": "Java Exception Handling",
    "description": "Create a checked custom exception `InsufficientFundsException`. In an `Account` class, validate withdrawal requests and throw the exception with an informative message if requested amount exceeds balance.",
    "inputFormat": "Account balance and withdrawal amount",
    "outputFormat": "Thrown exception message if balance is insufficient",
    "sampleExplanations": [
      "Throwing custom exception maintains transactional integrity."
    ]
  },
  "66": {
    "title": "Multi-threading & Thread-Safety with AtomicInteger",
    "category": "Java Concurrency",
    "description": "Implement a thread-safe counter shared among 100 worker threads using `java.util.concurrent.atomic.AtomicInteger` to achieve lock-free thread synchronization.",
    "inputFormat": "Number of threads and increments per thread",
    "outputFormat": "Exact final counter value without race conditions",
    "sampleExplanations": [
      "CAS (Compare-And-Swap) operations guarantee atomic increments."
    ]
  },
  "67": {
    "title": "Sorting Collections with Comparable & Comparator",
    "category": "Java Collections Framework",
    "description": "Implement `Comparable<Student>` for natural ordering and create flexible custom `Comparator<Student>` instances using lambda expressions and method references.",
    "inputFormat": "List of student records",
    "outputFormat": "Sorted list matching custom comparison criteria",
    "sampleExplanations": [
      "Comparator.comparing(...).thenComparing(...) enables multi-tier sorting."
    ]
  },
  "68": {
    "title": "Object-Oriented Design with Abstract Classes",
    "category": "Java OOP",
    "description": "Define an abstract class `Employee` with abstract method `calculateSalary()`. Implement concrete subclasses `FullTimeEmployee` and `PartTimeEmployee` with specific payroll formulas.",
    "inputFormat": "Employee parameters (base salary, bonus, hourly rate, hours worked)",
    "outputFormat": "Calculated monthly salary for each employee",
    "sampleExplanations": [
      "Subclasses implement abstract salary calculation polymorphically."
    ]
  },
  "69": {
    "title": "Parallel Stream Processing on Large Datasets",
    "category": "Java Stream API",
    "description": "Process a large collection of integers using Java `parallelStream()` to filter prime numbers and compute the sum of their squares utilizing multi-core hardware parallelism.",
    "inputFormat": "Large list of integers",
    "outputFormat": "Sum of squares of prime elements computed in parallel",
    "sampleExplanations": [
      "ForkJoinPool splits stream across CPU cores for maximum throughput."
    ]
  },
  "70": {
    "title": "Producer-Consumer Pattern with BlockingQueue",
    "category": "Java Concurrency",
    "description": "Implement the classic Producer-Consumer design pattern using `java.util.concurrent.ArrayBlockingQueue` to handle backpressure and prevent thread starvation or deadlock.",
    "inputFormat": "Queue capacity, producer threads, and consumer threads",
    "outputFormat": "Safe concurrent message publishing and consumption",
    "sampleExplanations": [
      "BlockingQueue automatically handles locking and condition signaling."
    ]
  },
  "71": {
    "title": "Generic Repository Pattern in Java",
    "category": "Java Generics & Design Patterns",
    "description": "Design a generic repository interface `Repository<T, ID>` with CRUD methods (`save`, `findById`, `findAll`, `delete`) and implement it with an in-memory `ConcurrentHashMap`.",
    "inputFormat": "Entity objects and identity keys",
    "outputFormat": "Successful CRUD operations on generic entity storage",
    "sampleExplanations": [
      "Generics ensure type safety across all CRUD repository operations."
    ]
  },
  "72": {
    "title": "High-Performance File I/O with Java NIO",
    "category": "Java NIO & File Processing",
    "description": "Read and process a large text file using Java NIO (`Files.lines` and `BufferedReader`) to count occurrences of a specific search keyword with minimal memory footprint.",
    "inputFormat": "File path and target search keyword",
    "outputFormat": "Total frequency count of keyword occurrences",
    "sampleExplanations": [
      "Streaming lines via Java NIO avoids loading entire file into memory."
    ]
  },
  "73": {
    "title": "Three-Table JOIN Query: Students, Courses & Grades",
    "category": "SQL Joins & Relational Algebra",
    "description": "Write a SQL query joining `Students`, `Enrollments`, and `Courses` tables to retrieve student names, course titles, and semester grades for students who scored an \\'A\\' grade.",
    "inputFormat": "Tables: `Students`, `Courses`, `Enrollments`",
    "outputFormat": "Student name, course title, and grade records",
    "sampleExplanations": [
      "Inner joins connect primary and foreign keys across 3 tables."
    ]
  },
  "74": {
    "title": "Group Filtering with GROUP BY & HAVING",
    "category": "SQL Aggregations",
    "description": "Write a SQL query grouping students by academic department, calculating average GPA and student count, filtering only departments with at least 5 students and average GPA $\\ge 3.2$.",
    "inputFormat": "Table `Students(id, name, department, gpa)`",
    "outputFormat": "Department name, student count, and average GPA",
    "sampleExplanations": [
      "HAVING clause filters groups after aggregate calculation."
    ]
  },
  "75": {
    "title": "Correlated Subquery for Above-Average Students",
    "category": "SQL Subqueries",
    "description": "Write a correlated subquery to find all students whose GPA is strictly higher than the average GPA of their own specific class group.",
    "inputFormat": "Table `Students(id, name, class_group, gpa)`",
    "outputFormat": "Student records exceeding their respective class average GPA",
    "sampleExplanations": [
      "Subquery references outer row class_group to compute localized average."
    ]
  },
  "76": {
    "title": "Cumulative Running Total with Window Function",
    "category": "SQL Window Functions",
    "description": "Calculate a cumulative running total of payments over time using the window function `SUM(amount) OVER (ORDER BY payment_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.",
    "inputFormat": "Table `Payments(payment_id, payment_date, amount)`",
    "outputFormat": "Columns: `payment_id`, `payment_date`, `amount`, `running_total`",
    "sampleExplanations": [
      "Running total accumulates amounts chronologically row by row."
    ]
  },
  "77": {
    "title": "Conditional Classification with CASE WHEN",
    "category": "SQL Control Flow",
    "description": "Write a SQL query classifying students into academic standing brackets based on GPA using `CASE WHEN`:\n- GPA $\\ge 3.6$: \\'High Distinction\\'\n- $3.2 \\le \\text{GPA} < 3.6$: \\'Distinction\\'\n- $2.5 \\le \\text{GPA} < 3.2$: \\'Good\\'\n- Else: \\'Average\\'",
    "inputFormat": "Table `Students(id, name, gpa)`",
    "outputFormat": "Columns: `id`, `name`, `gpa`, `academic_standing`",
    "sampleExplanations": [
      "CASE WHEN evaluates GPA thresholds in prioritized sequence."
    ]
  },
  "78": {
    "title": "Top 3 Students per Major with CTE & ROW_NUMBER",
    "category": "SQL Window Functions & CTE",
    "description": "Use a Common Table Expression (CTE) and `ROW_NUMBER() OVER (PARTITION BY major ORDER BY gpa DESC)` to find the top 3 highest GPA students within each academic major.",
    "inputFormat": "Table `Students(id, name, major, gpa)`",
    "outputFormat": "Top 3 ranked student records per major",
    "sampleExplanations": [
      "Partition by major restarts rank numbering for each academic department."
    ]
  },
  "79": {
    "title": "Recursive CTE for Course Prerequisite Hierarchy",
    "category": "SQL Recursive CTE",
    "description": "Write a recursive Common Table Expression (`WITH RECURSIVE`) to traverse the prerequisite tree of university courses, outputting course code, prerequisite code, and dependency depth level.",
    "inputFormat": "Table `Prerequisites(course_id, prereq_id)`",
    "outputFormat": "Hierarchical list of course dependencies with depth level",
    "sampleExplanations": [
      "Recursive CTE repeatedly expands dependency graph until base courses."
    ]
  },
  "80": {
    "title": "LEFT JOIN to Identify Students with Zero Submissions",
    "category": "SQL Outer Joins",
    "description": "Write a SQL query using `LEFT JOIN` and `WHERE Submissions.id IS NULL` to find all enrolled students who have not submitted any assignments to the grading system yet.",
    "inputFormat": "Tables `Students` and `Submissions`",
    "outputFormat": "Columns: `student_id`, `student_name`, `class_group`",
    "sampleExplanations": [
      "LEFT JOIN preserves all students; NULL filter isolates non-submitters."
    ]
  }
};

/**
 * Pure function to localize an exercise based on the current UI language.
 * When lang === 'eng', returns the high-standard English translation.
 * When lang === 'vie' or translation is missing, safely falls back to original.
 */
export function localizeExercise(ex: Exercise, lang: Language): Exercise {
  if (lang !== 'eng') {
    return ex;
  }

  const en = EXERCISE_EN[ex.id];
  if (!en) {
    return {
      ...ex,
      title: ex.titleEn || ex.title,
      category: ex.categoryEn || ex.category,
    };
  }

  const sampleTestCases = ex.sampleTestCases.map((tc, idx) => {
    if (en.sampleExplanations && en.sampleExplanations[idx]) {
      return {
        ...tc,
        explanation: en.sampleExplanations[idx],
      };
    }
    return tc;
  });

  return {
    ...ex,
    title: en.title || ex.titleEn || ex.title,
    category: en.category || ex.categoryEn || ex.category,
    description: en.description || ex.description,
    inputFormat: en.inputFormat || ex.inputFormat,
    outputFormat: en.outputFormat || ex.outputFormat,
    sampleTestCases,
  };
}
