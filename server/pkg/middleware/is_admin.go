package middleware

import (
	"net/http"
	dto "waysbooks/dto/result"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

// fungsi IsAdmin menerima sebuah handler `next` yang akan dipanggil jika pengguna (user) adalah admin

func IsAdmin(next echo.HandlerFunc) echo.HandlerFunc {
    // Closure function untuk melakukan pengecekan apakah user adalah admin
    return func(c echo.Context) error {

        // Mengambil data userLogin dari context
        userLogin := c.Get("userLogin")

        // Mengekstrak nilai role dari token JWT userLogin
        userRole := userLogin.(jwt.MapClaims)["role"].(string)

        // Jika nilai role bukan "admin", maka kembalikan response error status code 401 (Unauthorized) dengan pesan kesalahan
        if userRole != "admin" {
            return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Code: http.StatusUnauthorized, Message: "Unauthorize, only admin can access this"})
        }

        // jika pengguna adalah admin, panggil handler selanjutnya di rantai middleware
        return next(c)
    }
}

