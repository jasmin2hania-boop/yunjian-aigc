import { fileURLToPath } from 'node:url';
import { loadLibrary } from '../../../lib/content.mjs';
const docs=fileURLToPath(new URL('../../',import.meta.url));
export default {
  watch:[docs+'**/*.md'],
  load() {
    const data=loadLibrary(docs);
    if(data.errors.length) throw new Error(data.errors.join('\n'));
    return {notes:data.notes,tags:data.tags};
  }
};
