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
export default function parser(pathOrBinary: any, useBinary?: boolean): Promise<{
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
