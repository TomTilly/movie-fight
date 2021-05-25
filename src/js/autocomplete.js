import { debounce } from './util';

const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
  id,
}) => {
  root.innerHTML = `
  <label for="${id}">Search</label>
  <input type="text" name="${id}" id="${id}" />
  <ul class="dropdown"></ul>
`;

  const dropdown = root.querySelector('.dropdown');
  const input = root.querySelector('input');

  const onInput = async (event) => {
    const { target } = event;

    if (!target.value) {
      dropdown.classList.remove('is-active');
      return;
    }

    const items = await fetchData(target.value);

    // Clear old suggestions
    while (dropdown.firstChild) {
      dropdown.removeChild(dropdown.firstChild);
    }

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    dropdown.classList.add('is-active');

    items.forEach((item) => {
      const suggestion = document.createElement('li');
      suggestion.classList.add('suggestion');
      suggestion.innerHTML = renderOption(item);
      dropdown.appendChild(suggestion);

      suggestion.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
      });
    });
  };

  input.addEventListener('input', debounce(onInput, 500));

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};

export default createAutoComplete;
