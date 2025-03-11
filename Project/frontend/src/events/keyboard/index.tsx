import { useEffect } from "react";

export type KeyboardInteractProps = {
    keyName: string;
    code: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    operation: () => void;
};

/**
 * Event handler for checking types of keyboard events.
 *
 * The event can handle multiple presses of keys before triggering an operation.
 * @param keyName - The name of the key to be pressed.
 * @param code - The code of the key to be pressed.
 * @param operation - The function to execute when the key(s) are pressed.
 */
const KeyboardEvent = ({ keyName, code, ctrlKey = false, shiftKey = false, altKey = false, operation }: KeyboardInteractProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === keyName &&
                event.code === code &&
                event.ctrlKey === ctrlKey &&
                event.shiftKey === shiftKey &&
                event.altKey === altKey
            ) {
                operation();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyName, code, ctrlKey, shiftKey, altKey, operation]);

    return null;
};



export const KeyboardCloseEvent = ({ operation }: { operation: () => void }) => (
    <KeyboardEvent keyName="Escape" code="Escape" operation={operation} />
);
