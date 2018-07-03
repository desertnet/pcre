# pcre

Perl compatible regular expressions for JavaScript

## Installation

```
npm install @desertnet/pcre
```

## Usage

Internally this module uses the [PCRE2](https://pcre.org/) library, running
in a WebAssembly instance. This has a side effect of requiring you do
a few unusual things when using this module:

### Initialization

Before calling any constructors or methods, you must first asynchronously initialize the module by calling `init`.

```javascript
import PCRE from '@desertnet/pcre'

async function main () {
  await PCRE.init()
  // make other PCRE calls...
}

main()
```

### Memory Management

When you create a new `PCRE` instance, you are allocating memory within the
WebAssembly instance. Currently, there are no hooks in JavaScript that
let us automatically free this memory when the `PCRE` instance is garbage
collected by the JavaScript runtime. This means that in order to prevent
memory leaks, you must call `.destroy()` on a `PCRE` instance when it
is no longer needed.

## API

```javascript
import PCRE from '@desertnet/pcre'
```

### PCRE.init()

Initializes the module, returning a Promise that is resolved once
initialization is complete. You must call this at least once and await the
returned Promise before calling any other `PCRE` methods or constructors.

### PCRE.version()

Returns a string with the PCRE2 version information.

### new PCRE(pattern, flags)

Creates a new PCRE instance, using `pcre2_compile()` to compile `pattern`,
using `flags` as the compile options. You must call `.destroy()` on the
returned instance when it is no longer needed to prevent memory leakage.

  - `pattern`: A string containing a Perl compatible regular expression.
    Tip: use `String.raw` to avoid needing to escape backslashes.
  - `flags`: An optional string with each character representing an option.
    Supported flags are `i`, `m`, `s`, and `x`. See
    [perlre](http://perldoc.perl.org/perlre.html) for details.

```javascript
const pattern = String.raw`\b hello \s* world \b`
const re = new PCRE(pattern, 'ix')

// ...

re.destroy()
```

In the event of a compilation error in the pattern or an unsupported flag,
an `Error` will be thrown with an error message from PCRE2. Additionally, it
will have an `offset` property indicating the character offset in `pattern`
where the error was encountered.

```javascript
let re

try {
  re = new PCRE(String.raw`a)b`)
}
catch (err) {
  console.error(`Compilation failed: ${err.message} at ${err.offset}.`)
  // Prints: Compilation failed: unmatched closing parenthesis at 1.
}
```

## re.destroy()

Releases the memory allocated in the WebAssembly instance. You must call this
method manually once you no longer have a need for the instance, or else
your program will leak memory.

## Contributing

Prerequisites for development include Docker, make and curl.
