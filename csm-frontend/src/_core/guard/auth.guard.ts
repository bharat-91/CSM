// auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { TokenService } from "../auth/token.service";

@Injectable({
   providedIn: "root",
})
export class AuthGuard implements CanActivate {
   constructor(private tokenService: TokenService, private router: Router) {}

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.tokenService.checkAuthentication()) {
         return true; 
      } else {
         this.router.navigate(['']);
         return false;
      }
   }
}
