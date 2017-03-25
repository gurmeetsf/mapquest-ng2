import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { replace } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';

import { State } from '../../state';
import * as fromRoot from '../../state/reducers';
import * as fromMap from '../../state/home/map/actions';

@Component({
  selector: 'mq-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mq-side-panel-container>
      <mq-side-panel [opened]="showSidePanel$ | async">
        <router-outlet></router-outlet>
      </mq-side-panel>

      <mb-map (moveend)="onMapMoveend($event)" [center]="mapCenter$ | async" [zoom]="mapZoom$ | async">
        <mb-navigation-control></mb-navigation-control>
        <mb-container-control>
          <mq-fab-input icon="search" (submit)="search($event)"></mq-fab-input>
        </mb-container-control>
        <mb-geojson-source mb-id="search-results" [data]="searchResults$ | async"></mb-geojson-source>
        <mb-layer mb-id="search-results" source="search-results" type="symbol" [layout]="{ 'icon-image': '{$icon}' }"></mb-layer>
      </mb-map>
    </mq-side-panel-container>
  `,
  styleUrls: ['home-page.component.scss']
})
export class HomePageComponent {

  mapCenter$: Observable<Object>;
  mapZoom$: Observable<number>;
  searchResults$: Observable<Object>;
  showSidePanel$: Observable<boolean>;

  constructor(private store: Store<State>) {
    this.mapCenter$ = this.store.select(fromRoot.getHomeMapCenter);
    this.mapZoom$ = this.store.select(fromRoot.getHomeMapZoom);
    this.searchResults$ = this.store.select(fromRoot.getSelectedSearchEntitiesGeoJson);
    this.showSidePanel$ = this.store.select(fromRoot.getHomeShowSidenav);
  }

  onMapMoveend($event: any) {
    const center = $event.target.getCenter();
    const zoom = $event.target.getZoom();
    this.store.dispatch(new fromMap.SetExtentAction({ center, zoom }));
  }

  search(query: string) {
    this.store.dispatch(replace(['/search', query]));
  }

}
