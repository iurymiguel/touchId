import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    AndroidFingerprintAuth
  ]
})
export class HomePage {

  constructor(public navCtrl: NavController, public androidFingerprintAuth: AndroidFingerprintAuth, private toastCtrl: ToastController) {

  }


  fingerButton() {
    this.androidFingerprintAuth.isAvailable()
      .then((result) => {
        if (result.isAvailable) {
          // it is available

          this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword' })
            .then(result => {
              if (result.withFingerprint) {
                console.log('Successfully encrypted credentials.');
                console.log('Encrypted credentials: ' + result.token);
              } else if (result.withBackup) {
                console.log('Successfully authenticated with backup password!');
              } else console.log('Didn\'t authenticate!');
            })
            .catch(error => {
              if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                console.log('Fingerprint authentication cancelled');
              } else console.error(error)
            });

        } else {
          // fingerprint auth isn't available
          this.presentToast();
        }
      })
      .catch(error => console.error(error));
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Fingerprint unavailable',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
}
