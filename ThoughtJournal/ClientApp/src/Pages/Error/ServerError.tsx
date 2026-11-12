import { Head } from '@inertiajs/react';

export interface ServerErrorProps {
    message?: string;
    stackTrace?: string;
}

export default function ServerError({ message, stackTrace }: ServerErrorProps) {
    return (
        <>
            <Head title="Server Error" />
            <h1>500 Server Error</h1>
            {message && <p>{message}</p>}
            {stackTrace && <pre>{stackTrace}</pre>}
        </>
    );
}
