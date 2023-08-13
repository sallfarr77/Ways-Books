package middleware

import (
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"

	"github.com/labstack/echo/v4"
)

const iMg = "png" // mendefinisikan konstanta iMg dengan nilai string "png"
const pDf = "pdf" // mendefinisikan konstanta pDf dengan nilai string "pdf"

// membuat fungsi middleware UploadFile menggunakan framework Echo
func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
    // mengembalikan fungsi handler
    return func(c echo.Context) error {
        // mengambil file dari form dengan parameter "photo"
        file, err := c.FormFile("photo")
        if err != nil { // jika gagal, mencoba mengambil file dengan parameter "thumbnail"
            file, err = c.FormFile("thumbnail")
            if err != nil { // jika tetap gagal, mengembalikan response Bad Request dengan error yang dihasilkan
                return c.JSON(http.StatusBadRequest, err)
            }
        }

        // memproses upload file gambar dengan menggunakan fungsi handleUpload
        data, err := handleUpload(file, iMg)
        if err != nil { // jika gagal, mengembalikan response Bad Request dengan error yang dihasilkan
            return c.JSON(http.StatusBadRequest, err)
        }
        
        // menyimpan data file hasil upload ke context dengan key "dataFile"
        c.Set("dataFile", data)
        return next(c)
    }
}

// membuat fungsi middleware UploadPdf menggunakan framework Echo
func UploadPdf(next echo.HandlerFunc) echo.HandlerFunc {
    // mengembalikan fungsi handler
    return func(c echo.Context) error {
        // mengambil file dari form dengan parameter "content"
        file, err := c.FormFile("content")
        if err != nil { // jika gagal, mengembalikan response Bad Request dengan error yang dihasilkan
            return c.JSON(http.StatusBadRequest, err)
        }

        // memproses upload file pdf dengan menggunakan fungsi handleUpload
        data, err := handleUpload(file, pDf)
        if err != nil { // jika gagal, mengembalikan response Bad Request dengan error yang dihasilkan
            return c.JSON(http.StatusBadRequest, err)
        }

        // menyimpan data file hasil upload ke context dengan key "dataPdf"
        c.Set("dataPdf", data)
        return next(c)
    }
}

// membuat fungsi handleUpload untuk memproses upload file
func handleUpload(file *multipart.FileHeader, ext string) (string, error) {
    // membuka file dan mengecek apakah ada error saat membuka file
    src, err := file.Open()
    if err != nil {
        return "", err
    }
    defer src.Close()

    // membuat file sementara dengan prefiks "file-" dan ekstensi sesuai nilai parameter ext
    tempFile, err := ioutil.TempFile("uploads", "file-*."+ext)
    if err != nil {
        return "", err
    }
    defer tempFile.Close()

    // menulis isi file dari file yang diupload ke file sementara
    if _, err = io.Copy(tempFile, src); err != nil {
        return "", err
    }

    // mengembalikan path dari file sementara sebagai string
    data := tempFile.Name()
    return data, nil
}
