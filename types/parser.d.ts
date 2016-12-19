/// <reference types="node" />
export declare function binaryParser(binaryFile: any): Promise<{
    meta: {
        title: {};
        author: {};
        publisher: {};
    };
    nav: any;
    flesh: {
        id: string;
        markdown: any;
    }[];
}>;
export interface ParserOptions {
    type?: 'binaryString' | 'path' | 'buffer';
}
export default function parser(target: string | Buffer, options?: ParserOptions): Promise<{
    meta: {
        title: {};
        author: {};
        publisher: {};
    };
    nav: any;
    flesh: {
        id: string;
        markdown: any;
    }[];
}>;
