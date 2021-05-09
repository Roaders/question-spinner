import { Injectable } from '@angular/core';
import { SETTINGS_KEY } from '../constants';
import { SavedData } from '../contracts';

@Injectable()
export class SavedDataService {
    public loadData(): SavedData {
        const partialSavedData: Partial<SavedData> = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');

        return { ...this.getDefault(), ...partialSavedData };
    }

    public saveData(data: SavedData): void {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    }

    private getDefault(): SavedData {
        return { timeout: 60 * 7, questions: [], spinDuration: 3 };
    }
}
