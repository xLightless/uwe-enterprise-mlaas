import React from 'react';
import { createPortal } from 'react-dom';
import { KeyboardCloseEvent } from '../../events/keyboard';

interface OverlayProps {
    children: React.ReactNode;
    className?: string;
    onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, className, onClose }) => {
    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500/75 z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {<KeyboardCloseEvent operation={onClose} />}
            <div className={`relative w-full max-w-lg ${className}`}>
                {children}
            </div>
        </div>,
        document.body
    )
};

export default Overlay;