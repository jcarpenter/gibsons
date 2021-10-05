# Gibsons

A prototype designed to 

1) Experiment with proposed 3D HTML/CSS layout standards
2) Communicate those proposals with live visuals and code editing

![](./demo.gif)

## Getting started

* `npm install` - Install dependencies
* `npm run start` - Build bundle and start development server

## How it works

A standard responsive website is turned into an XR site through a combination of JS custom CSS properties.

* index.html starts as a standard website (albeit with `<model>` elements).
* It's styles are loaded from `hiking-mobile.css`.
* On page load, bundle.js instantiates a pseudo-VR browser environment around index.html.
* When a condition is met (can be a user input), a second stylesheet called `hiking-vr.css` is activated.
* It contains 3D styling information. E.g 360 backgrounds, 3D transforms.
* Some 3D styles are done with custom CSS properties such as `--transform-style: stereo`.
* Others are defined with standard CSS attributes, and then re-interpreted, e.g. `translate3d`.

## Tasks

### TODO

- Write docs explaining how the project works.
- Switch to adding class to top-level object and flatting CSS into one file, ala Marley and Jordan's approach.
- Rename `vr` in CSS to 3D mode.
- Make window size variable
- Add 2D UI for current states, trigger transitions, etc.

Old

- Implement single WebGL renderer instead of two, per [Jerome’s tutorial]
- Add OBJ support
- Create new GLTF in C4D. Figure out C4D GLTF workfolow. Stalled at moment. Need to first get OBJ workflow functioning. Can then figure out OBJ-to-C4D.
- Re-implement magic window mode. Had to remove during refactor
- Add GLTF animations (this may be very little work to implement?)
- Add rotation support to model
- Improve orthographic camera animation move
- Tween on style mutations. See previous ChromeVR prototype ccode 

Maybes

- A reveal: start camera tight on page… Pull back to reveal 3D environment.
- Create Three.js WebGL elements from DOM elements
- Add additional cameras. E.g. Isomorphic… Straight-on.


### Done

- Start with ChromeVR scene 
- Implement WebPack + Babel
- Parse background image from css custom property
- Bind to a user keypress.
- Display GLTF environment on user keypress
- Load GLTF url from CSS
- Add scrolling support on web content
- Create function to check elements for custom properties. Problem is custom-properties cascade, so children inherit.
- Create Three.js CSS3D objects from DOM elements
- Split normal and VR styles into separate sheets, and load VR on action.
- sceneCSS - Wants to be in mm, because transforms will be specified in px, so scale sceneCSS to 0.001.
- Hide webview shadow when background is loaded.
- Add absolute positioning support
- Add magic window mode (note: ended up later disabling this)
- Make functions for windowed vs fullscreen modes
- Disable elastic scrolling on window
- Make stylesheets load by default, on page load
- Get hover states working
  - This was hard. Many hours wasted. Scrolling wasn’t working, cameras weren’t lining up. In end, it was all about scale. Solution was: 
  - Harmonizing GL and CSS scene scales were same: `1, 1, 1`
  - Setting camera scale to `0.01`. 
  - Creatinga new root Group for CSS objects, called `cssRoot` and scaling it to `0.001`.
- Refactor into ES6 modules
- Finalize “look around edges” camera move.
- Add orthographic camera move
- Add `<model>` support
- Make ground grid a textured mesh
- Add support for foreground WebGL models, based on CSS position
  - Did this by adding second GL renderer.
- Add support for multiple `<model>` elements
- Add scale support to models
- Add environment support
- Enable step-by-step feature build up (instead of all-at-once)
- Update Css3dObject(s) to use standard show/hide instead of `animate()`
- Add show/hide support for environment
- Add show/hide support for models
- Make foreground WebGL renderer click-through (used pointer events)
- Fix alpha blending of ground grid (use pre-multiplied?)

### Failed

**Parse new value: transform-style: stereo.** Is that possible? Nope. Browser CSS parser ignores custom CSS property values, and sets elements with them to default. `transform-style: stereo` is set to `flat` at run time, for example. Will have to use custom properties instead. 

**Load child site as iframe**. As way of embedding a “clean” page. Made some progress, but abandoned because cloning element from iframe document into parent document does not also bring along the styles. They were linked to the iframe doc, not the parent. Switched to following approach: Add single line of JS to a vanilla scene. It adds elements, sets up the Three.js scene, moves vanilla scene elements into new parents, positions everything, etc. Is a cleaner approach.

**Make magic window layer click-through.** Played with pointer events, z-index CSS values, and order of declaration / adding to the scene, and none of the made a difference. 


