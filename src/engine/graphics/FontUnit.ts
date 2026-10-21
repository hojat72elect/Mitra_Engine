/**
 * Enum representing the different font size units
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 */
export enum FontUnit {
    /**
     * Em is a scalable unit, 1 em is equal to the current font size of the current element, parent elements can effect em values
     */
    Em = 'em',
    /**
     * Rem is similar to the Em, it is a scalable unit. 1 rem is equal to the font size of the root element
     */
    Rem = 'rem',
    /**
     * Pixel is a unit of length in screen pixels
     */
    Px = 'px',
    /**
     * Point is a physical unit length (1/72 of an inch)
     */
    Pt = 'pt',
    /**
     * Percent is a scalable unit similar to Em, the only difference is the Em units scale faster when Text-Size stuff
     */
    Percent = '%'
}