import React, { useState } from "react";
import { useQuery } from "react-query";
import { API } from "../config/api";
import DetailTransactionModal from "../components/modals/DeTail";
import Table from "react-bootstrap/Table";

const Transaction = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState();

  const handleShowDetail = (transaction) => {
    setTransactionDetail(transaction);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  

  const formatRp = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const transactionDateFormat = (dateToFormat) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateToFormat));
  };

  const fetchTransaction = async () => {
    const res = await API.get("/transactions");
    return res.data.data;
  };

  const { data: transactions } = useQuery("transactions", fetchTransaction);

  return (
    <div className="!bg-transparent mx-4 md:mx-28">
      <h3 className="font-bold py-3">Income Transaction</h3>

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Date</th>
            <th>Users</th>
            <th>Book Purchased</th>
            <th>Total Payment</th>
            <th>Status Payment</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions?.map((transaction, idx) => (
            <tr
              key={idx}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <td className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {transaction.id}
              </td>
              <td>{transactionDateFormat(transaction.created_at)}</td>
              <td>{transaction.user.name}</td>
              <td>
                {transaction.books.map((item) => item.title).join(", ")}
              </td>
              <td>{formatRp(transaction.total_price)}</td>
              <td>{transaction.status}</td>
              <td>
                <button
                  onClick={() => {
                    console.log(transaction);
                    handleShowDetail(transaction);
                  }}
                  className="btn btn-primary"
                >
                  View Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {transactionDetail && (
          <DetailTransactionModal
            show={showDetail}
            handleClose={handleCloseDetail}
            transaction={transactionDetail}
          />
        )}
      </Table>
    </div>
  );
};

export default Transaction;
