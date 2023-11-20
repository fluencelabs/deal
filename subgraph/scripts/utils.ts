export type asyncRuntimeDecorator = (func: Function) => void

export const asyncRuntimeDecorator: asyncRuntimeDecorator = (func) => {
    func()
        .then(() => process.exit(0))
        .catch((error: any) => {
            console.error(error);
            process.exit(1);
        });
}
