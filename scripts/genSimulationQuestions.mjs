/**
 * One-off generator for lib/simulationExam/questions.gen.ts (90 MCQs, placement-level English).
 * Run: node scripts/genSimulationQuestions.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bank = {
  programming1: [
    ["What is the value of `3 + 4 * 2` in Java?", ["14", "11", "10", "24"], 1],
    ["Which keyword declares a constant field or variable in Java?", ["final", "const", "static", "immutable"], 0],
    ["What does `i++` do when used as a postfix expression in Java?", ["Increments then returns old value", "Returns old value, then increments", "Doubles i", "Syntax error"], 1],
    ["In Java, which loop always executes its body at least once?", ["do-while", "while", "for", "enhanced for"], 0],
    ["How many bytes does a Java `int` occupy (JVM specification)?", ["4", "2", "8", "Depends on OS"], 0],
    ["What does the `new` keyword do in Java?", ["Creates an object on the heap", "Allocates only stack memory", "Imports a class", "Declares an interface"], 0],
    ["Calling a method on a null reference in Java throws:", ["NullPointerException", "Compilation error always", "IOException", "ClassCastException"], 0],
    ["For two object references `a` and `b`, what does `a == b` compare in Java?", ["Reference equality (same object)", "Always field-by-field values", "hashCode only", "It is illegal"], 0],
    ["What does `break` do inside a `switch` in Java?", ["Exits the switch", "Always falls through", "Restarts the switch", "Syntax error"], 0],
    ["Which is used for standard console output in Java?", ["System.out", "printf()", "cout", "stdout()"], 0],
    ["What is the default value of an `int` instance field if not explicitly initialized?", ["0", "null", "undefined", "Random"], 0],
    ["Which is a valid Java array declaration?", ["int[] a = new int[10];", "int a[10];", "int[] = new int;", "array int a;"], 0],
    ["Which class is commonly used to build mutable strings in Java?", ["StringBuilder", "string", "char[]", "strcpy"], 0],
    ["Where are objects created with `new` stored in Java?", ["Heap (garbage-collected)", "Stack only", "Code segment", "CPU registers"], 0],
    ["What is recursion in Java?", ["A method that calls itself", "A kind of loop keyword", "A built-in package", "A compiler optimization"], 0],
  ],
  programming2: [
    ["What is encapsulation?", ["Hiding internal state behind an interface", "Copying objects", "Multiple inheritance", "Global variables"], 0],
    ["Which OOP pillar allows a subclass to override a method?", ["Polymorphism", "Abstraction", "Encapsulation", "Compilation"], 0],
    ["What does `private` typically mean in Java?", ["Accessible only within the declaring class", "Accessible everywhere", "Read-only everywhere", "Same as protected"], 0],
    ["Which relationship means 'is-a'?", ["Inheritance", "Composition", "Dependency", "Association"], 0],
    ["What is an abstract class?", ["Cannot be instantiated directly", "Has no methods", "Only static", "Same as interface always"], 0],
    ["Which pattern provides a single instance?", ["Singleton", "Factory", "Observer", "Adapter"], 0],
    ["What is method overloading?", ["Same name, different parameters", "Same name, same params", "Renaming", "Inlining"], 0],
    ["What is an interface mainly for?", ["Defining contracts without implementation details", "Storing data", "Memory layout", "Garbage collection"], 0],
    ["Which collection allows key-value pairs in Java?", ["Map", "List", "Set", "Queue"], 0],
    ["What is exception handling used for?", ["Managing runtime errors gracefully", "Speed", "Macros", "Comments"], 0],
    ["What does `finally` do in try/catch/finally?", ["Runs after try/catch regardless", "Runs only on error", "Skips catch", "Deletes objects"], 0],
    ["Which is true about `String` in Java?", ["Immutable", "Primitive type", "Mutable by default", "Stored on stack only"], 0],
    ["What is composition vs inheritance?", ["Has-a vs is-a", "Same concept", "Only syntax", "Only for GUI"], 0],
    ["What is a design pattern?", ["Reusable solution to a common problem", "Compiler flag", "UML tool", "Testing tool"], 0],
    ["Which keyword prevents overriding in Java?", ["final", "static", "abstract", "volatile"], 0],
  ],
  discrete_math: [
    ["How many subsets does a set with n elements have?", ["2^n", "n^2", "n!", "2n"], 0],
    ["What is ¬(p ∧ q) logically equivalent to (De Morgan)?", ["(¬p) ∨ (¬q)", "(¬p) ∧ (¬q)", "p ∨ q", "p ∧ q"], 0],
    ["What is the cardinality of {1,2,2,3} as a set?", ["3", "4", "2", "5"], 0],
    ["A graph where every pair of distinct vertices is connected is called?", ["Complete graph", "Tree", "DAG", "Bipartite only"], 0],
    ["What is the sum of integers from 1 to n?", ["n(n+1)/2", "n^2", "2n", "n!"], 0],
    ["How many edges does a tree with n vertices have?", ["n-1", "n", "n+1", "2n"], 0],
    ["What is a tautology?", ["Always true", "Always false", "Sometimes true", "Contradiction"], 0],
    ["What is gcd(12,18)?", ["6", "3", "36", "2"], 0],
    ["What is 7 mod 3?", ["1", "0", "2", "3"], 0],
    ["How many permutations of 3 distinct items?", ["6", "3", "9", "27"], 0],
    ["What is the contrapositive of p → q?", ["¬q → ¬p", "q → p", "¬p → ¬q", "p ∧ ¬q"], 0],
    ["A relation that is reflexive, symmetric, and transitive is?", ["Equivalence relation", "Partial order", "Function", "Tree"], 0],
    ["What is C(n,k) counting?", ["Combinations (unordered)", "Permutations", "Power set size", "Graph edges"], 0],
    ["What is the negation of ∀x P(x)?", ["∃x ¬P(x)", "∀x ¬P(x)", "¬∀x ¬P(x)", "∃x P(x)"], 0],
    ["In propositional logic, p ⊕ q is true when?", ["Exactly one of p,q is true", "Both true", "Both false", "Always true"], 0],
  ],
  databases: [
    ["Which SQL clause filters rows?", ["WHERE", "SELECT", "GROUP BY", "ORDER BY"], 0],
    ["What does PRIMARY KEY enforce?", ["Uniqueness and non-null identity", "Foreign reference", "Indexing only", "Encryption"], 0],
    ["Which join returns rows with matching keys in both tables?", ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], 0],
    ["What does ACID stand for regarding transactions?", ["Atomicity, Consistency, Isolation, Durability", "API, Cache, Index, Data", "Only isolation", "Only atomicity"], 0],
    ["What is normalization mainly for?", ["Reducing redundancy", "Speed always", "Encryption", "Backups"], 0],
    ["Which constraint references another table's key?", ["FOREIGN KEY", "PRIMARY KEY", "UNIQUE", "CHECK"], 0],
    ["What does `COUNT(*)` count?", ["Rows", "Distinct values only", "Columns", "Indexes"], 0],
    ["Which statement removes rows from a table?", ["DELETE", "DROP", "TRUNCATE schema", "ALTER row"], 0],
    ["What is a composite key?", ["Key made of multiple columns", "Key with duplicates", "Non-unique", "Encrypted key"], 0],
    ["Which index type is common for range queries on ordered data?", ["B-tree", "Hash only", "Bitmap only", "Queue"], 0],
    ["What does GROUP BY do?", ["Partitions rows for aggregates", "Sorts only", "Joins tables", "Filters"], 0],
    ["What is a view in SQL?", ["Stored query as virtual table", "Physical copy always", "Index", "Trigger"], 0],
    ["Which anomaly happens without proper isolation?", ["Lost update / dirty read", "Syntax error", "Only deadlock", "Compilation"], 0],
    ["What is the third normal form (3NF) mainly about?", ["Removing transitive dependencies", "Only 1NF", "Only keys", "Sharding"], 0],
    ["What does `HAVING` filter?", ["Groups after GROUP BY", "Rows before GROUP BY", "Indexes", "Join order"], 0],
  ],
  ds_algo: [
    ["Worst-case time of binary search on sorted array?", ["O(log n)", "O(n)", "O(1)", "O(n^2)"], 0],
    ["Which structure is FIFO?", ["Queue", "Stack", "Heap", "Tree"], 0],
    ["Which structure is LIFO?", ["Stack", "Queue", "Deque only", "Graph"], 0],
    ["Average case of quicksort (good pivot assumptions)?", ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], 0],
    ["What traversal visits root then left then right?", ["Preorder", "Inorder", "Postorder", "Level"], 0],
    ["What is the height of a balanced BST with n nodes?", ["O(log n)", "O(n)", "O(1)", "O(n log n)"], 0],
    ["Which algorithm finds shortest paths on non-negative weighted graphs?", ["Dijkstra", "DFS", "BFS on weighted without care", "Prim"], 0],
    ["What is dynamic programming mainly about?", ["Overlapping subproblems + optimal substructure", "Only recursion", "Only sorting", "Hashing only"], 0],
    ["What is the time to insert in a hash table average?", ["O(1) average", "O(n)", "O(log n)", "O(n^2)"], 0],
    ["Which sorting is stable (typical implementation)?", ["Merge sort", "Quick sort", "Heap sort", "Selection sort"], 0],
    ["What does BFS use?", ["Queue", "Stack", "Priority queue always", "Heap always"], 0],
    ["What does DFS use (recursive or explicit)?", ["Stack", "Queue", "Array only", "Heap"], 0],
    ["What is a spanning tree?", ["Tree connecting all vertices with n-1 edges", "Any cycle", "Only DAG", "Heap"], 0],
    ["What is Big-O describing?", ["Upper bound growth rate", "Exact runtime", "Memory only", "CPU model"], 0],
    ["Which data structure is typically used for LRU cache?", ["Doubly linked list + map", "Array only", "Stack only", "Queue only"], 0],
  ],
  software_engineering: [
    ["What is the main goal of requirements engineering?", ["Discover and document stakeholder needs", "Write code", "Deploy", "Market"], 0],
    ["Which model emphasizes iterative delivery?", ["Agile", "Waterfall only", "V-model only", "Big bang only"], 0],
    ["What is a use case?", ["Description of system-user interaction for a goal", "A unit test", "A class", "A database table"], 0],
    ["What does UML stand for?", ["Unified Modeling Language", "Universal Machine Learning", "User Module Layer", "Unit Management Library"], 0],
    ["What is technical debt?", ["Cost of shortcuts over time", "Bank loan", "CPU debt", "Cloud billing"], 0],
    ["Which testing targets individual units?", ["Unit testing", "System testing", "Acceptance only", "Load only"], 0],
    ["What is continuous integration about?", ["Frequent merges with automated builds/tests", "Manual deploys only", "UI design", "Sales"], 0],
    ["What is a software architecture mainly?", ["High-level structure and key decisions", "Only coding style", "Only testing", "Only HR"], 0],
    ["What is risk management in projects?", ["Identifying/mitigating uncertainties", "Only budgeting", "Only design", "Only marketing"], 0],
    ["What is baseline in configuration management?", ["Approved snapshot of artifacts", "First line of code", "CPU baseline", "Network speed"], 0],
    ["What does MVC roughly separate?", ["Model, View, Controller", "Memory, Vector, Cache", "Main, Void, Class", "Merge, Version, Control"], 0],
    ["What is regression testing?", ["Ensure new changes don't break existing behavior", "Only UI tests", "Only performance", "Only security"], 0],
    ["What is a prototype useful for?", ["Early feedback on ideas", "Final production always", "Only documentation", "Only legal"], 0],
    ["What is maintainability?", ["Ease of future changes", "Speed only", "UI beauty", "Lines of code"], 0],
    ["What is DevOps culture mainly about?", ["Collaboration between dev and ops with automation", "Only ops", "Only dev", "Only sales"], 0],
  ],
};

let out = `// AUTO-GENERATED by scripts/genSimulationQuestions.mjs — do not edit by hand
import type { SubjectSlug } from "@/lib/readiness";
import type { SimulationQuestion } from "./types";

export const SIMULATION_QUESTION_COUNT = 90;

export const SIMULATION_QUESTIONS: SimulationQuestion[] = [
`;

let n = 0;
for (const [subject, items] of Object.entries(bank)) {
  for (const [stem, choices, ci] of items) {
    n++;
    const id = `sim-${String(n).padStart(3, "0")}`;
    const choicesJson = JSON.stringify(choices);
    out += `  { id: "${id}", subject: "${subject}" as SubjectSlug, question: ${JSON.stringify(stem)}, choices: ${choicesJson}, correctIndex: ${ci} },\n`;
  }
}

out += `];
`;

const target = path.join(__dirname, "..", "lib", "simulationExam", "questions.gen.ts");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out, "utf8");
console.log("Wrote", target, "count", n);
