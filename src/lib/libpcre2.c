#include <emscripten/emscripten.h>

#define PCRE2_CODE_UNIT_WIDTH 16
#include <pcre2.h>

// --------------------------------------------------------------------

static int _lastErrorCode = 0;
static PCRE2_SIZE _lastErrorOffset = 0;

EMSCRIPTEN_KEEPALIVE
PCRE2_SIZE lastErrorMessage (uint16_t* buffer, size_t bufferLength) {
  // Going to trust that buffer is large enough for all messages, because
  // we are the only callers of this function, and we also know that
  // PCRE2 error messages are max 120 characters long.
  if (_lastErrorCode == 0) return 0;
  return pcre2_get_error_message(_lastErrorCode, buffer, bufferLength);
}

EMSCRIPTEN_KEEPALIVE
PCRE2_SIZE lastErrorOffset () {
  return _lastErrorOffset;
}

// --------------------------------------------------------------------

EMSCRIPTEN_KEEPALIVE
pcre2_code* compile (
  uint16_t* pattern,
  PCRE2_SIZE length,
  char* flags
) {
  // Clear any previous error codes.
  _lastErrorOffset = 0;
  _lastErrorCode = 0;

  // Convert flags to PCRE2 options bitfield
  int options = PCRE2_UTF;
  for (int i = 0; flags[i] != 0; i++) {
    switch (flags[i]) {
      case 'm': options |= PCRE2_MULTILINE; break;
      case 's': options |= PCRE2_DOTALL; break;
      case 'i': options |= PCRE2_CASELESS; break;
      case 'x': options |= PCRE2_EXTENDED; break;
      default:
        _lastErrorCode = PCRE2_ERROR_BAD_OPTIONS;
        return NULL;
    }
  }

  return pcre2_compile(
    pattern, length, options,
    &_lastErrorCode, &_lastErrorOffset,
    NULL
  );
}

EMSCRIPTEN_KEEPALIVE
void destroyCode (pcre2_code* code) {
  return pcre2_code_free(code);
}

// --------------------------------------------------------------------

EMSCRIPTEN_KEEPALIVE
pcre2_match_data* match (
  pcre2_code* code,
  uint16_t* subject,
  PCRE2_SIZE length,
  PCRE2_SIZE offset
) {
  pcre2_match_data* result = pcre2_match_data_create_from_pattern(code, NULL);

  // Commented out pcre2_match call because including it causes
  // WebAssembly compiler in V8 to go into a long running and memory
  // hungry loop. It seems to be fixed in V8 6.9, however Node.js
  // currently runs V8 6.7. Unfortunately V8 6.8 is broken as well, and
  // so it is not clear if this will get fixed until Node.js 11.0, which
  // will use V8 7.0.

  // pcre2_match(code, subject, length, offset, 0, result, NULL);

  return result;
}

EMSCRIPTEN_KEEPALIVE
void destroyMatchData (pcre2_match_data* data) {
  return pcre2_match_data_free(data);
}

// --------------------------------------------------------------------

EMSCRIPTEN_KEEPALIVE
size_t version (uint16_t* result) {
  return pcre2_config(PCRE2_CONFIG_VERSION, result);
}
