export interface IMailOptions {
    from?: string;
    to: string | Array<string>;
    subject: string;
    text?: string;
    html: string;
}