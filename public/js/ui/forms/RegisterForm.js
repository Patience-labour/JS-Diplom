/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */

  onSubmit(data) {
    User.register(data,(response) => {
      if(response && response.success) {
        this.element.reset();

        const modal = App.getModal('register');
        if(modal) {
          modal.close();
        }
        App.setState('user-logged');
      }
    })
  }
}