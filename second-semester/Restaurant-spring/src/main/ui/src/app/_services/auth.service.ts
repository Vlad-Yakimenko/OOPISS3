import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {filter} from "rxjs/operators";
import {OAuthService} from "angular-oauth2-oidc";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    private isUserAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isUserAuthenticated$ = this.isUserAuthenticatedSubject$.asObservable();

    private isAdminAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAdminAuthenticated$ = this.isAdminAuthenticatedSubject$.asObservable();

    private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
    public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

    constructor(
        private oauthService: OAuthService,
        private router: Router,
    ) {
        this.oauthService.events
            .subscribe(_ => {
                let hasValidAccessToken = this.oauthService.hasValidAccessToken();
                this.isAuthenticatedSubject$.next(hasValidAccessToken);

                this.isUserAuthenticatedSubject$.next(hasValidAccessToken && this.roles.includes("app-user"));

                this.isAdminAuthenticatedSubject$.next(hasValidAccessToken && this.roles.includes("app-admin"));
            });

        this.oauthService.events
            .pipe(filter(e => ['token_received'].includes(e.type)))
            .subscribe(_ => this.oauthService.loadUserProfile());

        this.oauthService.setupAutomaticSilentRefresh();
    }

    public runInitialLoginSequence(): Promise<void> {
        if (location.hash) {
            console.log('Encountered hash fragment, plotting as table...');
            console.table(location.hash.substr(1).split('&').map(kvp => kvp.split('=')));
        }

        return this.oauthService.loadDiscoveryDocument()

            .then(() => this.oauthService.tryLogin())

            .then(() => {
                if (this.oauthService.hasValidAccessToken()) {
                    return Promise.resolve();
                }

                return this.oauthService.silentRefresh()
                    .then((e) => {
                        Promise.resolve()
                    })
            })

            .then(() => {
                this.isDoneLoadingSubject$.next(true);
            })

            .catch(result => {
                const errorResponsesRequiringUserInteraction = [
                    'interaction_required',
                    'login_required',
                    'account_selection_required',
                    'consent_required',
                ];

                console.log(result)

                if (result
                    && result.reason
                    && errorResponsesRequiringUserInteraction.indexOf(result.params.error) >= 0) {

                    console.log('User interaction is needed to log in, we will wait for the user to manually log in.');
                    return Promise.resolve();
                }
            })
    }

    public login(targetUrl?: string) {
        this.oauthService.initLoginFlow(targetUrl || this.router.url);
    }

    public logout() {
        this.oauthService.logOut();
    }

    public refresh() {
        this.oauthService.silentRefresh();
    }

    public hasValidToken() {
        return this.oauthService.hasValidAccessToken();
    }

    public get accessToken() {
        return this.oauthService.getAccessToken();
    }

    public get refreshToken() {
        return this.oauthService.getRefreshToken();
    }

    public get roles() {
        if (this.oauthService.getAccessToken() != null) {
            return AuthService.parseJwt(this.oauthService.getAccessToken()).realm_access.roles;
        }

        return [];
    }

    private static parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}