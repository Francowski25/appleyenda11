import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
    {
        path: '',
        component: Shell,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
            // { path: 'perfil', component: Perfil },
            // { path: 'configuracion', component: Configuracion },
        ]
    },
    {
        path: 'leyenda11',
        component: Shell,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
        ]
    },
    { path: 'login', component: Login, canActivate: [publicGuard] },
    { path: 'registro', component: Registro, canActivate: [publicGuard] },
    { path: '**', redirectTo: '' }
];