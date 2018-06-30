# ----------------------------------------------------------------------
# Compile PCRE2 library to WebAssembly with emscripten
# ----------------------------------------------------------------------

PCRE2_VERSION=10.31
PCRE2_TARBALL_URL=https://ftp.pcre.org/pub/pcre/pcre2-$(PCRE2_VERSION).tar.bz2

EMSCRIPTEN_DOCKER_RUN=docker run --rm -v $(CURDIR)/build:/src -u emscripten trzeci/emscripten
CC=$(EMSCRIPTEN_DOCKER_RUN) emcc

# ----------------------------------------------------------------------

.PHONY: all libpcre2

all: wasm/pcre2.wasm

# ----------------------------------------------------------------------

wasm:
	mkdir wasm

build:
	mkdir -p build/local

build/pcre2.c: src/lib/pcre2.c | build
	cp -a src/lib/pcre2.c build/

# ----------------------------------------------------------------------

build/pcre2-$(PCRE2_VERSION).tar.bz2: | build
	curl -o build/pcre2-$(PCRE2_VERSION).tar.bz2 $(PCRE2_TARBALL_URL)

build/pcre2-$(PCRE2_VERSION): build/pcre2-$(PCRE2_VERSION).tar.bz2
	tar -xzf build/pcre2-$(PCRE2_VERSION).tar.bz2 -C build
	touch build/pcre2-$(PCRE2_VERSION)

libpcre2: build/local/include/pcre2.h build/local/lib/libpcre2-16.a
build/local/include/pcre2.h build/local/lib/libpcre2-16.a: build/pcre2-$(PCRE2_VERSION)
	$(EMSCRIPTEN_DOCKER_RUN) sh -c " \
	  cd pcre2-$(PCRE2_VERSION) \
		&& emconfigure ./configure --prefix=/src/local \
		                          --disable-pcre2-8 \
			  											--enable-pcre2-16 \
				  										--disable-shared \
					  									--enable-static \
		&& emmake make \
		&& emmake make install \
	"

build/pcre2.wasm: libpcre2 build/pcre2.c
	$(CC) pcre2.c -s WASM=1 -I/src/local/include -L/src/local/lib -lpcre2-16 -o pcre2.js

wasm/pcre2.wasm: build/pcre2.wasm | wasm
	cp build/pcre2.wasm wasm/

# ----------------------------------------------------------------------
