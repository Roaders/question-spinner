import { Component } from '@angular/core';
import { SavedData, SavedDataService } from '../../services';
import { success } from 'toastr';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    constructor(private saveDataService: SavedDataService) {
        const savedData = saveDataService.loadData();
        this._timeout = savedData != null ? savedData.timeout : 300;
    }

    private _formDirty = false;

    public get formDirty(): boolean {
        return this._formDirty;
    }

    private _timeout: number;

    public get timeout(): number {
        return this._timeout;
    }

    public set timeout(value: number) {
        if (this._timeout === value) {
            return;
        }
        this._timeout = value;
        this._formDirty = true;
    }

    public save(): void {
        this.saveDataService.saveData(this.buildSaveData());
        success('Saved');
        this._formDirty = false;
    }

    private buildSaveData(): SavedData {
        return { timeout: this._timeout };
    }
}
