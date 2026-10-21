import {ExResponseType} from "./ExResponseType";

interface ExResponseTypesLookup {
    [name: string]: ExResponseType;
}

export class ExResponse {
    public static type: ExResponseTypesLookup = {
        any: '',
        blob: 'blob',
        json: 'json',
        text: 'text',
        document: 'document',
        arraybuffer: 'arraybuffer'
    };
}
