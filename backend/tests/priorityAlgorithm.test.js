// backend/tests/priorityAlgorithm.test.js
// Unit tests for priority calculation and task scheduling algorithm
// TIN-113 — Author: Miracle Emefiele

const { estimateCompletionTime } = require('../api/tasks/estimateTask');

// ── Helper to build a mock task ──────────────────
function makeTask(overrides = {}) {
  return {
    task_id: 1,
    user_id: 1,
    title: 'Test Task',
    description: '',
    priority: 2,           // Medium by default
    status: 'Not Started',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    is_completed: 0,
    ...overrides
  };
}

// ── Priority weights (must match getFiltered.js) ─
const PRIORITY_WEIGHTS = { 1: 3, 2: 2, 3: 1 };
const VISIBILITY_THRESHOLD = -7;

function calculateUrgencyScore(priority, due_date) {
  const now = new Date();
  const due = new Date(due_date);
  const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  const priorityWeight = PRIORITY_WEIGHTS[priority] || 2;
  return (priorityWeight * 10) - daysUntilDue;
}

// ── TEST RUNNER ──────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     → ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b, message) {
  if (a !== b) throw new Error(message || `Expected ${b} but got ${a}`);
}

// ════════════════════════════════════════════════
// SECTION 1: URGENCY SCORE CALCULATION
// ════════════════════════════════════════════════
console.log('\n📊 URGENCY SCORE TESTS');

test('High priority task due in 2 days has higher score than Medium', () => {
  const due = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const highScore = calculateUrgencyScore(1, due);   // High priority
  const medScore  = calculateUrgencyScore(2, due);   // Medium priority
  assert(highScore > medScore, `High (${highScore}) should beat Medium (${medScore})`);
});

test('Same priority — task due sooner has higher urgency score', () => {
  const soon = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();
  const later = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const soonScore  = calculateUrgencyScore(2, soon);
  const laterScore = calculateUrgencyScore(2, later);
  assert(soonScore > laterScore, `Soon (${soonScore}) should beat Later (${laterScore})`);
});

test('Overdue task has high urgency score', () => {
  const overdue = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const score = calculateUrgencyScore(2, overdue);
  assert(score > VISIBILITY_THRESHOLD, `Overdue score (${score}) should be above threshold`);
  assert(score > 20, `Overdue medium task score (${score}) should be > 20`);
});

test('Task due today has urgency score above threshold', () => {
  const today = new Date().toISOString();
  const score = calculateUrgencyScore(2, today);
  assert(score > VISIBILITY_THRESHOLD, `Today score (${score}) should be above threshold`);
});

test('Task due far in future is below visibility threshold', () => {
  const farFuture = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const score = calculateUrgencyScore(3, farFuture); // Low priority, 30 days out
  assert(score < VISIBILITY_THRESHOLD, `Far future score (${score}) should be below threshold (${VISIBILITY_THRESHOLD})`);
});

test('Low priority score is lower than High for same due date', () => {
  const due = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const highScore = calculateUrgencyScore(1, due);
  const lowScore  = calculateUrgencyScore(3, due);
  assert(highScore > lowScore, `High (${highScore}) should beat Low (${lowScore})`);
});

// ════════════════════════════════════════════════
// SECTION 2: ESTIMATION TESTS
// ════════════════════════════════════════════════
console.log('\n⏱  ESTIMATION TESTS');

test('High priority task estimates ~90 minutes base', () => {
  const task = makeTask({ priority: 1 });
  const est = estimateCompletionTime(task);
  assertEqual(est.estimated_minutes, 90, `Expected 90min for High priority, got ${est.estimated_minutes}`);
});

test('Medium priority task estimates ~45 minutes base', () => {
  const task = makeTask({ priority: 2 });
  const est = estimateCompletionTime(task);
  assertEqual(est.estimated_minutes, 45, `Expected 45min for Medium priority, got ${est.estimated_minutes}`);
});

test('Low priority task estimates ~20 minutes base', () => {
  const task = makeTask({ priority: 3 });
  const est = estimateCompletionTime(task);
  assertEqual(est.estimated_minutes, 20, `Expected 20min for Low priority, got ${est.estimated_minutes}`);
});

test('In Progress task estimates half the time', () => {
  const task = makeTask({ priority: 2, status: 'In Progress' });
  const est = estimateCompletionTime(task);
  assertEqual(est.estimated_minutes, 23, `Expected ~23min for In Progress Medium, got ${est.estimated_minutes}`);
});

test('Completed task estimates 0 minutes', () => {
  const task = makeTask({ priority: 1, status: 'Completed' });
  const est = estimateCompletionTime(task);
  assertEqual(est.estimated_minutes, 0, `Expected 0min for Completed task, got ${est.estimated_minutes}`);
});

test('Longer description adds extra time', () => {
  const shortTask = makeTask({ description: 'short' });
  const longTask  = makeTask({ description: 'x'.repeat(200) });
  const shortEst = estimateCompletionTime(shortTask);
  const longEst  = estimateCompletionTime(longTask);
  assert(longEst.estimated_minutes > shortEst.estimated_minutes,
    `Long desc (${longEst.estimated_minutes}min) should exceed short (${shortEst.estimated_minutes}min)`);
});

// ════════════════════════════════════════════════
// SECTION 3: EDGE CASES
// ════════════════════════════════════════════════
console.log('\n⚠️  EDGE CASE TESTS');

test('Overdue task — estimation warns correctly', () => {
  const overdue = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const task = makeTask({ due_date: overdue });
  const est = estimateCompletionTime(task);
  assert(est.is_overdue === true, 'Should flag as overdue');
  assert(est.warning !== null, 'Should have a warning message');
});

test('Same-day task — not flagged as overdue', () => {
  const today = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1hr from now
  const task = makeTask({ due_date: today });
  const est = estimateCompletionTime(task);
  assert(est.is_overdue === false, 'Should not be flagged as overdue');
});

test('Invalid priority defaults to medium weight', () => {
  const due = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const score = calculateUrgencyScore(99, due); // invalid priority
  const medScore = calculateUrgencyScore(2, due);
  assertEqual(score, medScore, 'Invalid priority should default to medium weight');
});

test('Task with no description still estimates correctly', () => {
  const task = makeTask({ description: null, priority: 2 });
  const est = estimateCompletionTime(task);
  assertEqual(est.estimated_minutes, 45, `Expected 45min with null description, got ${est.estimated_minutes}`);
});

// ════════════════════════════════════════════════
// RESULTS
// ════════════════════════════════════════════════
console.log(`\n${'─'.repeat(45)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('  🎉 All tests passed!\n');
} else {
  console.log(`  ⚠️  ${failed} test(s) need attention\n`);
  process.exit(1);
}
