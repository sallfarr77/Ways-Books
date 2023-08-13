package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"
	bookdto "waysbooks/dto/book"
	dto "waysbooks/dto/result"
	"waysbooks/models"
	"waysbooks/repositories"

	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerBook struct {
	BookRepository        repositories.BookRepository
	TransactionRepository repositories.TransactionRepository
}

func HandlerBook(BookRepository repositories.BookRepository, TransactionRepository repositories.TransactionRepository) *handlerBook {
	return &handlerBook{BookRepository, TransactionRepository}
}

func (h *handlerBook) FindBooks(c echo.Context) error {
	keyword := c.QueryParam("keyword")
	var Books []models.Book
	var err error
	if keyword == "" {
		Books, err = h.BookRepository.FindBook()
	} else {
		Books, err = h.BookRepository.FindBookByKeyword(keyword)
	}
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	var BooksResponse []bookdto.BookResponse

	for _, Book := range Books {
		BooksResponse = append(BooksResponse, convertResponseBook(Book))
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "success", Data: BooksResponse})
}

func (h *handlerBook) GetBook(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	Book, err := h.BookRepository.GetBook(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "success", Data: convertResponseBook(Book)})
}

// fungsi CreateBook digunakan untuk membuat buku baru dan menambahkannya ke database
func (h *handlerBook) CreateBook(c echo.Context) error {
    // variabel context untuk mengatur waktu pengecekan saat upload thumbnail ke cloudinary
    var ctx = context.Background()

    // Membaca credential cloudinary dari variabel env
    var CLOUD_NAME = os.Getenv("CLOUD_NAME")
    var API_KEY = os.Getenv("API_KEY")
    var API_SECRET = os.Getenv("API_SECRET")

    // Mengambil nama file thumbnail dan file PDF buku dari context Echo setelah melalui proses middleware UploadFileToDisk()
    thumbnail := c.Get("dataFile").(string)
    bookPDF := c.Get("dataPdf").(string)

    // Parsing string ke nilai tanggal
    times := c.FormValue("publication_date")
    layout := "2006-01-02"
    publicationDate, _ := time.Parse(layout, times)

    // Konversi string pages dan price ke tipe int
    pages, _ := strconv.Atoi(c.FormValue("pages"))
    price, _ := strconv.Atoi(c.FormValue("price"))

    // Inisialisasi struct request dengan nilai-nilai dari form yang disubmit pengguna
    request := bookdto.CreateBookRequest{
        Title:           c.FormValue("title"),
        Author:          c.FormValue("author"),
        PublicationDate: publicationDate,
        Pages:           pages,
        ISBN:            c.FormValue("isbn"),
        Price:           price,
        About:           c.FormValue("about"),
        Thumbnail:       thumbnail,
        Content:         bookPDF,
    }

    // Validasi input pengguna menggunakan package validator
    validation := validator.New()
    err := validation.Struct(request)
    if err != nil {
        // Jika terjadi kesalahan validasi, kembalikan response error status code 500 (Internal Server Error) dengan pesan kesalahan
        return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
    }

    // Cek apakah ISBN buku sudah ada di database
    checkBook, _ := h.BookRepository.CheckExistISBN(request.ISBN)
    if checkBook.ID != 0 {
        // Jika ISBN sudah ada, kembalikan response error status code 400 (Bad Request) dengan pesan kesalahan
        return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "ISBN already exists"})
    }

    // Upload thumbnail ke layanan cloudinary
    cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
    respThumbnail, err := cld.Upload.Upload(ctx, request.Thumbnail, uploader.UploadParams{Folder: "waysbooks/thumbnail"})

    if err != nil {
        fmt.Println(err.Error())
    }

    // Buat objek Book baru
    Book := models.Book{
        Title:             request.Title,
        Author:            request.Author,
        PublicationDate:   request.PublicationDate,
        Pages:             request.Pages,
        Price:             request.Price,
        ISBN:              request.ISBN,
        About:             request.About,
        Thumbnail:         respThumbnail.SecureURL,
        Content:           request.Content,
        ThumbnailPublicID: respThumbnail.PublicID,
        ContentPublicID:   "",
        CreatedAt:         time.Now(),
        UpdatedAt:         time.Now(),
    }

    // Tambahkan buku ke database
    Book, err = h.BookRepository.CreateBook(Book)

    if err != nil {
        // Jika terjadi kesalahan saat menambahkan buku ke database, kembalikan response error status code 500 (Internal Server Error) dengan pesan kesalahan
        return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
    }

    // Jika sukses, kembalikan response dengan data buku yang baru dibuat dalam bentuk DTO SuccessResult
    return c.JSON(http.StatusOK, dto.SuccessResult{Status: "success", Data: convertResponseBook(Book)})
}


func (h *handlerBook) UpdateBook(c echo.Context) error {
	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	id, _ := strconv.Atoi(c.Param("id"))

	Book, err := h.BookRepository.GetBook(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	thumbnail := c.Get("dataFile").(string)
	bookPDF := c.Get("dataFilePDF").(string)

	publicationDate, _ := time.Parse("2021-11-22", c.FormValue("publication_date"))
	pages, _ := strconv.Atoi(c.FormValue("pages"))
	price, _ := strconv.Atoi(c.FormValue("price"))

	request := bookdto.UpdateBookRequest{
		Title:           c.FormValue("title"),
		Author:          c.FormValue("author"),
		PublicationDate: publicationDate,
		Pages:           pages,
		ISBN:            c.FormValue("ISBN"),
		Price:           price,
		About:           c.FormValue("about"),
		Thumbnail:       thumbnail,
		Content:         bookPDF,
	}

	if request.Title != "" {
		Book.Title = request.Title
	}
	if request.Author != "" {
		Book.Author = request.Author
	}
	if !request.PublicationDate.IsZero() {
		Book.PublicationDate = request.PublicationDate
	}
	if request.About != "" {
		Book.About = request.About
	}

	if request.ISBN != "" {
		Book.ISBN = request.ISBN
	}
	if request.Price != 0 {
		Book.Price = request.Price
	}
	if request.Pages != 0 {
		Book.Pages = request.Pages
	}

	if request.Thumbnail != "" {
		if Book.ThumbnailPublicID != "" {
			_, err = cld.Upload.Destroy(ctx, uploader.DestroyParams{PublicID: Book.ThumbnailPublicID})
			if err != nil {
				fmt.Println(err.Error())
			}
		}
		respThumbnail, err := cld.Upload.Upload(ctx, request.Thumbnail, uploader.UploadParams{Folder: "waysbooks/thumbnail"})

		if err != nil {
			fmt.Println(err.Error())
		}
		Book.Thumbnail = respThumbnail.SecureURL
	}

	if request.Content != "" {
		// Handle Delete Cloudinary
		// if Book.ContentPublicID != "" {
		// 	_, err = cld.Upload.Destroy(ctx, uploader.DestroyParams{PublicID: Book.ContentPublicID})
		// 	if err != nil {
		// 		fmt.Println(err.Error())
		// 	}
		// }
		// respPDF, err := cld.Upload.Upload(ctx, request.Content, uploader.UploadParams{Folder: "waysbooks/books"})

		// if err != nil {
		// 	fmt.Println(err.Error())
		// }
		// Book.Thumbnail = respPDF.SecureURL
		Book.Content = request.Content
	}

	Book.UpdatedAt = time.Now()

	Book, err = h.BookRepository.UpdateBook(Book)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "success", Data: convertResponseBook(Book)})
}

func (h *handlerBook) DeleteBook(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	Book, err := h.BookRepository.GetBook(id)

	if Book.ThumbnailPublicID != "" {
		_, err = cld.Upload.Destroy(ctx, uploader.DestroyParams{PublicID: Book.ThumbnailPublicID})
		if err != nil {
			fmt.Println(err.Error())
		}
	}

	if Book.ContentPublicID != "" {
		_, err = cld.Upload.Destroy(ctx, uploader.DestroyParams{PublicID: Book.ContentPublicID})
		if err != nil {
			fmt.Println(err.Error())
		}
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	Book, err = h.BookRepository.DeleteBook(Book)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "success", Data: convertResponseBook(Book)})
}

func (h *handlerBook) GetUserBooks(c echo.Context) error {
	userLogin := c.Get("userLogin")
	idUserLogin := int(userLogin.(jwt.MapClaims)["id"].(float64))

	// Cek if user already purchased this book by success transaction
	userTransactions, err := h.TransactionRepository.FindTransactionByUserID(idUserLogin, "success")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	var idBooksPurchased []int
	for _, transaction := range userTransactions {
		for _, book := range transaction.Book {
			idBooksPurchased = append(idBooksPurchased, book.ID)
		}
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "success", Data: idBooksPurchased})
}


func convertResponseBook(b models.Book) bookdto.BookResponse {
	return bookdto.BookResponse{
		ID:              b.ID,
		Title:           b.Title,
		Author:          b.Author,
		PublicationDate: b.PublicationDate,
		Price:           b.Price,
		Pages:           b.Pages,
		ISBN:            b.ISBN,
		About:           b.About,
		Thumbnail:       b.Thumbnail,
		Content:         b.Content,
		CreatedAt:       b.CreatedAt,
		UpdatedAt:       b.UpdatedAt,
	}
}
