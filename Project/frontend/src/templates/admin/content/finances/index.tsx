import React from "react";

// Toggle Automatic Monthly Invoices
// Manually create invoices for existing users
// View system invoices and filter by Id, Date, time, price.

const CreateManualInvoices: React.FC = () => {
    return (
        <>Create Manual Invoices</>
    )
}

const Invoices: React.FC = () => {
    return (
        <div className="container-primary max-w-[1280px]">
            <h1>Invoices and payments</h1>
        </div>
    )
};

export {
    Invoices,
    CreateManualInvoices
}