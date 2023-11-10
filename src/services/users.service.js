import { FirebaseAuthService, FirebaseFirestoreService } from "./firebase";
import SessionService from "./session.service";

const UsersService = {
  login: async () => {
    if (!UsersService.checkSession()) {
      const result = await FirebaseAuthService.signInWithGoogle();
      if (result) {
        const email = result.user.email;
        let user;
        user = await FirebaseFirestoreService.getRecords(collection, [
          "email",
          "==",
          email,
        ]);
        if (Object.keys(user).length === 0)
          user = await FirebaseFirestoreService.addRecord(collection, {
            name: result.user.displayName,
            email: result.user.email,
            phoneNumber: result.user.phoneNumber,
            photo: result.user.photoURL,
            source: "Blog",
            googleCreatedAt: result.user.metadata.createdAt,
            createdAt: new Date().getTime(),
          });
        user = { ...user, timestamp: new Date().getTime() };
        const encryptedUser = btoa(JSON.stringify(user));
        SessionService.set("User", encryptedUser);
        return "LOGGED_IN";
      } else {
        return false;
      }
    } else {
      return true;
    }
  },
  checkSession: () => {
    let user;
    user = SessionService.get("User");
    if (user) {
      user = JSON.parse(atob(user));
      if ((new Date().getTime() - user.timestamp) / 1000 < 86400) return true;
      else {
        UsersService.logout();
        return false;
      }
    } else return false;
  },
  getCurrentUserID: () => {
    let user;
    user = SessionService.get("User");
    if (user) {
      user = JSON.parse(atob(user));
      if ((new Date().getTime() - user.timestamp) / 1000 < 86400)
        return Object.keys(user)[0];
      else {
        UsersService.logout();
        return false;
      }
    } else return false;
  },
  getCurrentUserName: () => {
    let user;
    user = SessionService.get("User");
    if (user) {
      user = JSON.parse(atob(user));
      if ((new Date().getTime() - user.timestamp) / 1000 < 86400)
        return Object.values(user)[0].name;
      else {
        UsersService.logout();
        return "guest";
      }
    } else return "guest";
  },
  logout: () => {
    SessionService.remove("User");
  },
  fetchUserFromID: async (id) =>
    await FirebaseFirestoreService.getRecordByID(collection, id),
  getUserDisplayNameById: async (id) => {
    const user = await UsersService.fetchUserFromID(id);
    return user.name;
  },
};

const collection = Object.freeze("Users");

export default UsersService;