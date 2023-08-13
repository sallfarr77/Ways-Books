package handlers

import (
	"net/http"
	"strconv"
	"strings"
	cartdto "waysbooks/dto/cart"
	dto "waysbooks/dto/result"
	"waysbooks/repositories"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository repositories.CartRepository
}

func HandlerCart(CartRepository repositories.CartRepository) *handlerCart {
	return &handlerCart{CartRepository}
}

func (h *handlerCart) AddToCart(c echo.Context) error {
	userLogin := c.Get("userLogin")
	idUserLogin := int(userLogin.(jwt.MapClaims)["id"].(float64))

	bookId := c.Param("id")
	bookIdInt, _ := strconv.Atoi(bookId)

	// Cek if user already purchased this book
	userTransactions, err := h.CartRepository.GetSuccessUserTransaction(idUserLogin)
	var idBooksPurchased []int
	for _, transaction := range userTransactions {
		for _, book := range transaction.Book {
			idBooksPurchased = append(idBooksPurchased, book.ID)
		}
	}

	var bookIsPurchased bool
	for _, purchasedBookId := range idBooksPurchased {
		if purchasedBookId == bookIdInt {
			bookIsPurchased = true
		}
	}

	if bookIsPurchased {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "Book already purchased"})
	}

	// Manipulate user cart
	profile, err := h.CartRepository.GetTemporaryUserCart(idUserLogin)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	userCart := strings.Split(profile.CartTmp, ",")
	var separator string
	if profile.CartTmp == "" {
		userCart = append(userCart, bookId)
		separator = ""
	} else {
		for _, item := range userCart {
			if item == bookId {
				return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "Book already in cart"})
			}
		}
		userCart = append(userCart, bookId)
		separator = ","
	}
	arrCart := strings.Join(userCart, separator)

	profile.CartTmp = arrCart
	_, err = h.CartRepository.UpdateTemporaryCart(profile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: "Failed to update cart"})
	}

	_, err = h.CartRepository.GetTemporaryUserCart(idUserLogin)

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: "Book added to cart"})
}

func (h *handlerCart) RemoveBookFromCart(c echo.Context) error {

	userLogin := c.Get("userLogin")
	idUserLogin := int(userLogin.(jwt.MapClaims)["id"].(float64))

	bookId := c.Param("id")

	profile, err := h.CartRepository.GetTemporaryUserCart(idUserLogin)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	userCart := strings.Split(profile.CartTmp, ",")
	findIdx := indexOf(bookId, userCart)

	if findIdx == -1 {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "Book is not in cart"})
	}
	filteredCart := remove(userCart, findIdx)
	var separator string
	if len(filteredCart) == 0 {
		separator = ""
	} else {
		separator = ","
	}

	newCart := strings.Join(filteredCart, separator)

	profile.CartTmp = newCart
	_, err = h.CartRepository.UpdateTemporaryCart(profile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: "Book removed from cart"})
}

func (h *handlerCart) GetUserCartList(c echo.Context) error {
    idUserLogin := int((c.Get("userLogin").(jwt.MapClaims)["id"]).(float64))

    // mengambil data keranjang sementara pengguna
    userProfile, err := h.CartRepository.GetTemporaryUserCart(idUserLogin)
    if err != nil {
        // jika terjadi error saat mengambil data keranjang sementara, tampilkan response error
        return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
    }
    
    // mengambil isi keranjang sementara pengguna pada variabel userCart
    userCart := userProfile.CartTmp
    
    // membuat variabel baru cartResp dengan tipe data cartdto.CartResponse
    var cartResp cartdto.CartResponse
    
    // jika isi keranjang kosong
    if userCart == "" {
        // inisialisasi variabel cartResp dengan nilai default dan tampilkan response success
        cartResp = cartdto.CartResponse{
            BookCart:   []int{},
            TotalPrice: 0,
        }
        return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: cartResp})
    }  
    
    // memisahkan dan menyimpan ID item yang ada di keranjang sementara pengguna pada array arrUserCart
    arrUserCart := strings.Split(userCart, ",")
    
    // loop melalui setiap item yang ada di array arrUserCart
    for _, item := range arrUserCart {
        // mengkonversi item dari string ke integer 
        itemInt, _ := strconv.Atoi(item)
        
        // menambahkan item ke dalam array BookCart pada cartResp
        cartResp.BookCart = append(cartResp.BookCart, itemInt)
        
        // mengambil harga buku yang sesuai dari repositori
        price, err := h.CartRepository.GetProductPrice(itemInt)
        if err != nil {
            // jika terjadi error saat mengambil data harga produk, tampilkan response error
            return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
        }
        
        // menambahkan harga buku ke dalam variabel TotalPrice di cartResp
        cartResp.TotalPrice += price
    }

    // jika tidak terjadi error pada proses loop, tampilkan response success dengan data cartResp
    return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: cartResp})
}


func indexOf(element string, data []string) int {
    for k, v := range data { // iterasi setiap elemen pada slice dengan indeks k dan value v
        if element == v { // membandingkan nilai element dengan value v
            return k // jika sama, maka return indeks k
        }
    }
    return -1 // jika tidak ketemu, maka return -1 (not found)
}


func remove(slice []string, s int) []string {
    return append(slice[:s], slice[s+1:]...) // menghapus elemen di posisi s dan mengembalikan slice baru
}

