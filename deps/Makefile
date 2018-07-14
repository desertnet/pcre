# ----------------------------------------------------------------------
# Download and build PCRE2 library
# ----------------------------------------------------------------------

PCRE2_VERSION=10.31
PCRE2_TARBALL_URL=https://ftp.pcre.org/pub/pcre/pcre2-$(PCRE2_VERSION).tar.bz2

# ----------------------------------------------------------------------

.PHONY: all

all: build/local/include/pcre2.h build/local/lib/libpcre2-16.a

# ----------------------------------------------------------------------

build:
	mkdir -p build/local

# ----------------------------------------------------------------------

build/pcre2-$(PCRE2_VERSION).tar.bz2: | build
	curl -o build/pcre2-$(PCRE2_VERSION).tar.bz2 $(PCRE2_TARBALL_URL)

build/pcre2-$(PCRE2_VERSION): build/pcre2-$(PCRE2_VERSION).tar.bz2
	tar -xzf build/pcre2-$(PCRE2_VERSION).tar.bz2 -C build
	touch build/pcre2-$(PCRE2_VERSION)

build/local/include/pcre2.h build/local/lib/libpcre2-16.a: build/pcre2-$(PCRE2_VERSION)
	$(EMSCRIPTEN_DOCKER_RUN) sh -c " \
	  cd pcre2-$(PCRE2_VERSION) \
		&& emconfigure ./configure --prefix=/src/local \
		                          --disable-pcre2-8 \
			  											--enable-pcre2-16 \
															--disable-jit \
															--with-heap-limit=2000000 \
		&& emmake make \
		&& emmake make install \
	"

# ----------------------------------------------------------------------
