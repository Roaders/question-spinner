import { Injectable } from '@angular/core';
import { SETTINGS_KEY } from '../constants';
import { SavedData } from '../contracts';

@Injectable()
export class SavedDataService {
    public loadData(): SavedData | null {
        const savedData = window.localStorage.getItem(SETTINGS_KEY);

        return savedData == null ? null : JSON.parse(savedData);
    }

    public saveData(data: SavedData): void {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    }
}
