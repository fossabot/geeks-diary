import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UIModule } from '../ui/ui.module';

import { ActivityViewComponent } from './activity-view/activity-view.component';
import { ActivityView } from './activity-view/activity-view';
import { WorkspaceComponent } from './workspace/workspace.component';


@NgModule({
    imports: [
        SharedModule,
        UIModule
    ],
    declarations: [
        ActivityViewComponent,
        WorkspaceComponent
    ],
    providers: [
        ActivityView
    ],
    exports: [
        ActivityViewComponent,
        WorkspaceComponent
    ]
})
export class CoreModule {

}
