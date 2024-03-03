class UserData {
  #username;
  #email;
  #userID;
  #profilePic;
  #level;
  #xp;
  #rank;
  #streak;

  constructor() {
    this.#level = 'Not set';
    this.#xp = 0;
    this.#xp = 0;
  }

  get username() {
    return this.#username;
  }

  set username(value) {
    this.#username = value;
  }

  get email() {
    return this.#email;
  }

  set email(value) {
    this.#email = value;
  }

  get userID() {
    return this.#userID;
  }

  set userID(value) {
    this.#userID = value;
  }

  get profilePic() {
    return this.#profilePic;
  }

  set profilePic(value) {
    this.#profilePic = value;
  }

  get level() {
    return this.#level;
  }

  set level(value) {
    this.#level = value;
  }

  get xp() {
    return this.#xp;
  }

  set xp(value) {
    this.#xp = value;
  }

  get rank() {
    return this.#rank;
  }

  set rank(value) {
    this.#rank = value;
  }

  get streak() {
    return this.#rank;
  }

  set streak(value) {
    this.#streak = value;
  }

  // A method to update multiple fields at once
  setUserData({ username, email, userID, profilePic, level, xp, rank, streak }) {
    this.#username = username;
    this.#email = email;
    this.#userID = userID;
    this.#profilePic = profilePic;
    this.#level = level;
    this.#xp = xp;
    this.#rank = rank;
    this.#streak = streak;
  }

  getUserData() {
    return {
      username: this.#username,
      email: this.#email,
      userID: this.#userID,
      profilePic: this.#profilePic,
      level: this.#level,
      xp: this.#xp,
      rank: this.#rank,
      streak: this.#streak,
    };
  }
}

// Ensure the class cannot be instantiated more than once
const userDataInstance = new UserData();
export default userDataInstance;
