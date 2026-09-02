import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { publicGuard } from './core/guards/public.guard';
import { QuizFutbol } from './features/games/quiz-futbol/quiz-futbol';
import { Leyenda11Bingo } from './features/games/leyenda11-bingo/leyenda11-bingo';
import { Leyenda11Grid } from './features/games/leyenda11-grid/leyenda11-grid';
import { Leyenda11Top10 } from './features/games/leyenda11-top10/leyenda11-top10';
import { Leyenda11Staddle } from './features/games/leyenda11-staddle/leyenda11-staddle';
import { OnceIdeal } from './features/games/once-ideal/once-ideal';
import { GloriaEterna } from './features/games/gloria-eterna/gloria-eterna';
import { LeyendaMisteriosa } from './features/games/leyenda-misteriosa/leyenda-misteriosa';

export const routes: Routes = [
    { path: '', redirectTo: 'leyenda11', pathMatch: 'full' },
    {
        path: 'leyenda11',
        component: Shell,
        children: [
            { path: '', component: Home },
            { path: 'quiz-futbol', component: QuizFutbol },
            { path: 'leyenda11-bingo', component: Leyenda11Bingo },
            { path: 'leyenda11-grid', component: Leyenda11Grid },
            { path: 'leyenda11-top10', component: Leyenda11Top10 },
            { path: 'leyenda11-staddle', component: Leyenda11Staddle },
            { path: 'once-ideal', component: OnceIdeal },
            { path: 'gloria-eterna', component: GloriaEterna },
            { path: 'leyenda-misteriosa', component: LeyendaMisteriosa },
            // { path: 'perfil', component: Perfil },
            // { path: 'configuracion', component: Configuracion },
        ]
    },
    { path: 'login', component: Login, canActivate: [publicGuard] },
    { path: 'registro', component: Registro, canActivate: [publicGuard] },
    { path: '**', redirectTo: 'leyenda11' }
];