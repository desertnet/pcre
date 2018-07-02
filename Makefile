# ----------------------------------------------------------------------
# Compile dependencies and our bridge C code to WebAssembly,
# using emscripten.
# ----------------------------------------------------------------------

EMSCRIPTEN_DOCKER_RUN=docker run --rm -v $(CURDIR)/deps/build:/src -v $(CURDIR)/src/lib:/src/lib -u emscripten trzeci/emscripten
CC=$(EMSCRIPTEN_DOCKER_RUN) emcc

export

# ----------------------------------------------------------------------

.PHONY: all deps

all: dist/libpcre2.js

dist:
	mkdir -p dist

deps:
	$(MAKE) -C deps

# ----------------------------------------------------------------------

dist/libpcre2.js: src/lib/libpcre2.c | deps dist
	$(CC) /src/lib/libpcre2.c \
		-s EXPORT_NAME=PCRE2 \
		-s WASM=1 \
		-s SINGLE_FILE=1 \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' \
		-I/src/local/include \
		-L/src/local/lib \
		-lpcre2-16 \
		-o libpcre2.js
	cp deps/build/libpcre2.js dist/

# ----------------------------------------------------------------------
