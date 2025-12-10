import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';

export const translocoConfig = provideTransloco({
  config: {
    availableLangs: ['en', 'ar'],
    defaultLang: 'en',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
});
