import React from "react";
import Modal from "react-bootstrap/Modal";

const DetailTransaction = ({
  show,
  handleClose,
  transaction,
}) => {

 const formatRp = (number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(number);
      };
      


const dateFormat = (dateStr) => {
        const month = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        let date = new Date(dateStr);
      
        let dayName = days[date.getDay()];
        let dayMonth = date.getDate();
        let monthName = month[date.getMonth()];
        let year = date.getFullYear();
        return `${dayName}, ${dayMonth} ${monthName} ${year}`;
      };
      


  return (
    <>
      {transaction && (


       <Modal show={show} size="md" popup={true} onHide={handleClose} className="punten">
         <Modal.Header closeButton>
           <Modal.Title>Transaction Details</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <div className="px-2 pb-4 sm:pb-6 lg:px-2 xl:pb-2">
             <div>
               <p><strong>Transaction ID:</strong> {transaction.id}</p>
               <p><strong>Date:</strong> {dateFormat(transaction.created_at)}</p>
             </div>
             <div className="bg-light rounded flex flex-col gap-3 p-3">
               {transaction.books.map((book) => (
                 <div className="flex gap-4 bg-white p-3 rounded">
                   <img src={book.thumbnail} alt={book.title} style={{width: '100%', maxHeight: '200px'}} className="rounded-md"/>
                   <div className="flex flex-col justify-between w-full">
                     <div>
                       <p className="font-bold">{book.title}</p>
                       <p className="text-gray-500 text-sm">By {book.author}</p>
                     </div>
                     <p className="text-right">{formatRp(book.price)}</p>
                   </div>
                 </div>
               ))}
               <p className="mt-4"><strong>Total Price:</strong> {formatRp(transaction.total_price)}</p>
             </div>
           </div>
         </Modal.Body>
       </Modal>
       

      )}
    </>
  );
};

export default DetailTransaction;