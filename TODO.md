# TODO:

Problems I ran into:
1. MDXEditor`s nested editors are buggy when it comes to updates. Especially code blocks don't work well.
2. TipTap`s `ReactNodeViewRenderer` will create portals that are not probably nested. That means that context does not work. Also screws with component frameworks that all use Context. 
3. Plate`s plugin system is quite cumbersome to setup and the data type names did not match with Slate`s which broke the transformer. 

- stick to directives for the custom components
  - would allow anyone to allow their own renderer at the end instead of JSX that could only work with React

https://github.com/inokawa/remark-slate-transformer?tab=readme-ov-file#support-custom-ast