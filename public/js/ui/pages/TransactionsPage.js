/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Передан пустой элемент')
    }
    this.element = element;
    this.lastOptions = null;
    this.registerEvents()
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeBtn = this.element.querySelector('.remove-account');
    const removeTransaction = this.element.querySelector('.transaction__remove');

    removeBtn.addEventListener('click', () => {
      this.removeAccount();
    })

    removeTransaction.addEventListener('click', () => {
      const transactionId = removeBtn.dataset.id
      removeTransaction(transactionId);
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    confirm('Вы действительно хотите удалить счёт?')

    const response = Account.remove(this.lastOptions.account_id);

    if (response) {
      App.updateWidgets();
      App.updateForms();
    }

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (!id) {
      return;
    }

    confirm('Вы действительно хотите удалить эту транзакцию?')

    const removeTransaction = Transaction.remove(id);
    if (removeTransaction) {
      App.update();
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.lastOptions = options;

    const account = Account.get(options.account_id)

    if (account) {
      this.renderTitle()
    }

    const transactions = Transaction.list({ account_id: options.account_id });

    if (transactions) {
      this.renderTransactions(transactions.data)
    }

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const titleElement = this.element.querySelector('.content-title');
    titleElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateObj = new Date(date)

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('ru-RU', { month: 'long' });
    const year = dateObj.getFullYear();

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} г. в ${hours} ${minutes}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const type = item.type.toLowerCase();
    const typeClass = type === 'income' ? 'transaction_income' : 'transaction_expense';

    const formattedDate = this.formatDate(item.created_at);
    const formattedSum = item.sum.toLocaleString('ru-RU');

    return `
    <div class="transaction ${typeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${formattedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${formattedSum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentSection = document.querySelector('.content');

    contentSection.innerHTML = '';

    const transactionsHTML = data.map(item => this.getTransactionHTML(item)).join('');

    contentSection.insertAdjacentHTML('beforeend', transactionsHTML);
  }

}