document.addEventListener('DOMContentLoaded', () => {

  const getMessage = buttonNode => {
    const appContainer = buttonNode.parentElement.parentElement;
    const contentContainer = appContainer.children[0].children[1];
    return contentContainer.children[1].textContent;
  }

  const getTitle = buttonNode => {
    const appContainer = buttonNode.parentElement.parentElement;
    const contentContainer = appContainer.children[0].children[1];
    return contentContainer.children[0].textContent;
  }

  const getDate = buttonNode => {
    const appContainer = buttonNode.parentElement.parentElement;
    const contentContainer = appContainer.children[0].children[1];
    const dateContainer = contentContainer.children[2].children[0];
    return dateContainer.children[1].textContent;
  }

  const getUser = buttonNode => {
    const appContainer = buttonNode.parentElement.parentElement;
    const contentContainer = appContainer.children[0].children[1];
    const nameContainer = contentContainer.children[2].children[1];
    return nameContainer.children[1].textContent;
  }

  const buttonSelector = 'div.button-container > button';
  const buttons = Array.from(document.querySelectorAll(buttonSelector));

  buttons.forEach(button => {
    const message = getMessage(button).replace(/\n/g,'\r\n');
    const title = getTitle(button);
    const date = getDate(button);
    const user = getUser(button);
    button.addEventListener('click', async () => {
      const response = await fetch('/delete-message', { 
	method: 'POST', headers: { 'Content-Type': 'application/json' },
	body:JSON.stringify({ user, title, date, message })
      });
      const { error } = await response.json();
      error ? console.log(error) : open('/', '_self');
    });
  });
});
