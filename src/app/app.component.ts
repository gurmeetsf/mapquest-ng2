import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mq-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {

}
