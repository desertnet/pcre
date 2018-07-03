#include <emscripten/emscripten.h>

#define PCRE2_CODE_UNIT_WIDTH 16
#include <pcre2.h>

#define ERROR_INVALID_COMPILE_FLAG -1

EMSCRIPTEN_KEEPALIVE
size_t version (uint16_t* result) {
  return pcre2_config(PCRE2_CONFIG_VERSION, result);
}

static int pcreErrorCode = 0;
static PCRE2_SIZE pcreErrorOffset = 0;
static int ourErrorCode = 0;
static char badFlag = 0;

EMSCRIPTEN_KEEPALIVE
pcre2_code* compile (
  uint16_t* pattern,
  PCRE2_SIZE length,
  char* flags
) {
  // Clear any previous error codes.
  pcreErrorCode = 0;
  pcreErrorOffset = 0;
  ourErrorCode = 0;
  badFlag = 0;

  // Convert flags to PCRE2 options bitfield
  int options = PCRE2_UTF;
  for (int i = 0; flags[i] != 0; i++) {
    switch (flags[i]) {
      case 'm': options |= PCRE2_MULTILINE; break;
      case 's': options |= PCRE2_DOTALL; break;
      case 'i': options |= PCRE2_CASELESS; break;
      case 'x': options |= PCRE2_EXTENDED; break;
      default:
        ourErrorCode = ERROR_INVALID_COMPILE_FLAG;
        badFlag = flags[i];
        return NULL;
    }
  }

  return pcre2_compile(
    pattern, length, options,
    &pcreErrorCode, &pcreErrorOffset,
    NULL
  );
}
