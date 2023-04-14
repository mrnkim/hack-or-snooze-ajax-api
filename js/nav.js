"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** show submit form on click on "submit" link */
function navSubmitClick(evt) {
  evt.preventDefault(); //QUESTION: is it necessary?
  $submitForm.show();
}

$submitNewStory.on("click", navSubmitClick);

/** When a user clicks favorites, fetch and show favorites list */

function navFavoritesClick(evt) {
  evt.preventDefault();

  $favoritesList.toggleClass("hidden");
  $submitForm.toggleClass("hidden");
  hidePageComponents();

  // $allStoriesList.toggleClass("hidden");

  //make the empty favorites list element with a class of hidden

  // toggle class hidden on favorites list

  // toggle class hidden on main list
}

$navFavorites.on("click", navFavoritesClick);

// show the favorites list (html element)

// append each favorite story to the favorites list
function generateFavoriteList() {}
// append each favorite story to the favorites list
// update star icon (with filled)
