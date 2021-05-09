import { Component } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Question, SavedData } from '../../contracts';
import { SavedDataService } from '../../services';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
    private _savedData: SavedData;

    constructor(private router: Router, saveDataService: SavedDataService) {
        this._savedData = saveDataService.loadData();

        this._answeredQuestions = this._savedData.questions.filter((question) => question.answered);
    }

    public readonly faCog = faCog;

    private _answeredQuestions: Question[];

    public get answeredQuestions(): Question[] {
        return this._answeredQuestions.concat();
    }

    public get hasQuestions(): boolean {
        return this._savedData.questions.length > 0;
    }

    public get canSpin(): boolean {
        return this.hasQuestions;
    }

    public showSettings(): void {
        this.router.navigate(['settings']);
    }
}
