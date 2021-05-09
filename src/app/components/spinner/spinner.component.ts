import { Component } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
    constructor(private router: Router) {}

    public readonly faCog = faCog;

    public showSettings(): void {
        this.router.navigate(['settings']);
    }
}
