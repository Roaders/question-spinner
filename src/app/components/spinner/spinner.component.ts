import { Component } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Question, SavedData } from '../../contracts';
import { SavedDataService } from '../../services';
import { easing } from 'ts-easing';
import { MAX_INTERVAL, MIN_INTERVAL } from 'src/app/constants';
import { fromMs } from 'hh-mm-ss';

type State = 'spin' | 'spinning' | 'start' | 'running' | 'complete';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
    private _savedData: SavedData;

    private _state: State = 'spin';

    public get state(): State {
        return this._state;
    }

    constructor(private router: Router, private saveDataService: SavedDataService) {
        this._savedData = saveDataService.loadData();

        this._answeredQuestions = this._savedData.questions.filter((question) => question.answered);
    }

    public readonly faCog = faCog;

    private _remainingTime: string | undefined;

    public get remainingTime(): string | undefined {
        return this._remainingTime;
    }

    private _question: Question | undefined;

    public get question(): Question | undefined {
        return this._question;
    }

    private _answeredQuestions: Question[];

    public get answeredQuestions(): Question[] {
        return this._answeredQuestions;
    }

    public get hasQuestions(): boolean {
        return this._savedData.questions.length > 0;
    }

    public showSettings(): void {
        this.router.navigate(['settings']);
    }

    private _spinStart: number | undefined;
    private _timeout: number | undefined;

    public startSpin(): void {
        this._spinStart = Date.now();

        this._state = 'spinning';
        this.spin();
        setTimeout(() => this.selectQuestion(), this._savedData.spinDuration * 1000);
    }

    private _questionStart: number | undefined;

    public startTimer(): void {
        this._questionStart = Date.now();
        this._state = 'running';

        this.updateRemainingTime();
        setTimeout(() => this.questionTimeout(), this._savedData.timeout * 1000);
    }

    private questionTimeout() {
        if (this._timeout != null) {
            clearTimeout(this._timeout);
        }
        this._questionStart = undefined;
        this._state = 'complete';

        if (this._question == null) {
            throw Error(`No question to mark as answered`);
        }

        this._question.answered = true;
        this.saveDataService.saveData(this._savedData);
        this.answeredQuestions.unshift(this._question);
    }

    private updateRemainingTime() {
        if (this._questionStart == null) {
            throw new Error(`Question start time is undefined`);
        }

        const elapsed = Date.now() - this._questionStart;
        const remaining = this._savedData.timeout * 1000 - elapsed;

        this._remainingTime = fromMs(remaining);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._timeout = setTimeout(() => this.updateRemainingTime(), 100) as any; // to avoid issues with node types
    }

    private updateQuestion() {
        const { question } = this.pickRandomQuestion();
        this._question = question;

        return question;
    }

    private selectQuestion() {
        if (this._timeout != null) {
            clearTimeout(this._timeout);
        }
        const question = this.updateQuestion();

        question.answered = true;
        this._spinStart = undefined;
        this._timeout = undefined;
        this._state = 'start';
    }

    private spin() {
        this.updateQuestion();

        let interval = MIN_INTERVAL;

        if (this._spinStart != null) {
            const elapsed = Date.now() - this._spinStart;
            const fraction = elapsed / (this._savedData.spinDuration * 1000);
            const eased = easing.inOutExpo(fraction);

            interval = (MAX_INTERVAL - MIN_INTERVAL) * eased + MIN_INTERVAL;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._timeout = setTimeout(() => this.spin(), interval) as any; // to avoid issues with node types
    }

    private pickRandomQuestion(): { question: Question; index: number } {
        const availableQuestions = this._savedData.questions.filter(
            (question) => !question.answered && question.enabled
        );

        const index = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions[index];

        if (question == this._question && availableQuestions.length > 1) {
            return this.pickRandomQuestion();
        }

        return { index, question };
    }
}
