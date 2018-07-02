#include <emscripten/emscripten.h>

#define PCRE2_CODE_UNIT_WIDTH 16
#include <pcre2.h>

EMSCRIPTEN_KEEPALIVE
size_t version (uint16_t* result) {
  return pcre2_config(PCRE2_CONFIG_VERSION, result);
}
