# BigCommerce Theme Builder Test
Jared ONeil

[Link to store](https://github.com/Onred/stencil-test)\
Preview Code: `nqcrlgdwr9`

This readme describes an overview of my test as well as some of my thoughts.

### Installation
Installing the Stencil CLI and cornerstone theme was a very smooth experience. I did so on my personal machine, which runs a non-Debian distribution of Linux, and I had no problem initializing everything with the commands provided in the BigCommerce documentation. Since I will be submitting this test on a public GitHub repository, I double-checked the .gitignore file to make sure that it included all of the standard things such as node modules, my oauth tokens, etc, which it does by default.

### My Tasks
The tasks assigned to me for this test are to edit the default cornerstone theme to
* Add a new item category called "Special Items"
* Add a new product to that category called "Special Item" with 2 images.
* Create a feature to show the product's second image on hover.
* Make two functional buttons on the category page next to each other that utilize Storefront API to:
    * "Add All To Cart" which adds every item in the category to the cart.
    * "Remove All Items" which clears the cart. It should only appear if there are items to clear.
* Trigger a notification when either of the above button's actions have completed.
* Bonus: Use Handlebars to show a banner with some customer data at the top of the category page.

## Overview
The first two tasks were done on the store website itself, so not much to talk about there. I'm a big fan of bourbon whiskey, so I selected two royalty-free images of that.

Before completing any coding tasks, I decided to lay some ground rules for myself. Namely that I would:
1. Try to conform to the existing syntax and directory structure of the theme as much as possible, and
2. Ensure that my changes work on all of the other pre-generated example category pages.

Of course, it would be possible to edit just one file and design my features to only work for the narrow use case laid out for this test, but I prefer to design code that won't break as the site expands.

### Hover
#### Relevant files
- [card.html](https://github.com/Onred/stencil-test/tree/master/templates/components/products/card.html)
- [\_cards.scss](https://github.com/Onred/stencil-test/tree/master/assets/scss/components/citadel/cards/_cards.scss)

I started with the task to make the 2nd image appear on hover. A lot of the time for this was spent on me trying to understand how stencil organized things. In the end, I came up with a css solution and utilized Handlebars logic to make sure it worked even if the product had one or no image.

I simply loaded the second image on top of the first image using the same pre-existing component. I surrounded it in an if block to protect from errors should no second image exist and assigned to it a custom class `card-second-image` which sets the initial opacity to 0. I added a `:hover` effect to the existing `.card-figure` class to set the opacity to 1.

### Buttons
#### Relevant files
- [category.html](https://github.com/Onred/stencil-test/tree/master/templates/pages/category.html)
- [category.js](https://github.com/Onred/stencil-test/tree/master/assets/js/theme/category.js)
- [cart-buttons.html](https://github.com/Onred/stencil-test/tree/master/templates/components/category/cart-buttons.html)
- [\_alerts.scss](https://github.com/Onred/stencil-test/tree/master/assets/scss/components/foundation/alerts/_alerts.scss)
- [en.json](https://github.com/Onred/stencil-test/tree/master/lang/en.json)

I learned a lot about Stencil, Handlebars, and Cornerstone with these tasks. Coming from mostly working in Vue/React, integrating Javascript seemed a little convoluted at first. In the end, I relied on the examples provided in the Storefront API documentation for the Javascript and pulled inspiration from other parts of the theme code. I utilized the existing alert banners to display notifications and added my own simple animation to make it look a little bit better. For any text, I made sure to use the existing language file, albeit only in English for this test.

Attempting to use the `Add All` button on a page containing a product with options broke the API. The Front Matter on the categories pages did not expose the options, so I spent some time writing conditions to exclude those products when the button is pressed and hide the button if there is nothing to add. This was only relevant to prevent the button from breaking on other pages, but I felt like it was worth the time to understand how to fix this bug.

I also played around with hacking the Handlebars helpers to do a simple calculation on the notification text. I'm not entirely pleased with this solution as I would rather want to find a more elegant way using Javascript, but it worked.

### User Banner
#### Relevant files
- [user-banner.html](https://github.com/Onred/stencil-test/tree/master/templates/components/category/user-banner.html)
- [user-banner-detail.html](https://github.com/Onred/stencil-test/tree/master/templates/components/category/user-banner-detail.html)
- [\_component.scss](https://github.com/Onred/stencil-test/tree/master/assets/scss/components/custom/userbanner/_component.scss)
- [\_components.scss](https://github.com/Onred/stencil-test/tree/master/assets/scss/components/_components.scss)
- [\_userbanner.scss](https://github.com/Onred/stencil-test/tree/master/assets/scss/components/custom/userbanner/_userbanner.scss)
- [en.json](https://github.com/Onred/stencil-test/tree/master/lang/en.json)

My previous experience working with the Handlebars helpers made this bonus task relatively quick to complete. I opted for minimal styling and used this as an opportunity to practice importing my own custom CSS. I designed the component in a way that is easily scalable should one want to add additional fields. The component automatically detects if the information exists and if not, it will change its text to say the info is missing.