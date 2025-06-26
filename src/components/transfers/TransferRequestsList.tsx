
import React from "react";

interface TransferRequestsListProps {
  user: any;
  transfers: any[];
}

const TransferRequestsList: React.FC<TransferRequestsListProps> = ({ user, transfers }) => {
  if (!transfers || transfers.length === 0) {
    return <p className="text-muted-foreground">No transfer requests yet.</p>;
  }
  return (
    <ul className="divide-y">
      {transfers.map((tr: any) => (
        <li key={tr.id} className="py-3">
          <div className="flex justify-between items-center">
            <span>
              <span className="font-semibold">{tr.slot.subject}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="">{tr.to.name}</span>
              <span className="ml-2 text-xs bg-gray-100 rounded-full px-2 py-0.5">
                {tr.status}
              </span>
            </span>
            <span className="text-xs text-gray-500">{tr.date}</span>
          </div>
          {tr.reason && (
            <div className="text-sm text-muted-foreground mt-1">Reason: {tr.reason}</div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TransferRequestsList;
