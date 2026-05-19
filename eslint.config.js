import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';

export default tseslint.config(
    tseslint.configs.recommended,
    {
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            'import/order': ['error', {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                pathGroups: [
                    {
                        pattern: '#**',
                        group: 'internal',
                    },
                ],
                pathGroupsExcludedImportTypes: [],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            }],
        },
    },
    prettier,
);