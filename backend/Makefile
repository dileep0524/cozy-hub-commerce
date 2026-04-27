.PHONY: run build test tidy clean

run:
	go run .

build:
	go build -o app .

test:
	go test ./... -v

tidy:
	go mod tidy

clean:
	rm -f app
