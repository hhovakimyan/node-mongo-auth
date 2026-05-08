import tseslint from 'typescript-eslint';

export default tseslint.config(
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    }
);