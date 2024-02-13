# TODO:
MDXEditor`s nested editors are buggy when it comes to updates. Especially code blocks don't work well.

--> replace it and tra a different editor
  - TipTap. convert to markdown on server before it is saved
    - https://github.com/vriteio/vrite/blob/main/packages/editor/src/code-block.ts
    - https://github.com/vriteio/vrite/blob/ad888f693e6684ffc2379c6675c12a7e9b3ea168/apps/backend/extensions/src/routes/mdx/input-transformer.ts#L4
    - https://github.com/vriteio/vrite/blob/ad888f693e6684ffc2379c6675c12a7e9b3ea168/apps/backend/extensions/src/routes/mdx/output-transformer.ts#L11

- stick to directives for the custom components
  - would allow anyone to allow their own renderer at the end instead of JSX that could only work with React