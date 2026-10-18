/**
 * Future is a wrapper around a native browser Promise to allow resolving/rejecting at any time
 */
export class Future<T> {
    public readonly promise: Promise<T>;
    // Code from StephenCleary https://gist.github.com/StephenCleary/ba50b2da419c03b9cba1d20cb4654d5e
    private _resolver!: (value: T) => void;
    private _rejecter!: (error: Error) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolver = resolve;
            this._rejecter = reject;
        });
    }

    private _isCompleted: boolean = false;

    public get isCompleted(): boolean {
        return this._isCompleted;
    }

    public resolve(value: T): void {
        if (this._isCompleted) {
            return;
        }
        this._isCompleted = true;
        this._resolver(value);
    }

    public reject(error: Error): void {
        if (this._isCompleted) {
            return;
        }
        this._isCompleted = true;
        this._rejecter(error);
    }
}
