import { Component } from '@angular/core';
import { SavedDataService } from '../../services';
import { success } from 'toastr';
import { Question, SavedData } from '../../contracts';
import { Router } from '@angular/router';

const newQuestionRegExp = /\w/;

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    constructor(private saveDataService: SavedDataService, private router: Router) {
        const savedData = saveDataService.loadData();
        this._timeout = savedData?.timeout || 300;
        this._questions = savedData?.questions || [];
        this.editedQuestions = this.questions.map(cloneQuestion);

        console.log(this.editedQuestions);
    }

    public editedQuestions: Question[];

    private _questions: Question[];

    public get questions(): Question[] {
        return this._questions;
    }

    public newQuestionText: string | undefined;

    public get canAddQuestion(): boolean {
        return this.newQuestionText != null && newQuestionRegExp.test(this.newQuestionText);
    }

    private _formDirty = false;

    public get canSave(): boolean {
        return (
            this._formDirty || this.editedQuestions.some((question, index) => this.isQuestionEdited(question, index))
        );
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

    public onQuestionKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.addQuestion();
        }
    }

    public addQuestion(): void {
        if (!this.canAddQuestion || this.newQuestionText == null) {
            return;
        }

        this.questions.push({ text: this.newQuestionText, answered: false, enabled: true });
        this._formDirty = true;

        this.newQuestionText = undefined;
    }

    public deleteQuestion(question: Question): void {
        const index = this._questions.indexOf(question);
        if (index < 0) {
            return;
        }

        this._questions.splice(index, 1);
        this._formDirty = true;
    }

    public save(): void {
        const saveData = this.buildSaveData();
        this.saveDataService.saveData(saveData);
        success('Saved');
        this._formDirty = false;

        this._questions = saveData.questions;
        this.editedQuestions = this.questions.map(cloneQuestion);
    }

    public returnToSpinner(): void {
        this.router.navigate(['']);
    }

    private buildSaveData(): SavedData {
        return { timeout: this._timeout, questions: this.editedQuestions };
    }

    private isQuestionEdited(question: Question, index: number): boolean {
        const originalQuestion = this._questions[index];

        return (
            originalQuestion.text != question.text ||
            originalQuestion.answered != question.answered ||
            originalQuestion.enabled != question.enabled
        );
    }
}

function cloneQuestion(question: Question): Question {
    return { ...question };
}
