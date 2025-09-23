# Alternatives to Backtracking: Approaches and Trade-offs

This document surveys strategies beyond classic backtracking for solving goal-directed or constraint-heavy problems. Each approach can be used standalone or in hybrid with inverse reasoning.

## 1. Constraint Programming (CP) with Propagation

Use a CP solver (finite domain or SMT) to model variables, domains, and constraints; rely on propagation and global constraints to prune.

- Strengths: Powerful propagation (AC/GAC), global constraints (AllDifferent, Cumulative), reified constraints, explanations.
- Weaknesses: Modeling overhead, performance depends on constraint structure and chosen search.
- When to use: Tight constraints with rich structure; need for proof of infeasibility.

## 2. SAT/SMT and MaxSAT

Encode the problem as Boolean formulas (SAT), richer theories (SMT), or optimization variants (MaxSAT/OMT). Leverage CDCL/CDCL(T) with clause learning and conflict-driven backjumping.

- Strengths: State-of-the-art solvers, strong guarantees, excellent conflict learning, incremental solving.
- Weaknesses: Encoding can be nontrivial; bit-blasting numeric domains may explode.
- When to use: Discrete, logic-heavy constraints; need strong completeness and proofs.

## 3. Dynamic Programming (DP) and Memoization

Exploit optimal substructure by decomposing into overlapping subproblems. Use bottom-up DP or top-down memoization with canonical subproblem keys.

- Strengths: Polynomial-time for many structured problems; exact; clear optimality.
- Weaknesses: Requires decomposability; state explosion without dimension reduction.
- When to use: DAG-like dependencies; clear subproblem boundaries; knapsack-like problems.

## 4. Graph Search with Heuristics (A*, IDA*)

Treat states as nodes; use heuristic functions to guide forward or backward search.

- Strengths: With admissible heuristics, A* is optimal; IDA* has low memory usage.
- Weaknesses: Needs good heuristics; open/closed lists can grow large.
- When to use: Metric costs; clear successor function; heuristic design feasible.

## 5. Local Search and Metaheuristics

Hill climbing, simulated annealing, tabu search, genetic algorithms, and evolutionary strategies explore via neighbor moves, often without completeness.

- Strengths: Good for large, rough landscapes; anytime behavior; parallelizable.
- Weaknesses: No guarantees; sensitive to parameterization; can stagnate in local minima.
- When to use: Huge spaces; objective available; approximate solutions acceptable.

## 6. Mixed-Integer Programming (MIP) / Constraint Integer Programming (CIP)

Model with linear constraints and integrality; solved with branch-and-cut, cutting planes, presolve, and primal heuristics.

- Strengths: Mature solvers; strong relaxations; optimality certificates; good for optimization.
- Weaknesses: Requires (near) linear models; big-M pitfalls; scaling with weak relaxations.
- When to use: Linear/convex structure; explicit objective; resource allocation, scheduling.

## 7. Beam Search and Best-First Variants

Keep only the top-k partial candidates under a heuristic score.

- Strengths: Strong pruning; controllable compute via beam width.
- Weaknesses: Incomplete; may discard necessary branches early.
- When to use: Sequence generation; heuristic scoring available; need predictable latency.

## 8. AND/OR Search and Decomposition Methods

Represent problem as a decomposition graph; use AND/OR search to exploit conditional independence and treewidth.

- Strengths: Exponential speedups on low-treewidth structures.
- Weaknesses: Requires structure discovery; overhead for general problems.
- When to use: Factorable constraints; graphical model style problems.

## 9. Monte Carlo Tree Search (MCTS)

Use stochastic rollouts with upper confidence bounds (UCT) to balance exploration/exploitation.

- Strengths: Scales with simulation budget; domain-agnostic; strong in combinatorial games.
- Weaknesses: Needs a rollout policy/terminal evaluation; stochastic; no guarantees without enough compute.
- When to use: Expensive branching; evaluable terminal/heuristic outcomes; anytime needs.

## 10. Learning-Guided Search

Use learned policies/value functions to rank actions/states, possibly combined with exact search (e.g., AlphaZero-style tree search).

- Strengths: Dramatic pruning; improves with data; compatible with exact verification.
- Weaknesses: Training cost; dataset bias; explainability.
- When to use: Repeated tasks; simulators for data; hybrid exact/approximate pipelines.

## 11. Answer Set Programming (ASP)

Declarative logic programming for nonmonotonic reasoning with efficient stable model search.

- Strengths: Concise modeling of defaults/choices; strong solvers.
- Weaknesses: Learning curve; translation effort.
- When to use: Combinatorial reasoning with defaults and choices.

## 12. Domain-Specific Solvers and Propagators

Design custom propagators or specialized algorithms (e.g., network flow, bipartite matching) for key substructures inside a larger search.

- Strengths: Orders-of-magnitude speedups on subproblems.
- Weaknesses: Engineering effort; limited generality.
- When to use: Recognizable motifs (flows, matchings, intervals, matroids) recur.

## 13. Constraint Relaxations and Rounding

Relax constraints (LP, Lagrangian, convex surrogates), solve the relaxed problem, and round/repair.

- Strengths: Provable bounds; warm starts for exact search; scalable.
- Weaknesses: Integrality gap; rounding may fail; needs repair heuristics.
- When to use: Optimization focus; useful relaxations exist.

## 14. Portfolio and Algorithm Selection

Run a portfolio of diverse solvers/heuristics in parallel or sequence with timeouts; use meta-learning to select.

- Strengths: Robust across instances; leverages complementary strengths.
- Weaknesses: Overhead and engineering complexity.
- When to use: Heterogeneous instance distributions; limited a priori knowledge.

## Hybridization Patterns

- Backtracking + Propagation: Strengthen inverse search with CP-style filters.
- Backtracking + Heuristics (A*/Beam): Order or limit branches by learned/scored heuristics.
- Decomposition + Exact Core: Use AND/OR or tree decomposition, solve subtrees exactly, glue with bounds.
- Relaxation + Repair: Use LP/MIP relaxations to guide or warm-start discrete search.
- Learning + Exact: Train policies/values to prune, verify with exact search or SMT.

## Choosing an Approach

Consider:
- Variable and value domain sizes; structure factorability; presence of strong constraints.
- Need for guarantees (soundness, completeness, optimality) vs. speed.
- Availability of heuristics, relaxations, or training data.
- Resources: memory, compute budget, latency requirements.

## Practical Tips

- Start with the simplest viable encoding and baseline search for correctness.
- Instrument heavily: expansion counts, prune causes, domain sizes, gap to bounds.
- Add structure-aware propagators or relaxations where hotspots occur.
- Prefer canonicalization and memoization to tame duplication.
- For approximate methods, implement restarts and diversity to avoid stagnation.

