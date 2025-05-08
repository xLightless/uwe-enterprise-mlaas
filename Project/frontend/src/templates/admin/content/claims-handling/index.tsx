import React, { useEffect } from 'react';
import PaginatedTable from '../system-activity/network-activity/components/paginated-table';
import { AdminGetClaimsByStatus, mapAdminGetClaimsByStatus, TableRow } from '../../../../common/interfaces';
import { adminBulkUpdateClaims, adminGetClaimsByStatus } from '../../../../repositories/claims';
import Overlay from '../../../../components/overlay';

const ClaimsHandling: React.FC = () => {
    const [pendingClaims, setPendingClaims] = React.useState<AdminGetClaimsByStatus | null>(null);
    const [approvedClaims, setApprovedClaims] = React.useState<AdminGetClaimsByStatus | null>(null);
    const [rejectedClaims, setRejectedClaims] = React.useState<AdminGetClaimsByStatus | null>(null);
    // const [settledClaims, setSettledClaims] = React.useState<AdminGetClaimsByStatus | null>(null);

    const [allClaims, setAllClaims] = React.useState<AdminGetClaimsByStatus | null>(null);

    const tableHeads = [
        // "claimId",
        "userEmail",
        "userName",
        "accidentType",
        "accidentDate",
        "status",
        "predictedSettlement",
        // "settledAmount",
        "dominantInjury",
        "vehicleType",
        "actions"
    ];

    async function fetchClaims() {
        const fetchAllClaims = await adminGetClaimsByStatus("all");
        const fetchPendingClaims = await adminGetClaimsByStatus("pending");
        const fetchApprovedClaims = await adminGetClaimsByStatus("approved");
        const fetchRejectedClaims = await adminGetClaimsByStatus("rejected");
        // const fetchSettledClaims = await adminGetClaimsByStatus("settled");
        const mappedPendingClaims = mapAdminGetClaimsByStatus(fetchPendingClaims as unknown as Record<string, unknown>);
        const mappedApprovedClaims = mapAdminGetClaimsByStatus(fetchApprovedClaims as unknown as Record<string, unknown>);
        const mappedRejectedClaims = mapAdminGetClaimsByStatus(fetchRejectedClaims as unknown as Record<string, unknown>);
        // const mappedSettledClaims = mapAdminGetClaimsByStatus(fetchSettledClaims as unknown as Record<string, unknown>);
        setPendingClaims(mappedPendingClaims);
        setApprovedClaims(mappedApprovedClaims);
        setRejectedClaims(mappedRejectedClaims);
        // setSettledClaims(mappedSettledClaims);


        const mappedAllClaims = mapAdminGetClaimsByStatus(fetchAllClaims as unknown as Record<string, unknown>);
        setAllClaims(mappedAllClaims);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function onNextPageEvent(page: number) {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function onPreviousPageEvent(page: number) {};

    const [selectedClaims, setSelectedClaims] = React.useState<number[]>([]);
    const [toggleBulkSelection, setToggleBulkSelection] = React.useState<boolean>(false);

    async function onButtonApprove() {
        if (selectedClaims.length > 0) {
            await adminBulkUpdateClaims(selectedClaims, "approved")
            const response = await adminGetClaimsByStatus("approved");
            const mappedApprovedClaims = mapAdminGetClaimsByStatus(response as unknown as Record<string, unknown>);
            setApprovedClaims(mappedApprovedClaims);
        }
    };

    async function onButtonReject() {
        if (selectedClaims.length > 0) {
            await adminBulkUpdateClaims(selectedClaims, "rejected")
            const response = await adminGetClaimsByStatus("rejected");
            const mappedRejectedClaims = mapAdminGetClaimsByStatus(response as unknown as Record<string, unknown>);
            setRejectedClaims(mappedRejectedClaims);
        }
    };

    async function onButtonExport() {
        if (selectedClaims.length > 0) {
            return Error("Exporting claims is not implemented yet.");
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    return (
        <div className="w-full h-full grid grid-rows-[0.25fr_1fr]">
            <div className='w-full h-full grid grid-rows-[auto_1fr]'>
                <div>
                    <h1 className='font-bold text-2xl'>Claims Handling</h1>
                    <p className='text-sm text-gray-500'>Manage and review claims.</p>

                    {/* Statistics about pending claims */}
                    <div className='grid grid-cols-3 gap-4 mt-4'>
                        <div className='bg-white shadow-md rounded-lg p-4'>
                            <h2 className='text-lg font-semibold'>Pending Claims</h2>
                            <p className='text-2xl font-bold'>{pendingClaims?.claims ? Math.max(...pendingClaims.claims.map(claim => claim.claimId).filter((id): id is number => id !== undefined)) : 0}</p>
                        </div>
                        <div className='bg-white shadow-md rounded-lg p-4'>
                            <h2 className='text-lg font-semibold'>Approved Claims</h2>
                            <p className='text-2xl font-bold'>{approvedClaims?.claims ? Math.max(...approvedClaims.claims.map(claim => claim.claimId || 0)) : 0}</p>
                        </div>
                        <div className='bg-white shadow-md rounded-lg p-4'>
                            <h2 className='text-lg font-semibold'>Rejected Claims</h2>
                            <p className='text-2xl font-bold'>{rejectedClaims?.claims ? Math.max(...rejectedClaims.claims.map(claim => claim.claimId || 0)) : 0}</p>
                        </div>
                        {/* <div className='bg-white shadow-md rounded-lg p-4'>
                            <h2 className='text-lg font-semibold'>Settled Claims</h2>
                            <p className='text-2xl font-bold'>{settledClaims?.claims ? Math.max(...settledClaims.claims.map(claim => claim.claimId || 0)) : 0}</p>
                        </div> */}
                    </div>
                </div>

                <div className='my-4 flex justify-center items-center w-full'>
                    {/* Update Status Buttons */}
                    <div className='w-full flex flex-row justify-start items-center gap-2 bg-gray-200 rounded-lg shadow-md py-4 px-2'>
                        <div className='w-full flex flex-row justify-between items-center'>
                            <div className='space-x-2'>
                                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-400' onClick={() => onButtonApprove()}>Approve</button>
                                <button className='bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-400' onClick={() => onButtonReject()}>Reject</button>
                            </div>

                            <div className='space-x-2'>
                                <button className='bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-400' onClick={() => onButtonExport()}>Export</button>
                                <button className='bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400' onClick={() => setToggleBulkSelection(true)}>Selected</button>
                            </div>
                        </div>
                    </div>

                    {/* Selected Items */}
                    {toggleBulkSelection &&
                        <Overlay onClose={() => setToggleBulkSelection(false)} className='max-w-6xl'>
                            <div className="bg-white rounded grid grid-rows-[auto_1fr_auto] p-4">
                                <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                                    <h1 className="font-bold">Selected Users Preview</h1>
                                </div>

                                <PaginatedTable
                                        thead={tableHeads}
                                        tbody={selectedClaims.map((claimId) => {
                                            const claim = allClaims?.claims.find((claim) => claim.claimId === claimId);
                                            return {
                                                claimId: claim?.claimId,
                                                userEmail: claim?.userEmail,
                                                userName: claim?.userName,
                                                accidentType: claim?.accidentType,
                                                accidentDate: claim?.accidentDate,
                                                status: claim?.status,
                                                predictedSettlement: claim?.predictedSettlement,
                                                dominantInjury: claim?.dominantInjury,
                                                vehicleType: claim?.vehicleType,
                                            };
                                        }) as unknown as TableRow[]}
                                        placeHolder={`Search selected claims...`}
                                        maxRowsPerPage={10}
                                        onCloseValue={false}
                                        onClose={() => {}}
                                        onNextPageEvent={() => onNextPageEvent}
                                        onPreviousPageEvent={() => onPreviousPageEvent}
                                    >
                                        <></>
                                </PaginatedTable>
                            </div>
                        </Overlay>
                    }
                </div>
            </div>

            {/* Table */}
            <div className='space-y-4'>
                {allClaims &&
                    <PaginatedTable
                        thead={tableHeads}
                        tbody={[
                            ...(allClaims?.claims?.map((claim) => ({
                                claimId: claim.claimId,
                                userEmail: claim.userEmail,
                                userName: claim.userName,
                                accidentType: claim.accidentType,
                                accidentDate: claim.accidentDate,
                                status: claim.status,
                                predictedSettlement: claim.predictedSettlement,
                                dominantInjury: claim.dominantInjury,
                                vehicleType: claim.vehicleType,
                                actions: (
                                    <div className="flex space-x-2 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox text-blue-600 border-gray-300 rounded"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    if (claim.claimId !== undefined) {
                                                        setSelectedClaims((prev) => claim.claimId !== undefined ? [...prev, claim.claimId] : prev);
                                                    }
                                                } else {
                                                    setSelectedClaims((prev) =>
                                                        prev.filter((id) => id !== claim.claimId)
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                ),
                            })) || []) as unknown as TableRow[],
                        ]}
                        placeHolder={`Search claims...`}
                        maxRowsPerPage={10}
                        onCloseValue={false}
                        onClose={() => {}}
                        onNextPageEvent={() => onNextPageEvent}
                        onPreviousPageEvent={() => onPreviousPageEvent}
                        disableNextLastPage={true}
                        disablePreviousFirstPage={true}
                    >
                        <></>
                    </PaginatedTable>
                }

                {!allClaims &&
                    <div className='flex flex-col items-center justify-center h-full'>
                        <div className="col-span-2 w-full h-full flex justify-center items-center">
                            <div role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div><p className='text-gray-500 font-bold'>Loading claims...</p></div>
                    </div>
                }

            </div>
        </div>
    )
};

export default ClaimsHandling;