(function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || '';
    }

    let query = '';
    let currentEngine = '';

    if (location.hostname.includes('google')) {
        query = getQueryParam('q');
        currentEngine = 'Google';
    } else if (location.hostname.includes('bing')) {
        query = getQueryParam('q');
        currentEngine = 'Bing';
    } else if (location.hostname.includes('yandex')) {
        query = getQueryParam('text');
        currentEngine = 'Yandex';
    } else if (location.hostname.includes('duckduckgo')) {
        query = getQueryParam('q');
        currentEngine = 'DuckDuckGo';
    } else if (location.hostname.includes('chipdip.ru')) {
        query = getQueryParam('searchtext');
        currentEngine = 'Chip и Dip';
    } else if (location.hostname.includes('mouser.co.uk')) {
        query = getQueryParam('q');
        currentEngine = 'Mouser Electronics';
    }

    const container = document.createElement('div');
    container.id = 'search-switcher-container';
    container.classList.add('dark-mode');

    const toggleButton = document.createElement('button');
    toggleButton.id = 'search-switcher-toggle';
    toggleButton.innerHTML = '&#9664;';
    toggleButton.title = 'Скрыть панель';
    toggleButton.classList.add('toggle-button');

    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttons-container';
    buttonsContainer.classList.add('buttons-grid');

    const searchEngines = [
        { name: 'Google', url: 'https://www.google.com/search?q=' },
        { name: 'Bing', url: 'https://www.bing.com/search?q=' },
        { name: 'Yandex', url: 'https://www.yandex.ru/search?text=' },
        { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
        { name: 'Chip и Dip', url: 'https://www.chipdip.ru/search?searchtext=' },
        { name: 'Mouser Electronics', url: 'https://www.mouser.co.uk/c/?q=' }
    ];

    searchEngines.forEach(engine => {
        const button = document.createElement('button');
        button.innerText = engine.name;
        button.classList.add('search-switcher-button');
        if (engine.name === currentEngine) {
            button.disabled = true;
        }
        button.addEventListener('click', () => {
            window.location.href = engine.url + encodeURIComponent(query);
        });
        buttonsContainer.appendChild(button);
    });

    container.appendChild(toggleButton);
    container.appendChild(buttonsContainer);

    function addContainer() {
        document.body.appendChild(container);
        applySavedState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addContainer);
    } else {
        addContainer();
    }

    function saveState(isCollapsed) {
        localStorage.setItem('searchSwitcherCollapsed', isCollapsed);
    }

    function applySavedState() {
        const isCollapsed = localStorage.getItem('searchSwitcherCollapsed') === 'true';
        if (isCollapsed) {
            collapsePanel();
        } else {
            expandPanel();
        }
    }

    function collapsePanel() {
        buttonsContainer.style.display = 'none';
        toggleButton.innerHTML = '&#9654;';
        toggleButton.title = 'Показать панель';
        saveState(true);
    }

    function expandPanel() {
        buttonsContainer.style.display = 'grid';
        toggleButton.innerHTML = '&#9664;';
        toggleButton.title = 'Скрыть панель';
        saveState(false);
    }

    toggleButton.addEventListener('click', () => {
        if (buttonsContainer.style.display === 'none') {
            expandPanel();
        } else {
            collapsePanel();
        }
    });

    if (currentEngine === 'Yandex') {
        const observer = new MutationObserver(() => {
            if (!document.body.contains(container)) {
                addContainer();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
