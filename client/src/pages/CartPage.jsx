import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../components/Navbar";
import { useQuery,useMutation } from "react-query";
import midtransConfig from "../config/midtrans";
import { FaSellcast } from "react-icons/fa";
const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartList, setCartList] = useState([]);
  let navigate = useNavigate()

  const getCartList = async () => {
    // Men-set isLoading menjadi true sebelum melakukan request data cart
    setIsLoading(true);
    try {
      // Mengambil data keranjang belanja user menggunakan HTTP GET request menggunakan axios
      const res = await API.get("/cart-user");
      // Menyimpan hasil data ke dalam state variable cartList
      setCartList(res.data.data);
    } catch (error) {
      // Jika terdapat error pada HTTP request, pesan error akan dicetak pada console log
      console.log(error.response.data.message);
    } finally {
      // Memastikan isLoading diubah menjadi false meskipun terjadi error pada request
      setIsLoading(false);
    }
  };
  
  const handlePayment = useMutation(async () => {
    try {
      // Men-set isLoading menjadi true sebelum menampilkan pop-up konfirmasi pembayaran
      setIsLoading(true);
      // Menampilkan pop-up konfirmasi pembayaran menggunakan library SweetAlert2
      const { value } = await Swal.fire({
        icon: "question",
        text: "Confirm your order?",
        showCancelButton: true,
      });
      if (value) {
        // Melakukan HTTP POST request untuk transaksi menggunakan axios
        const res = await API.post("/transaction");
        console.log(res);
        // Mendapatkan token dari response untuk membuka pop-up payment gateway menggunakan Snap.js
        const token = res.data.data.token;
  
        // @ts-expect-error
        window.snap.pay(token, {
          onSuccess: function (result) {
            /* You may add your own implementation here */
            // Ketika pembayaran sukses, akan kembali ke halaman profile user
            console.log(result);
            navigate("/user/profile");
          },
          onPending: function (result) {
            /* You may add your own implementation here */
            // Ketika pembayaran tertunda, akan kembali ke halaman profile user
            console.log(result);
            navigate("/user/profile");
          },
          onError: function (result) {
            /* You may add your own implementation here */
            // Ketika terdapat error pada proses pembayaran, akan kembali ke halaman profile user
            console.log(result);
            navigate("/user/profile");
          },
          onClose: function () {
            /* You may add your own implementation here */
            // Ketika pop-up ditutup tanpa menyelesaikan pembayaran, akan muncul alert
            alert("you closed the popup without finishing the payment");
          },
        });
      }
    } catch (error) {
      // Jika terdapat error pada HTTP request, pesan error akan dicetak pada console log
      console.log(error);
    } finally {
      // Memastikan isLoading diubah menjadi false meskipun terjadi error pada request atau pembayaran
      setIsLoading(false);
    }
  });
  

  useEffect(() => {
    // URL script Midtrans yang digunakan untuk memuat library Snap.js
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
  
    // Client Key Midtrans
    const myMidtransClientKey = midtransConfig.clientKey;
  
    // Membuat tag <script> dengan sumber (src) sesuai midtransScriptUrl
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
  
    // Menambahkan attribute data-client-key pada tag <script> untuk menginisialisasi Snap.js menggunakan client key
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
  
    // Menambahkan tag <script> ke dalam elemen <body> pada halaman web
    document.body.appendChild(scriptTag);
  
    // Cleanup function ketika komponen React di-unmount atau component berubah
    return () => {
      // Menghapus tag <script> dari elemen <body>
      document.body.removeChild(scriptTag);
    };
  }, []);
  
  const handleDelete = async (data) => {
    try {
      // Menampilkan pop-up konfirmasi penghapusan buku dari keranjang belanja
      const { value } = await Swal.fire({
        icon: "warning",
        text: "Remove book from cart?",
        showCancelButton: true,
      });
      if (value) {
       
        const res = await API.delete("/cart/" + data.bookId);
        console.log("response delete cart = ", res);
       
        getCartList();
       
        data.refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const formatRp = (number) => {
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };
  
  useEffect(() => {
  
    getCartList();
  }, []);
  
  return (
    <>
    <NavbarUser />
    <div className="px-5 md:px-20">
      <h1 className="mt-1 font-bold text-xl" style={{marginLeft:"260px"}}>My Cart</h1>
      <p  style={{marginLeft:"260px"}} className="mt-1">Review Your Product</p>
      <div className="mt-3 flex flex-col md:flex-row gap-6">
        {cartList?.cart?.length === 0 ? (
          <div>No Books In Cart</div>
        ) : (
          <>
            <div className="border-y-2 py-2 flex flex-col gap-3 md:w-3/5">
            {cartList?.cart?.map((book) => (  
  <BookCart                      
    book={book}                   
    key={book}                   
    handleDelete={handleDelete}   
  />
))}

            </div>
            <div className="border-t-2 py-2 md:w-2/5" style={{position: "absolute", top: 140, right: 400}}>
  <div style={{color:"green", fontSize:"20px"}} className="flex justify-between py-2">
    <p>Subtotal</p>
    <p>{formatRp(cartList?.total_price)}</p>
  </div>
  <div className="flex justify-between py-2 ">
    <p>Qty</p>
    <p>{cartList?.cart?.length}</p>
  </div>
  <div style={{color:"red",fontSize:"25px"}} className="flex justify-between py-2 border-t-2">
    <p>Total Price</p>
    <p>{formatRp(cartList?.total_price)}</p>
  </div>
  <button style={{fontSize:"20px"}} // menentukan gaya tombol menggunakan properti style, dalam hal ini fontSize
    className="btn btn-outline-danger btn-sm" // menentukan class CSS tombol agar tampilan sesuai keinginan
    onClick={()=>{handlePayment.mutate()}} // memberikan sebuah fungsi yang akan terpanggil ketika tombol ditekan, dalam hal ini untuk menjalankan mutation handlePayment
    disabled={isLoading} // menonaktifkan tombol ketika isLoading bernilai true (sedang memuat)
  >
  {isLoading ? "Loading..." : "Pay" }<FaSellcast style={{fontSize:"20px"}}/> 
</button>

</div>

          </>
        )}
      </div>
    </div>
    </>
  );
};

// Membuat functional component BookCart dengan props book dan handleDelete.
const BookCart = ({ book, handleDelete }) => {
  // Menyiapkan state untuk menyimpan data buku.
  const [bookData, setBookData] = useState();
  
  // Membuat async function getBook untuk mengambil data buku dari API menggunakan method get.
  const getBook = async () => {
    // Mengambil data buku dengan id tertentu melalui endpoint /book/:id
    const res = await API.get("/book/" + book);
    // Mengupdate state bookData dengan data buku yang telah diambil.
    setBookData(res.data.data);
  };

  // Menggunakan useQuery, state refetch akan bersifat immutable dan berisi jumlah item dalam keranjang.
  let { refetch } = useQuery("cartUserLengthCache", async () => {
    // Mengambil data keranjang user dari endpoint /cart-user
    const res = await API.get("/cart-user");
    // Mengembalikan jumlah item dalam keranjang user untuk disimpan pada state refetch.
    return res.data.data
  });

  // useEffect digunakan untuk menjalankan sebuah effect hanya pada kondisi tertentu seperti pada saat rendering component.
  useEffect(() => {
    // Menjalankan async function getBook saat BookCart dirender.
    getBook();
  }, []);

  // Function formatRp digunakan untuk memformat harga menjadi mata uang Rupiah.
  const formatRp = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // useState digunakan untuk menyimpan status isLoading saat proses fetching data sedang dilakukan.
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex gap-2">
      <div style={{width:"500px",marginLeft:"260px"}}>
      <img src={bookData?.thumbnail} alt={bookData?.title} style={{width:"100%"}}  />
      </div>
      <div className="flex-1" style={{marginLeft:"260px"}}>
        <p className="font-bold">{bookData?.title}</p>
        <p className="mt-2">By {bookData?.author}</p>
        {bookData?.price && <p className="mt-4" style={{fontSize:"30px", color:"red"}}>{formatRp(bookData?.price)}</p>}
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"center"}}>
        <div style={{width:"100%",display:"flex",justifyContent:"end",marginRight:"300px"}}>
        <button
          className="btn btn-outline-danger btn-sm fw-bold"
          disabled={isLoading}
          onClick={() => handleDelete({bookId: bookData?.id, refetch})}
        >
          {isLoading ? "Loading..." : "Remove"}
        </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;