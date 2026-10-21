import type {Audio} from './Audio';
import type {ExResponseType} from "./ExResponseType";

/**
 * Represents an audio implementation like {@apilink WebAudioInstance}
 */
export interface AudioImplementation {
    /**
     * XHR response type
     */
    responseType: ExResponseType;

    /**
     * Processes raw data and transforms into sound data
     */
    processData(data: Blob | ArrayBuffer): Promise<string | AudioBuffer>;

    /**
     * Factory method that returns an instance of a played audio track
     */
    createInstance(data: string | AudioBuffer): Audio;
}
