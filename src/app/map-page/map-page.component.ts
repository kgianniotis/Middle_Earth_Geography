import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import mapCatalog from '../../../public/assets/mapCatalog.json';

type AgeId = 'trees' |'first' | 'second' | 'third' | 'fourth';

type MapPeriod = {
  from: number;
  to: number;
  src: string;
};

type MapCatalog = Record<AgeId, MapPeriod[]>;

const MAP_CATALOG = mapCatalog as MapCatalog;


type Age = {
  id: AgeId;
  label: string;
  startYear: number;
  endYear: number;
};

const AGES: Age[] = [
  { id: 'trees',  label: 'Year of the Trees',  startYear: 1,    endYear: 1050 },
  { id: 'first',  label: 'First Age',  startYear: 1,    endYear: 590  },
  { id: 'second', label: 'Second Age', startYear: 1,    endYear: 3441 },
  { id: 'third',  label: 'Third Age',  startYear: 1,    endYear: 3021 },
  { id: 'fourth', label: 'Fourth Age', startYear: 1,    endYear: 2  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent {
  ages = AGES;

  form = new FormGroup({
    ageId: new FormControl<AgeId>('first', { nonNullable: true }),
    year: new FormControl<number>(1, { nonNullable: true }),
  });

  get activeAge(): Age {
    const id = this.form.controls.ageId.value;
    return this.ages.find(a => a.id === id)!;
  }

  get minYear(): number {
    return this.activeAge.startYear;
  }

  get maxYear(): number {
    return this.activeAge.endYear;
  }

  get selectedMapSrc(): string | null {
    const ageId = this.form.controls.ageId.value;
    const year = this.form.controls.year.value;

    const periods = MAP_CATALOG[ageId];
    if (!periods) return null;

    const match = periods.find(p => year >= p.from && year <= p.to);
    return match ? match.src : null;
  }


  constructor() {
    this.form.controls.ageId.valueChanges.subscribe(() => {
      const y = this.form.controls.year.value;
      const clamped = clamp(y, this.minYear, this.maxYear);
      if (clamped !== y) {
        this.form.controls.year.setValue(clamped, { emitEvent: false });
      }
    });

    this.form.controls.year.valueChanges.subscribe((y) => {
      const clamped = clamp(Number(y), this.minYear, this.maxYear);
      if (clamped !== y) {
        this.form.controls.year.setValue(clamped, { emitEvent: false });
      }
    });
  }
}
