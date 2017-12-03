export abstract class ModalHost {
    abstract inputs: any;

    abstract resolve(): void;
    abstract close(): void;
}
