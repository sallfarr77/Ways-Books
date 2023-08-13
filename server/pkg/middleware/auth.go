package middleware

import (
	"net/http"
	"strings"
	dto "waysbooks/dto/result"
	jwtToken "waysbooks/pkg/jwt"

	"github.com/labstack/echo/v4"
)

type Result struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}


func Auth(next echo.HandlerFunc) echo.HandlerFunc {
    // Closure function untuk melakukan autentikasi JWT token
    return func(c echo.Context) error {

        // Mengambil token dari header HTTP Authorization
        token := c.Request().Header.Get("Authorization")

        // Jika header Authorization kosong, kembalikan response error status code 401 (Unauthorized) dengan pesan kesalahan
        if token == "" {
            return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized"})
        }

        // Memisahkan bearer token dari nilai header
        token = strings.Split(token, " ")[1]

        // Mendekode nilai token dan memeriksa apakah terjadi error
        claims, err := jwtToken.DecodeToken(token)
        if err != nil {
            // Jika terjadi error pada dekode token, kembalikan response error status code 401 (Unauthorized) dengan pesan kesalahan
            return c.JSON(http.StatusUnauthorized, Result{Code: http.StatusUnauthorized, Message: "unathorized"})
        }

        // Menyimpan nilai claims/token ke dalam context Echo sebagai "userLogin"
        c.Set("userLogin", claims)

        // Jika autentikasi berhasil, panggil handler selanjutnya di rantai middleware
        return next(c)
    }
}

