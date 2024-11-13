import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import localeEs from '@angular/common/locales/es';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAuthInterceptor } from './admin/interceptors/interceptor-auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(localeEs,'es');
@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
            AppRoutingModule,
            AppLayoutModule,
            ToastrModule.forRoot(),
            BrowserAnimationsModule
        ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass:InterceptorAuthInterceptor,
            multi:true
        },
        { provide: LocationStrategy, useClass: PathLocationStrategy },

        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
