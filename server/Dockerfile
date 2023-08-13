# Gunakan base image golang:latest
FROM golang:latest

# Set working directory di dalam container
WORKDIR /app

# Salin kode sumber aplikasi Anda ke dalam container
COPY . .

# Compile aplikasi Go
RUN go build -o Waysbook

# Command yang akan dijalankan saat container dijalankan
CMD ["./Waysbook"]

