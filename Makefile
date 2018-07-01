# ----------------------------------------------------------------------
# Compile dependencies and our bridge C code to WebAssembly,
# using emscripten.
# ----------------------------------------------------------------------

EMSCRIPTEN_DOCKER_RUN=docker run --rm -v $(CURDIR)/deps/build:/src -u emscripten trzeci/emscripten
CC=$(EMSCRIPTEN_DOCKER_RUN) emcc

export

# ----------------------------------------------------------------------

.PHONY: all deps

all: dist/libpcre2.js dist/libpcre2.wasm

dist:
	mkdir -p dist

deps:
	$(MAKE) -C deps

# ----------------------------------------------------------------------

dist/libpcre2.js dist/libpcre2.wasm: src/lib/libpcre2.c | deps dist
	cat src/lib/libpcre2.c | $(CC) -s WASM=1 -I/src/local/include -L/src/local/lib -lpcre2-16 -o libpcre2.js -
	cp deps/build/libpcre2.{js,wasm} dist/

# ----------------------------------------------------------------------
