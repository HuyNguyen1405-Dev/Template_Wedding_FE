export const storage = (table) => {

    /**
     * @param {string=} key
     * @returns {any}
     */
    const get = (key = null) => {
        const raw = localStorage.getItem(table);
        const data = raw ? JSON.parse(raw) : {};
        return key ? data[String(key)] : data;
    };

    /**
     * @param {string} key
     * @param {any} value
     * @returns {void}
     */
    const set = (key, value) => {
        try {
            const data = get();
            data[String(key)] = value;
            localStorage.setItem(table, JSON.stringify(data));
        } catch (e) {
            console.error(`❌ storage.set error [${table}]:`, e);
        }
    };

    /**
     * @param {string} key
     * @returns {boolean}
     */
    const has = (key) => {
        const data = get();
        return data && Object.prototype.hasOwnProperty.call(data, String(key));
    };

    /**
     * @param {string} key
     * @returns {void}
     */
    const unset = (key) => {
        if (!has(key)) {
            return;
        }

        const data = get();
        delete data[String(key)];
        localStorage.setItem(table, JSON.stringify(data));
    };

    /**
     * @returns {void}
     */
    const clear = () => localStorage.setItem(table, '{}');

    if (!localStorage.getItem(table)) {
        clear();
    }

    return {
        set,
        get,
        has,
        clear,
        unset,
    };
};