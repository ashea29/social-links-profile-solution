import dtIconUrl from './images/dark-theme-icon.svg';
import ltIconUrl from './images/light-theme-icon.svg';


const themeToggle = document.querySelector('.theme-toggle');
const toggleImg = document.querySelector('.theme-toggle img');


// Attach event listeners
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  toggleImg.src = document.body.classList.contains('dark-theme') ? dtIconUrl : ltIconUrl;
});
