import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getCurrentDirPath = (): string => {
    return dirname(fileURLToPath(import.meta.url));
};
