"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
      <i class="bi bi-star"></i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Pull favorite story list, generates their HTML, and puts on page */
function putFavoriteStoriesOnPage() {
  console.debug("putFavoirteStoriesOnPage");

  $favoritesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let favStory of currentUser.favorites) {
    const $favStory = generateStoryMarkup(favStory);
    $favoritesList.append($favStory);
  }

  $favoritesList.show();
}

/** Gets data from the form, creates and shows new story */
async function submitNewStoryAndShow(evt) {
  evt.preventDefault();
  const formData = getDataFromForm();

  const newStory = await StoryList.addStory(currentUser, formData);
  storyList = await StoryList.getStories();

  putStoriesOnPage();
}

/** gets the data from the form and returns it */
function getDataFromForm() {
  let title = $inputTitle.val();
  let author = $inputAuthor.val();
  let url = $inputUrl.val();

  return { title, author, url };
}

//event listener on form element
$submitForm.on("submit", submitNewStoryAndShow);
