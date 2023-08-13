package jwt

import (
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

var SecretKey = os.Getenv("SECRET_KEY")

func GenerateToken(claims *jwt.MapClaims) (string, error) {
    // membuat objek token baru dengan menggunakan metode signing HMAC-SHA256 dan klaim yang diberikan
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    
    // menandatangani token dengan kunci rahasia yang disimpan pada variabel SecretKey 
    // dan menyimpan hasilnya pada variabel webtoken serta error pada variabel err
    webtoken, err := token.SignedString([]byte(SecretKey))

    // jika terdapat error, maka akan dikembalikan string kosong dan error yang terkait
    if err != nil {
        return "", err
    }

    // jika tidak ada error, maka akan dikembalikan token yang telah ditandatangani beserta nilai nil untuk error
    return webtoken, nil
}


// fungsi VerifyToken menerima string token sebagai input dan mengembalikan jwt.Token pointer dan error jika terjadi kesalahan.
func VerifyToken(tokenString string) (*jwt.Token, error) {
    // parsing token menggunakan jwt.Parse() dan callback function
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // memeriksa apakah tipe token adalah HMAC signing method
        if _, isValid := token.Method.(*jwt.SigningMethodHMAC); !isValid {
            // Jika tidak, akan mengembalikan error message "unexpected signing method: <alg>" dimana <alg> adalah algorithm yang digunakan pada header token.
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        // Mengembalikan Secretkey yang telah ditentukan sesuai dengan format yang diminta oleh interface.
        return []byte(SecretKey), nil
    })

    // jika terjadi kesalahan pada saat parsing token, maka akan mengembalikan nil dan error message.
    if err != nil {
        return nil, err
    }

    // jika parsing berhasil maka mengembalikan token tersebut dan nil.
    return token, nil
}



func DecodeToken(tokenString string) (jwt.MapClaims, error) {
   
    token, err := VerifyToken(tokenString)
    if err != nil {
       
        return nil, err
    }
   
    claims, isOk := token.Claims.(jwt.MapClaims)
    if isOk && token.Valid {

        return claims, nil
    }

   
    return nil, fmt.Errorf("invalid token")
}
