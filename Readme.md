<ion-split-pane contentId="content" when="(min-width: 840px)">
  <ion-menu class="menu_size" contentId="content">
    <ion-header [translucent]="true" class="minimal-header">
      <ion-toolbar>
        <ion-title>
          <img src="assets/images/UTEQC.png" alt="Logo" width="50%" height="auto" class="logo-img">
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="menu-content">
      <ion-list class="menu-list">

        <ion-menu-toggle auto-hide="false" *ngFor="let p of pages">
          <ion-item [routerLink]="p.url" router-direction="root" [class.active-item]="selectedPath === p.url" lines="none">
            <ion-icon [name]="p.icon" slot="start"></ion-icon>
            <ion-label>{{ p.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
        
        <!-- Mostrar solo si está autenticado -->
        <ng-container *ngIf="isLoggedIn">
          <ion-menu-toggle auto-hide="false">
            <ion-item [routerLink]="'./mis-certificados'" router-direction="root"
              [class.active-item]="selectedPath === './mis-certificados'" lines="none">
              <ion-icon name="document-text-outline" slot="start"></ion-icon>
              <ion-label>Mis certificados</ion-label>
            </ion-item>
          </ion-menu-toggle>

          <ion-menu-toggle auto-hide="false">
            <ion-item [routerLink]="'./prueba'" router-direction="root"
              [class.active-item]="selectedPath === './prueba'" lines="none">
              <ion-icon name="flask-outline" slot="start"></ion-icon>
              <ion-label>Prueba</ion-label>
            </ion-item>
          </ion-menu-toggle>

          <ion-item (click)="logout()" style="cursor: pointer;" lines="none">
            <ion-icon name="log-out-outline" slot="start"></ion-icon>
            <ion-label>Logout</ion-label>
          </ion-item>
        </ng-container>

        <!-- Mostrar si NO está autenticado -->
        <ng-container *ngIf="!isLoggedIn">
          <ion-menu-toggle auto-hide="false">
            <ion-item [routerLink]="'./login'" router-direction="root" [class.active-item]="selectedPath === './login'" lines="none">
              <ion-icon name="log-in-outline" slot="start"></ion-icon>
              <ion-label>Iniciar sesión</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ng-container>

      </ion-list>
    </ion-content>
  </ion-menu>
  
  <ion-router-outlet id="content"></ion-router-outlet>
</ion-split-pane>
