/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  async onSubmit(data) {
    const response = await Account.create(data);

    if(response) {
      const modal = App.getModal('createAccount');

      modal.close();

      this.element.reset();

      App.update();
    } 
  }
}