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
  $submitForm.toggleClass("hidden");
}

$submitNewStory.on("click", navSubmitClick);

/** When a user clicks favorites, fetch and show favorites list */

function navFavoritesClick(evt) {
evt.prentDefault();


// hide the main list and
// show the favorites list (html element)
// append each favorite story to the favorites list
// update star icon (with filled)
}

// show the favorites list (html element)

// append each favorite story to the favorites list
function generateFavoriteList() {

}
