const Modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active');
  },
};

const CurrentDate = {
  dateContainer: document.getElementById('timer-js'),

  formatDate() {
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    this.dateContainer.textContent = new Intl.DateTimeFormat(
      'pt-BR',
      options
    ).format(now);
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
  },

  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),

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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `    
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
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

  updateTotalStyle() {
    let totalCard = document.getElementById('card-total-js');

    if (Transaction.total() > 0) {
      totalCard.classList.add('positive');
      totalCard.classList.remove('negative');
      totalCard.classList.remove('total');
    } else if (Transaction.total() < 0) {
      totalCard.classList.add('negative');
      totalCard.classList.remove('positive');
      totalCard.classList.remove('total');
    } else {
      totalCard.classList.add('total');
      totalCard.classList.remove('positive');
      totalCard.classList.remove('negative');
    }
  },

  clearTransactions() {
    this.transactionContainer.innerHTML = '';
  },
};

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100;

    return value;
  },

  formatDate(date) {
    const splittedDate = date.split('-');

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

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

const Form = {
  description: document.getElementById('description'),
  amount: document.getElementById('amount'),
  date: document.getElementById('date'),

  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = this.getValues();

    if (description.trim() === '' || amount.trim() === '' || date.trim() === '')
      throw new Error('Por favor, preencha todos os campos');
  },

  formatValues() {
    let { description, amount, date } = this.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    this.description.value = '';
    this.amount.value = '';
    this.date.value = '';
  },

  submit(event) {
    event.preventDefault();

    try {
      this.validateFields();
      const transaction = this.formatValues();
      Transaction.add(transaction);
      this.clearFields();
      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);

    CurrentDate.formatDate();
    DOM.updateBalance();
    DOM.updateTotalStyle();

    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    this.init();
  },
};

App.init();
