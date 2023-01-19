import { Vue, Component, Watch } from "vue-property-decorator";
import '@progress/kendo-ui/js/kendo.upload.js';
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import '@progress/kendo-ui/js/kendo.maskedtextbox.js';
import { UploadInstaller } from '@progress/kendo-upload-vue-wrapper';
import SvImagepicker from "../../components/imagepicker/imagepicker.vue";
import { LayoutInstaller } from '@progress/kendo-layout-vue-wrapper';
//import { ButtonsInstaller } from '@progress/kendo-buttons-vue-wrapper';
Vue.use(UploadInstaller);
Vue.use(LayoutInstaller);

const publicServerKey = "BF-9DAjR4QAFiR8wU9Yb0TMxuhX5FTs9-uEeGZNq4OsY5I-munE2VDABXUEbcrF6nry4xUiMaa-jorWMvQchy1U";

@Component({
    components: {
        SvImagepicker
    }
})
export default class HomeIndex extends Vue {
    kendoMessages:any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    checked = true;

    model = {
        city: 3,
        gender: 2,
        image: null,
    };

    cities = [
        {
            text: "تهران",
            value:1
        },
        {
            text: "اصفهان",
            value: 2
        },
        {
            text: "شیراز",
            value: 3
        }
    ];

    genders = [
        {
            text: "مرد",
            value: 1
        },
        {
            text: "زن",
            value: 2
        },
        {
            text: "سایر",
            value: 3
        }
    ];

    localDataSource = [{
        "ProductID": 1,
        "ProductName": "علیرضا جعفری",
        "UnitPrice": "0082684073",
        "UnitsInStock": "10864",
        "Discontinued": false,
    },
    {
        "ProductID": 2,
        "ProductName": "سمیر سعیدی",
        "UnitPrice": "0018015360",
        "UnitsInStock": "589",
        "Discontinued": false,
    },
    {
        "ProductID": 3,
        "ProductName": "حمیدرضا اردکانی",
        "UnitPrice": "0054112547",
        "UnitsInStock": "5464",
        "Discontinued": false,
    },
    {
        "ProductID": 4,
        "ProductName": "حسن روحانی",
        "UnitPrice": "1235055884",
        "UnitsInStock": "413",
        "Discontinued": false,
    },
    {
        "ProductID": 5,
        "ProductName": "سروش افهمی",
        "UnitPrice": "4005697089",
        "UnitsInStock": "21654",
        "Discontinued": true,
    },
    {
        "ProductID": 6,
        "ProductName": "مهران صرافی",
        "UnitPrice": "9982365045",
        "UnitsInStock": "120",
        "Discontinued": false,
    }
    ];

    hi() {
        navigator.geolocation.getCurrentPosition(position => {
                const msg = `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`;
                // Let's check if the browser supports notifications
                //if (!("Notification" in window)) {
                //    alert("This browser does not support desktop notification");
                //}

                // Let's check whether notification permissions have already been granted
                //else if (Notification.permission === "granted") {
                //    // If it's okay let's create a notification
                //    //var notification = new Notification(msg);
                //    alert("This browser does not support desktop notification");
                //}

                //// Otherwise, we need to ask the user for permission
                //else if (Notification.permission !== "denied") {
                //    Notification.requestPermission().then(function (permission) {
                //        // If the user accepts, let's create a notification
                //        if (permission === "granted") {
                //            var notification = new Notification(msg);
                //        }
                //    });
                //}

                // At last, if the user has denied notifications, and you 
                // want to be respectful there is no need to bother them any more.
            alert(msg);
        });
    }

    push() {
        Notification.requestPermission().then((result) => {
            this.subscribePush();
        });
    }

    async subscribePush() {
        const options = {
            userVisibleOnly: true,
            applicationServerKey: this.urlB64ToUint8Array(publicServerKey)
        };
        console.log("hi");
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        console.log("hi2");
        let subscription = await serviceWorkerRegistration.pushManager.getSubscription();
        if (subscription == null) {
            subscription = await serviceWorkerRegistration.pushManager.subscribe(options);
        }
        fetch("/api/Subscription/Register",
            {
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    endpoint: subscription!.endpoint,
                    p256DH: JSON.parse(JSON.stringify(subscription)).keys.p256dh,
                    auth: JSON.parse(JSON.stringify(subscription)).keys.auth
                })
            }
        );
        //}
        console.log('subscription: ', JSON.stringify(subscription));
    }

    async triggerPush() {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        const subscription = await serviceWorkerRegistration.pushManager.getSubscription();
        fetch("/api/Subscription/Trigger",
            {
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(subscription!.endpoint)
            }
        );
    }

    showNotification() {
        Notification.requestPermission().then(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("شما یک درخواست مرخصی دارید");
            }
        });
    }

    urlB64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    mounted() {

    }
} 