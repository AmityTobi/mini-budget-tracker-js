'use strict';

const inputDescription = document.getElementById('desc');
const inputExpenses = document.getElementById('amount');

const labelBalance = document.getElementById('balance');
const labelIncome = document.getElementById('income');
const labelExpenses = document.getElementById('expenses');
const txnList = document.getElementById('txn-list');

const btnAdd = document.getElementById('add-btn');
const btnShowIncome = document.getElementById('filter-income');
const btnShowExpenses = document.getElementById('filter-expense');
const btnShowAll = document.getElementById('show-all');
const btnSortAsc = document.getElementById('sort-asc');
const btnSortDesc = document.getElementById('sort-desc');
const btnReset = document.getElementById('reset');

//Functions

//Formatted Cuyrrency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Data storage for all transactions
const description = [];

// Update UI summary (Income, Expenses, Balance)
const updateSummary = function (arr) {
  const income = arr
    .map(txn => txn.expenses)
    .filter(amount => amount > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const expenses = arr
    .map(txn => txn.expenses)
    .filter(amount => amount < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const balance = income + expenses;

  labelIncome.textContent = formatCur(income, 'en-NG', 'NGN');
  labelExpenses.textContent = formatCur(Math.abs(expenses), 'en-NG', 'NGN');
  labelBalance.textContent = formatCur(balance, 'en-NG', 'NGN');
};

// Render the transactions list
const renderTransactions = function (arr) {
  txnList.innerHTML = '';

  arr.forEach(txn => {
    const type = txn.expenses > 0 ? 'income' : 'expense';
    const formatedAmount = formatCur(Math.abs(txn.expenses), 'en-NG', 'NGN');
    const html = `<li class ="${type}">${txn.desc}: ${formatedAmount}</li>`;
    txnList.insertAdjacentHTML('afterbegin', html);
  });
};

// Sort and display transactions
const sortAndRender = function (arr, direction = 'asc') {
  const sorted = arr
    .slice()
    .sort((a, b) =>
      direction === 'asc' ? a.expenses - b.expenses : b.expenses - a.expenses
    );
  renderTransactions(sorted);
};

// Reset input fields
const clearInputs = function () {
  inputDescription.value = '';
  inputExpenses.value = '';
};

// Full app reset
const resetApp = function () {
  txnList.innerHTML = '';
  description.length = 0;
  labelBalance.textContent = `₦0`;
  labelExpenses.textContent = `₦0`;
  labelIncome.textContent = `₦0`;
};

// Add new transaction
btnAdd.addEventListener('click', function (e) {
  e.preventDefault();
  const desc =
    /[a-zA-Z]/.test(inputDescription.value) && inputDescription.value.trim()
      ? inputDescription.value
          .toLowerCase()
          .split('')
          .map((word, i) => (i === 0 ? word.toUpperCase() : word))
          .join('')
      : '';

  const expense = Number(inputExpenses.value);

  //Extra check for empty inputs
  if (!desc || !inputExpenses.value.trim()) {
    alert('Please enter a valid description and amount.');
    clearInputs();
    return;
  }

  if (desc && expense) {
    description.push({ desc, expenses: expense });
    renderTransactions(description);
  }
  updateSummary(description);
  clearInputs();
});

// Filter: Show only income
btnShowIncome.addEventListener('click', function (e) {
  e.preventDefault();
  const incomeOnly = description.filter(txn => txn.expenses > 0);
  renderTransactions(incomeOnly);
});

// Filter: Show only expenses
btnShowExpenses.addEventListener('click', function (e) {
  e.preventDefault();
  const expenseOnly = description.filter(txn => txn.expenses < 0);
  renderTransactions(expenseOnly);
});

// Show all transactions
btnShowAll.addEventListener('click', function (e) {
  e.preventDefault();
  renderTransactions(description);
});

// Sort ascending
btnSortAsc.addEventListener('click', function (e) {
  e.preventDefault();
  sortAndRender(description, 'asc');
});

// Sort descending
btnSortDesc.addEventListener('click', function (e) {
  e.preventDefault();
  sortAndRender(description, 'desc');
});

// Reset the app
btnReset.addEventListener('click', function (e) {
  e.preventDefault();
  resetApp();
});
