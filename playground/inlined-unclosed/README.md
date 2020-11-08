Inlined unclosed example
========================

It's the configuration with modules referenced more than a single time but only
in inlined modules, so they all get inlined in the entrypoint module.
The difficulty here is to extract contents of these modules from the contents
of the main module based on the source map. Some source map ranges are unclosed,
which differentiates this example from the other inline one.
