# Backend Dockerfile
FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:3.20

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/main .
COPY tasks.json ./tasks.json

EXPOSE 8081

ENV PORT=8081
ENV DATA_FILE=/app/tasks.json

CMD ["./main"]