
import fs from 'fs';

export function camelCase(str: string) {
    str = str.replace(/[^a-zA-Z0-9\s]/g, '');
    return str.replace(/\s(.)/g, function(match, group) {
      return group.toUpperCase();
    });
  }

export async function fileExistsLocally(filename: string) {
try {
    await fs.promises.access(filename); // Check if file exists
    return true;
} catch (error) {
    return false;
}
}