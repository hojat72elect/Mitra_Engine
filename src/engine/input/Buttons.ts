/**
 * Gamepad Buttons enumeration
 */
export enum Buttons {
    /**
     * Any button that isn't explicitly known by Mitra.
     */
    Unknown = -1,
    /**
     * Face 1 button (e.g. A)
     */
    Face1 = 0,
    /**
     * Face 2 button (e.g. B)
     */
    Face2 = 1,
    /**
     * Face 3 button (e.g. X)
     */
    Face3 = 2,
    /**
     * Face 4 button (e.g. Y)
     */
    Face4 = 3,
    /**
     * Left bumper button
     */
    LeftBumper = 4,
    /**
     * Right bumper button
     */
    RightBumper = 5,
    /**
     * Left trigger button
     */
    LeftTrigger = 6,
    /**
     * Right trigger button
     */
    RightTrigger = 7,
    /**
     * Select button
     */
    Select = 8,
    /**
     * Start button
     */
    Start = 9,
    /**
     * Left analog stick press (e.g. L3)
     */
    LeftStick = 10,
    /**
     * Right analog stick press (e.g. R3)
     */
    RightStick = 11,
    /**
     * D-pad up
     */
    DpadUp = 12,
    /**
     * D-pad down
     */
    DpadDown = 13,
    /**
     * D-pad left
     */
    DpadLeft = 14,
    /**
     * D-pad right
     */
    DpadRight = 15,
    /**
     * Center button (e.g. the Nintendo Home Button)
     */
    CenterButton = 16,
    /**
     * Misc button 1 (e.g. Xbox Series X share button, PS5 microphone button, Nintendo Switch Pro capture button, Amazon Luna microphone button)
     * defacto standard not listed on the w3c spec for a standard gamepad https://w3c.github.io/gamepad/#dfn-standard-gamepad
     */
    MiscButton1 = 17
}
