"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */
  getHostName() {
    const host = new URL(this.url).hostname;
    return host;
  }

  static async getStoryById(storyId) {
    let stories = storyList.stories;
    for (let story of stories) {
      if (story.storyId === storyId) {
        return story;
      }
    }
  }
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map((story) => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  static async addStory(currentUser, story) {
    const response = await axios({
      method: "POST",
      baseURL: BASE_URL,
      url: "/stories",
      headers: { "Content-Type": "application/json" },
      data: {
        token: `${currentUser.loginToken}`,
        story: story,
      },
    });

    const newStory = new Story(response.data.story);

    return newStory;
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  //TODO: review before requestion CR.
  async addFavorite(story) {
    const { storyId } = story;
    const { username, loginToken } = currentUser;

    const options = {
      method: "POST",
      baseURL: BASE_URL,
      url: `/users/${username}/favorites/${storyId}`,
      headers: { "Content-Type": "application/json" },
      data: {
        token: `${loginToken}`,
      },
    };

    let response = await axios.request(options);

    //get response -> update favorites in the class
    this.favorites = response.data.user.favorites.map((s) => new Story(s));
  }

  //remove from favorites
  async removeFavorite(story) {
    const { storyId } = story;
    const { username, loginToken } = currentUser;

    const options = {
      method: "DELETE",
      baseURL: BASE_URL,
      url: `/users/${username}/favorites/${storyId}`,
      headers: { "Content-Type": "application/json" },
      data: {
        token: `${loginToken}`,
      },
    };

    let response = await axios.request(options);

    //TODO:
    //sideeffects
    //remove story UI element from user list -> seperate function
    //re-render favorites list from
    this.favorites = response.data.user.favorites.map((s) => new Story(s));

    //update start icon on main paige to reflect removal from favorites
    //seperate function -> this operation depends on the "hint" function working
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    const { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    const { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      const { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}
