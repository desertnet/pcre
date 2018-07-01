#include <emscripten/emscripten.h>

#define PCRE2_CODE_UNIT_WIDTH 16
#include <pcre2.h>

EMSCRIPTEN_KEEPALIVE
void foo () {
  return;
}
