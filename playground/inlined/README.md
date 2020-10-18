Inlined example
===============

It's the configuration with modules only referenced ones, so they get inlined
in the entrypoint module. The difficulty here is to extract contents of these
modules from the contents of the main module based on the source map.

Common parts of inlined modules, like async helpers, stay in the entrypoint
module, as they're not mapped.