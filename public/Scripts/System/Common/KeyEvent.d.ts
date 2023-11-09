/**
 * The key event class used to convert Qt keys to web keys.
 *
 * @class KeyEvent
 */
declare class KeyEvent {
    static DOM_VK_CANCEL: number;
    static DOM_VK_HELP: number;
    static DOM_VK_BACK_SPACE: number;
    static DOM_VK_TAB: number;
    static DOM_VK_CLEAR: number;
    static DOM_VK_RETURN: number;
    static DOM_VK_ENTER: number;
    static DOM_VK_SHIFT: number;
    static DOM_VK_CONTROL: number;
    static DOM_VK_ALT: number;
    static DOM_VK_PAUSE: number;
    static DOM_VK_CAPS_LOCK: number;
    static DOM_VK_ESCAPE: number;
    static DOM_VK_SPACE: number;
    static DOM_VK_PAGE_UP: number;
    static DOM_VK_PAGE_DOWN: number;
    static DOM_VK_END: number;
    static DOM_VK_HOME: number;
    static DOM_VK_LEFT: number;
    static DOM_VK_UP: number;
    static DOM_VK_RIGHT: number;
    static DOM_VK_DOWN: number;
    static DOM_VK_PRINTSCREEN: number;
    static DOM_VK_INSERT: number;
    static DOM_VK_DELETE: number;
    static DOM_VK_0: number;
    static DOM_VK_1: number;
    static DOM_VK_2: number;
    static DOM_VK_3: number;
    static DOM_VK_4: number;
    static DOM_VK_5: number;
    static DOM_VK_6: number;
    static DOM_VK_7: number;
    static DOM_VK_8: number;
    static DOM_VK_9: number;
    static DOM_VK_SEMICOLON: number;
    static DOM_VK_EQUALS: number;
    static DOM_VK_A: number;
    static DOM_VK_B: number;
    static DOM_VK_C: number;
    static DOM_VK_D: number;
    static DOM_VK_E: number;
    static DOM_VK_F: number;
    static DOM_VK_G: number;
    static DOM_VK_H: number;
    static DOM_VK_I: number;
    static DOM_VK_J: number;
    static DOM_VK_K: number;
    static DOM_VK_L: number;
    static DOM_VK_M: number;
    static DOM_VK_N: number;
    static DOM_VK_O: number;
    static DOM_VK_P: number;
    static DOM_VK_Q: number;
    static DOM_VK_R: number;
    static DOM_VK_S: number;
    static DOM_VK_T: number;
    static DOM_VK_U: number;
    static DOM_VK_V: number;
    static DOM_VK_W: number;
    static DOM_VK_X: number;
    static DOM_VK_Y: number;
    static DOM_VK_Z: number;
    static DOM_VK_NUMPAD0: number;
    static DOM_VK_NUMPAD1: number;
    static DOM_VK_NUMPAD2: number;
    static DOM_VK_NUMPAD3: number;
    static DOM_VK_NUMPAD4: number;
    static DOM_VK_NUMPAD5: number;
    static DOM_VK_NUMPAD6: number;
    static DOM_VK_NUMPAD7: number;
    static DOM_VK_NUMPAD8: number;
    static DOM_VK_NUMPAD9: number;
    static DOM_VK_MULTIPLY: number;
    static DOM_VK_ADD: number;
    static DOM_VK_SEPARATOR: number;
    static DOM_VK_SUBTRACT: number;
    static DOM_VK_DECIMAL: number;
    static DOM_VK_DIVIDE: number;
    static DOM_VK_F1: number;
    static DOM_VK_F2: number;
    static DOM_VK_F3: number;
    static DOM_VK_F4: number;
    static DOM_VK_F5: number;
    static DOM_VK_F6: number;
    static DOM_VK_F7: number;
    static DOM_VK_F8: number;
    static DOM_VK_F9: number;
    static DOM_VK_F10: number;
    static DOM_VK_F11: number;
    static DOM_VK_F12: number;
    static DOM_VK_F13: number;
    static DOM_VK_F14: number;
    static DOM_VK_F15: number;
    static DOM_VK_F16: number;
    static DOM_VK_F17: number;
    static DOM_VK_F18: number;
    static DOM_VK_F19: number;
    static DOM_VK_F20: number;
    static DOM_VK_F21: number;
    static DOM_VK_F22: number;
    static DOM_VK_F23: number;
    static DOM_VK_F24: number;
    static DOM_VK_NUM_LOCK: number;
    static DOM_VK_SCROLL_LOCK: number;
    static DOM_VK_COMMA: number;
    static DOM_VK_PERIOD: number;
    static DOM_VK_SLASH: number;
    static DOM_VK_BACK_QUOTE: number;
    static DOM_VK_OPEN_BRACKET: number;
    static DOM_VK_BACK_SLASH: number;
    static DOM_VK_CLOSE_BRACKET: number;
    static DOM_VK_QUOTE: number;
    static DOM_VK_META: number;
    static SQUARE: number;
    static AMPERSAND: number;
    static E_ACCENT_RIGHT: number;
    static TILDE: number;
    static HASH: number;
    static APOSTROPHE: number;
    static LEFT_PARENTHESIS: number;
    static LEFT_BRACES: number;
    static RIGHT_BRACES: number;
    static E_ACCENT_LEFT: number;
    static UNDERSCORE: number;
    static C_UNDER: number;
    static CARAT: number;
    static A_ACCENT: number;
    static AT: number;
    static RIGHT_PARENTHESIS: number;
    static DEGREE: number;
    static TREMA: number;
    static CARAT_2: number;
    static POUND: number;
    static DOLLAR: number;
    static YEN: number;
    static U_GRAVE: number;
    static PERCENT: number;
    static MU: number;
    static QUESTION: number;
    static POINT: number;
    static COLON: number;
    static SECTION_SIGN: number;
    static EXCLAMATION: number;
    static ALT_GR: number;
    static LESS_THAN: number;
    static GREATER_THAN: number;
    /** Convert Qt key to DOM.
     *   @static
     *   @param {number} key - The qt key to convert
     *   @returns {number}
     */
    static qtToDOM(key: number): number;
    /** Check if the pressed key is a PAD number.
     *   @static
     *   @param {number} key - The key ID
     *   @returns {boolean}
     */
    static isKeyNumberPADPressed(key: number): boolean;
    /** Check if the pressed key is a number with shift.
     *   @static
     *   @param {number} key - The key ID
     *   @returns {boolean}
     */
    static isKeyNumberTopPressed(key: number): boolean;
    /** Check if the pressed key is a number.
     *   @static
     *   @param {number} key - The key ID
     *   @returns {boolean}
     */
    static isKeyNumberPressed(key: number): boolean;
    /** Get the char associated to the key.
     *   @static
     *   @param {number} key - The key ID
     *   @returns {string}
     */
    static getKeyChar(key: number): string;
    /** Get the string associated to the key
     *   @static
     *   @param {number} key - The key ID
     *   @returns {string}
     */
    static getKeyString(key: number): string;
}
export { KeyEvent };
