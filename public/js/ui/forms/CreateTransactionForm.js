/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  async renderAccountsList() {
    const selectElement = this.element.querySelector('.accounts-select');

    selectElement.innerHTML = '<option value="">Загрузка счетов...</option>';

    const response = await Account.list();

    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Выберите счёт';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);

    if (response && response.success && response.data) {
      response.data.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.name} (${account.sum} ₽)`;
        selectElement.appendChild(option);
      });

    }
  }
  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  async onSubmit(data) {
      const response = await Transaction.create(data);

      if (response) {
        this.element.reset();

        App.getModal(this.element.closest('.modal').id);

        App.update();
      }
    }
  }