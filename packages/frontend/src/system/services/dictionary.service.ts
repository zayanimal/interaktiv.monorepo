import { ApiService, apiService } from '@system/services/api.service';
import { DictionaryPayload } from '@system/interfaces/dictionary.interface';

class DictionaryService {
    constructor(private api: ApiService) {}

    get$({ type, names }: DictionaryPayload) {
        return this.api.get$(`dictionary/${type}?dicts=${names.join('%')}`);
    }
}

export const dictionaryService = new DictionaryService(apiService);
