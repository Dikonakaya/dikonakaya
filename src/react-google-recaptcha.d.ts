declare module 'react-google-recaptcha' {
    import * as React from 'react';

    export type ReCAPTCHAProps = {
        sitekey: string;
        size?: 'compact' | 'normal' | 'invisible';
        tabIndex?: number;
        theme?: 'light' | 'dark';
        onChange?: (token: string | null) => void;
        onExpired?: () => void;
        onErrored?: () => void;
        badge?: 'bottomright' | 'bottomleft' | 'inline';
    } & React.HTMLAttributes<HTMLDivElement>;

    export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
        reset(): void;
        execute(): Promise<string | null> | void;
    }
}
