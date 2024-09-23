const LocalStorageService = {
    get: (key) => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value),
    remove: (key) => window.localStorage.removeItem(key),
    clear: () => window.localStorage.clear()
};

export default LocalStorageService;