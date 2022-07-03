import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { toastController, alertController } from "@ionic/core";
import { logoGoogle, logoFacebook, logOut } from "ionicons/icons";
import "../../theme/Login_Signup.css";
import { auth } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, logout } = UserAuth();

  let router = useIonRouter();
  const handleAlert = async (msg) => {
    const alert = await alertController.create({
      header: "Oh no!",
      message: msg,
      buttons: ["Ok"],
    });

    await alert.present();
  };

  const handleToast = async (msg) => {
    const toast = await toastController.create({
      color: "dark3",
      position: "top",
      duration: 2000,
      message: msg,
      translucent: false,
      showCloseButton: true,
    });
    await toast.present();
  };

  const handleLogin = async (e) => {
    var atposition = email.indexOf("@");
    var dotposition = email.lastIndexOf(".");
    try {
      if (email == null || email === "") {
        const msg = "Please enter your email";
        handleToast(msg);
      } else if (password == null || password === "") {
        const msg = "Please enter your password";
        handleToast(msg);
      } else if (
        atposition < 1 ||
        dotposition < atposition + 2 ||
        dotposition + 2 >= email.length
      ) {
        const msg = "Please enter a valid email address";
        handleToast(msg);
      } else {
        try {
          await login(email, password);
          if(auth.currentUser.emailVerified){
            router.push("/home");
          }
          else{
            const msg = "Please complete the verification and try to login."
            handleAlert(msg)
            logout()
          }
        } catch (e) {
          const msg = JSON.stringify(e.message);
          console.log(msg);
          try {
            if (msg.includes("user-not-found")) {
              handleAlert(
                "User not found with the entered email address, Please enter correct email address."
              );
            } else if (msg.includes("wrong-password")) {
              handleAlert(
                "Wrong password entered, Please enter the correct password"
              );
            } else {
              handleAlert(msg);
            }
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    } catch (e) {
      const msg = e.message;
      handleAlert(msg);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lp-sp-page">
        <IonGrid className="lp-sp-content">
          <IonRow className="logo-container">
            <IonImg className="logo" src="assets/images/logo.png" />
            <IonLabel className="logo-text">Konnect.</IonLabel>
          </IonRow>
          <IonRow className="lp-sp-heading-container">
            <IonLabel className="lp-sp-heading">Welcome Back.</IonLabel>
          </IonRow>
          <IonRow className="input-container">
            <IonInput
              className="input"
              type="text"
              placeholder="Email ID"
              onIonChange={(e) => setEmail(e.detail.value)}
              required
            />
            <IonInput
              className="input"
              type="password"
              placeholder="Password"
              onIonChange={(e) => setPassword(e.detail.value)}
              required
            />
            <IonItem lines="none" className="forgot-txt-container">
              <IonLabel>Forgot Password?</IonLabel>
            </IonItem>
          </IonRow>
          <IonRow className="lp-sp-btn-container">
            <IonCol>
            <IonButton
              className="lp-sp-btn"
              shape="round"
              color="light"
              onClick={(e) => handleLogin()}
            >
              <IonLabel className="lp-sp-btn-text ion-text-capitalize">
                Login
              </IonLabel>
            </IonButton>
           </IonCol>
            <IonLabel>or</IonLabel>
            <IonCol className="alternate-logins">
            <IonIcon icon={logoGoogle} color="light" size="large"/>
            <IonIcon icon={logoFacebook} color="light" size="large"/>
            </IonCol>
          </IonRow>
          <IonRow class="lp-sp-switch-container">
            <IonLabel className="lp-account-text">
              Dont have an account?
            </IonLabel>
            <IonButton
              className="lp-sp-switch-btn"
              fill="clear"
              color="dark"
              routerLink="/signup"
            >
              <IonLabel className="lp-sp-switch-btn-text ion-text-capitalize">
                Signup
              </IonLabel>
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
