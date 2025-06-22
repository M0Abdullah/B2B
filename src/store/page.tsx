import { makeAutoObservable } from "mobx";

class LoginStore {
  isSeller: boolean = false;
  isBuyer: boolean = true;
  islogin: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  setRole(role: "Seller" | "Buyer") {
    if (role === "Seller") {
      this.isSeller = true;
      this.isBuyer = false;
      this.islogin = true;
    } else {
      this.isSeller = false;
      this.isBuyer = true;
      this.islogin = true;
    }
    console.log("Role set to:", role);
    console.log(
      "Current State => isSeller:",
      this.isSeller,
      "| isBuyer:",
      this.isBuyer,
      "| islogin:",
      this.islogin,
    );
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    const data = {
      isSeller: this.isSeller,
      isBuyer: this.isBuyer,
      islogin: this.islogin,
    };
    localStorage.setItem("loginRole", JSON.stringify(data));
    console.log("State saved to localStorage:", data);
  }

  loadFromLocalStorage() {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("loginRole");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        this.isSeller = parsed.isSeller ?? false;
        this.isBuyer = parsed.isBuyer ?? true;
        this.islogin = parsed.islogin ?? false;
        console.log("State loaded from localStorage:", parsed);
      } else {
        console.log("No loginRole found in localStorage");
      }
    }
  }

  loginDataStore() {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("loginRole");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        this.islogin = parsed.islogin ?? false;
        console.log("Login status loaded from localStorage:", this.islogin);
      } else {
        console.log("No loginRole found in localStorage for loginDataStore");
      }
    }
  }

  reset() {
    this.isSeller = false;
    this.isBuyer = true;
    this.islogin = false;
    console.log("Store reset to default values");
    this.saveToLocalStorage();
  }
}

const loginStore = new LoginStore();
export default loginStore;
