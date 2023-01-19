import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { generateCustomValidity, EventType, hasAccess, webViewType, getUserInfo } from "./assets/utilities";
const AppMain = () => import(/* webpackPreload: true */ "./pages/main.vue");
const HomeIndex = () => import(/* webpackPrefetch: true */ "./pages/home/index.vue");
const homeAlert = () => import(/* webpackPrefetch: true */ "./pages/home/alert.vue");

const shareholderWatchIndex = () => import(/* webpackPrefetch: true */ "./pages/shareholderWatch/index.vue");

const reportsRpt43 = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt43.vue");
const reportsRpt14 = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt14.vue");
const reportsRpt0702 = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt0702.vue");
const reportsRpt0702Assign = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt0702Assign.vue");
const reportsRptMaxBuyer = () => import(/* webpackPrefetch: true */ "./pages/reports/rptMaxBuyer.vue");
const reportsRptMaxSeller = () => import(/* webpackPrefetch: true */ "./pages/reports/rptMaxSeller.vue");
const reportsRptSellerBuyer = () => import(/* webpackPrefetch: true */ "./pages/reports/rptSellerBuyer.vue");
const reportsRptAmntCap = () => import(/* webpackPrefetch: true */ "./pages/reports/rptAmntCap.vue");
const reportsRptUserTask = () => import(/* webpackPrefetch: true */ "./pages/reports/rptUserTask.vue");
const reportsRpt44 = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt44.vue");
const reportsRptSeason = () => import(/* webpackPrefetch: true */ "./pages/reports/rptSeason.vue");
const reportsRptSeasonGroup = () => import(/* webpackPrefetch: true */ "./pages/reports/rptSeasonGroup.vue");
const reportsRpt44Agent = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt44Agent.vue");
const reportsRptMaxBuyerByAgent = () => import(/* webpackPrefetch: true */ "./pages/reports/rptMaxBuyerByAgent.vue");
const reportsRptMaxSellerByAgent = () => import(/* webpackPrefetch: true */ "./pages/reports/rptMaxSellerByAgent.vue");
const reportsRpt44ShrhKind = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt44ShrhKind.vue");
const reportsRpt17 = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt17.vue");
const reportsRpt02 = () => import(/* webpackPrefetch: true */ "./pages/reports/rpt02.vue");
const reportsRptShareholderStateSummary = () => import(/* webpackPrefetch: true */ "./pages/reports/rptShareholderStateSummary.vue");
const reportsRptTransactionOfShareholder = () => import(/* webpackPrefetch: true */ "./pages/reports/rptTransactionOfShareholder.vue");

const smartAssistantShareSwing = () => import(/* webpackPrefetch: true */ "./pages/smartAssistant/shareSwing.vue");

const homeEvent = () => import(/* webpackPrefetch: true */ "./pages/home/event.vue");
const homeAbout = () => import(/* webpackPrefetch: true */ "./pages/home/about.vue");
const homeIndex1 = () => import(/* webpackPrefetch: true */ "./pages/home/index1.vue");

const AccountLogin = () => import(/* webpackPrefetch: true */ "./pages/account/login.vue");
const AccountUsers = () => import(/* webpackPrefetch: true */ "./pages/account/users.vue");
const AccountAccessLevels = () => import(/* webpackPrefetch: true */ "./pages/account/accessLevels.vue");
const AccountChangePass = () => import(/* webpackPrefetch: true */ "./pages/account/changePass.vue");
const accountEmployeeChangePass = () => import(/* webpackPrefetch: true */ "./pages/account/employeeChangePass.vue");

const sharedReport = () => import(/* webpackPrefetch: true */ "./pages/shared/report.vue");

Vue.use(VueRouter);
Vue.prototype.$CaptionsLibrary = window.CaptionsLibrary;
Vue.prototype.$MessagesLibrary = window.MessagesLibrary;


const routes: RouteConfig[] = [
    { path: "/", component: HomeIndex },

    { path: "/home/index1", component: homeIndex1 },
    { path: "/home/alert", component: homeAlert },

    { path: "/reports/rpt43", component: reportsRpt43 },
    { path: "/reports/rpt14", component: reportsRpt14 },
    { path: "/reports/rpt0702", component: reportsRpt0702 },
    { path: "/reports/rpt0702Assign", component: reportsRpt0702Assign },
    { path: "/reports/rptMaxBuyer", component: reportsRptMaxBuyer },
    { path: "/reports/rptMaxBuyer/:filter", component: reportsRptMaxBuyer, props: true },
    { path: "/reports/rptMaxSeller", component: reportsRptMaxSeller},
    { path: "/reports/rptMaxSeller/:filter", component: reportsRptMaxSeller, props: true },
    { path: "/reports/rptSellerBuyer", component: reportsRptSellerBuyer },
    { path: "/reports/rptAmntCap", component: reportsRptAmntCap },
    { path: "/reports/rptUserTask", component: reportsRptUserTask },
    { path: "/reports/rpt44", component: reportsRpt44 },
    { path: "/reports/rptSeason", component: reportsRptSeason },
    { path: "/reports/rptSeasonGroup", component: reportsRptSeasonGroup },
    { path: "/reports/rpt44Agent", component: reportsRpt44Agent },
    { path: "/reports/rptMaxBuyerByAgent", component: reportsRptMaxBuyerByAgent },
    { path: "/reports/rptMaxSellerByAgent", component: reportsRptMaxSellerByAgent },
    { path: "/reports/rpt44Shrhkind", component: reportsRpt44ShrhKind },
    { path: "/reports/rpt17", component: reportsRpt17 },
    { path: "/reports/rpt02", component: reportsRpt02 },
    { path: "/reports/rptShareholderStateSummary", component: reportsRptShareholderStateSummary },
    { path: "/reports/rptTransactionOfShareHolder", component: reportsRptTransactionOfShareholder },
    { path: "/reports/rptTransactionOfShareHolder/:filter", component: reportsRptTransactionOfShareholder, props: true },

    { path: "/smartAssistant/shareSwing", component: smartAssistantShareSwing },
    { path: "/smartAssistant/shareSwing/:filter", component: smartAssistantShareSwing, props: true },

    { path: "/home/event", component: homeEvent },
    { path: "/home/about", component: homeAbout },
    { path: "/account/employeeChangePass", component: accountEmployeeChangePass },

    { path: "/shareholderWatch/index", component: shareholderWatchIndex },
    
    { path: "/account/login", component: AccountLogin },
    { path: "/account/users", component: AccountUsers },
    { path: "/account/accessLevels", component: AccountAccessLevels },
    { path: "/account/changePass", component: AccountChangePass },

    { path: "*", component: HomeIndex },

    { path: "/shared/report", name: "report", component: sharedReport, props: true },

];

let router = new VueRouter({ mode: "history", routes: routes });

router.beforeResolve(async (to, from, next) => {
    if (to.fullPath == "/account/login") {
        next();
        return;
    }

    sessionExpired(to, from, next);

});

function sessionExpired(to: any, from: any, next: any) {
    window.app.$emit(EventType.StartWaiting);
    $.ajax({
        type: "POST",
        url: "/api/Account/SessionExpired",
        dataType: "json",
        success: result => {
            if (result) {
                sessionStorage.clear();
                router.push("/account/login");
                return;
            } else {
                checkAccess(to, from, next);
            }
        },
        complete: () => {
            window.app.$emit(EventType.EndWaiting);
        }
    });
}

function pad(num: number) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

Date.prototype.toJSON = function () {
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        '.' + (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
};

Vue.prototype.$UserInfo = {

};

window.app = new Vue({
    el: "#app-root",
    router,
    components: {
        "app-main": AppMain
    },
});

//@ts-ignore
window.minToHourMin = (input: any, zeroPadding: any, hourLength: any) => {
    var isMinus = input < 0;
    input = Math.abs(input);
    hourLength = hourLength || 3;
    var hour = Math.floor(input / 60);
    var min = Math.abs(input) % 60;
    var result = "";

    if (zeroPadding === true) {
        result = String("000" + hour).slice(-hourLength) + ":" + String("00" + min).slice(-2);
    } else {
        result = hour + ":" + String("00" + min).slice(-2);
    }

    if (isMinus) { result = "-" + result; }

    return result;
}

declare global {
    interface Window {
        app: any;
        CaptionsLibrary: any;
        MessagesLibrary: any;
        UserInfo: any;
        webViewTypes: any;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $CaptionsLibrary: { get: Function },
        $MessagesLibrary: { get: Function },
        $UserInfo: any,
    }
}

window.addEventListener("load", () => {
    if ('serviceWorker' in navigator) {
        const registration = runtime.register();
    }
});

function removeCustomValidity(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
        target.setCustomValidity("");
        if (!target.checkValidity()) {
            const customValidity = generateCustomValidity(target);
            target.setCustomValidity(customValidity);
            target.addEventListener("input", removeCustomValidity, { once: true });
        }
    }
}

document.addEventListener('invalid', (() => (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target) {
        const customValidity = generateCustomValidity(target);
        target.setCustomValidity(customValidity);
        target.addEventListener("input", removeCustomValidity, { once: true });
    }
})(), true);

function checkAccess(to: any, from: any, next: any) {
    if (Vue.prototype.$UserInfo.AccessIds != undefined) {

        switch (to.fullPath) {
            case "/account/users":
                {
                    hasAccess(1000,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/account/accessLevels":
                {
                    hasAccess(1001,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt43":
                {
                    hasAccess(1002,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt0702":
                {
                    hasAccess(1003,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt17":
                {
                    hasAccess(1019,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt02":
                {
                    hasAccess(1020,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptShareholderStateSummary":
                {
                    hasAccess(1021,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptTransactionOfShareholder":
                {
                    hasAccess(1022,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt14":
                {
                    hasAccess(1004,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            //case "/reports/rptMaxBuyer":
            //    {
            //        hasAccess(1005,
            //            (result: boolean) => {
            //                if (!result) {
            //                    //@ts-ignore
            //                    window.app.$children[0].popupNotificationWidget.show(
            //                        window.MessagesLibrary.get('AccessDeniedForThisAction'),
            //                        'error');
            //                    next(false);
            //                } else {
            //                    next();
            //                }
            //            });
            //    }
            //    break;
            case "/reports/rptMaxBuyer":
                {
                    hasAccess(1006,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptMaxSeller":
                {
                    hasAccess(1007,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptMaxBuyerByAgent":
                {
                    hasAccess(1006,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptMaxSellerByAgent":
                {
                    hasAccess(1007,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptSellerBuyer":
                {
                    hasAccess(1008,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptAmntCap":
                {
                    hasAccess(1009,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt0702Assign":
                {
                    hasAccess(1010,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptUserTask":
                {
                    hasAccess(1011,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt44":
                {
                    hasAccess(1012,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt44Shrhkind":
                {
                    hasAccess(1018,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptSeason":
                {
                    hasAccess(1013,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rptSeasonGroup":
                {
                    hasAccess(1014,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/reports/rpt44Agent":
                {
                    hasAccess(1015,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/shareholderWatch/index":
                {
                    hasAccess(1023,
                        (result: boolean) => {
                            if (!result) {
                                //@ts-ignore
                                window.app.$children[0].popupNotificationWidget.show(
                                    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                    'error');
                                next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;

            default:
                {
                    next();
                }
        }

    } else {
        router.push("/");
    }
}
