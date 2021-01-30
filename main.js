const Modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active');
  },
};

const Transaction = {
  all: [
    {
      description: 'Luz',
      amount: -10000,
      date: '23/01/2021',
    },
    {
      description: 'Website',
      amount: 500000,
      date: '23/01/2021',
    },

    {
      description: 'Internet',
      amount: -20000,
      date: '23/01/2021',
    },
    {
      description: 'App',
      amount: 200000,
      date: '23/01/2021',
    },
  ],

  add(transaction) {
    this.all.push(transaction);

    App.reload();
  },

  remove(index) {
    this.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;

    this.all.forEach(transaction => {
      if (transaction.amount > 0) income += transaction.amount;
    });

    return income;
  },

  expenses() {
    let expense = 0;

    this.all.forEach(transaction => {
      if (transaction.amount < 0) expense += transaction.amount;
    });

    return expense;
  },

  total() {
    return this.incomes() + this.expenses();
  },
};

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = this.innerHTMLTransaction(transaction);

    this.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `    
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
        <img src="./assets/minus.svg" alt="Remover transação" />
        </td>       
    `;

    return html;
  },

  updateBalance() {
    document.getElementById(
      'income-display-js'
    ).innerHTML = Utils.formatCurrency(Transaction.incomes());

    document.getElementById(
      'expense-display-js'
    ).innerHTML = Utils.formatCurrency(Transaction.expenses());

    document.getElementById(
      'total-display-js'
    ).innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions() {
    this.transactionContainer.innerHTML = '';
  },
};

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');

    value = Number(value) / 100;

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return signal + value;
  },
};

const App = {
  init() {
    Transaction.all.forEach(function (transaction) {
      DOM.addTransaction(transaction);
    });

    DOM.updateBalance();
  },

  reload() {
    DOM.clearTransactions();
    this.init();
  },
};

App.init();

Transaction.add({
  description: 'Hello',
  amount: 444,
  date: '04/08/2021',
});

Transaction.remove(0);
