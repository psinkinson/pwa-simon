/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // setup levels
  var levels = [
    [0, 1, 3, 2],
    [0, 0, 1, 3, 1],
    [0, 1, 3, 2, 3, 1, 3],
    [1, 3, 3, 1, 4, 2],
    [0, 3, 0, 1, 2, 1, 0]
  ];
  var levelIdx = 0;
  var selectedLevel = [];

  setLevel(0);

  // setup buttons
  var selectedIdx = -1;
  var tmr = null;
  var items = document.querySelectorAll('.board__button');
  console.log('items', items.length);

  //  wire up buttons
  var watchInput = false;
  items.forEach(function(item) {
    item.addEventListener('click', function() {
      if (watchInput) {
        flashItem(item);
        var clickedItem = parseInt(item.id.split('-')[1], 10);
        console.log(clickedItem);
        var expectedItem = selectedLevel[selectedIdx];
        // check input
        if (clickedItem === expectedItem) {
          console.log('CORRECT');
        } else {
          console.log('INCORRECT pressed ' + clickedItem + ' expected ' + expectedItem);
        }
        selectedIdx++;
        if (selectedIdx === selectedLevel.length) {
          watchInput = false;
          setLevel(levelIdx + 1);
        }
      }
    });
  });
  document.getElementById('startGame')
    .addEventListener('click', function() {
      console.log('click start');
      start();
    });

  // document.getElementById('stopGame')
  //   .addEventListener('click', function() {
  //     console.log('click stop');
  //     stop();
  //   });

  function flashItem(item) {
    addClass(item, 'flash');
    setTimeout(function() {
      removeClass(item, 'flash');
    }, 150);
  }

  function setLevel(level) {
    levelIdx = level;
    selectedLevel = levels[levelIdx];
    document.getElementById('level').innerHTML = levelIdx;
  }

  // game funcs
  function start() {
    cancelNextItem();
    selectedIdx = -1;
    setVisibility('instruction-watch', true);
    nextItem();
  }
  function setVisibility(id, visible) {
    document.getElementById(id).style.display = visible ? 'visible' : 'hidden';
  }
  // function stop() {
  //   cancelNextItem();
  // }

  // level funcs
  // function nextLevel() {
  //   if (levelIdx < levels.length) {
  //     levelIdx++;
  //     selectedLevel = levels[levelIdx];
  //   }
  // }
  function addClass(elem, cls) {
    if (typeof elem === 'string') {
      console.log('addClass elem === string', elem);
      elem = document.getElementById(elem);
    }
    var i;
    var found = false;
    console.log('addClass elem', elem);
    var classes = elem.className.split(' ');
    console.log(classes);
    for (i = 0; i < classes.length; i++) {
      if (classes[i] === cls) {
        found = true;
      }
    }
    if (!found) {
      elem.className += ' ' + cls;
      console.log(elem.className);
    }
  }
  function removeClass(elem, remove) {
    if (typeof elem === 'string') {
      elem = document.getElementById(elem);
    }
    var newClassName = '';
    var i;
    var classes = elem.className.split(' ');
    for (i = 0; i < classes.length; i++) {
      if (classes[i] !== remove) {
        newClassName += classes[i] + ' ';
      }
    }
    elem.className = newClassName;
    console.log(elem.className);
  }

  // button funcs
  function cancelNextItem() {
    if (tmr) {
      window.cancelTimeout(tmr);
    }
  }
  function clearItems() {
    items.forEach(function(item) {
      removeClass(item, 'flash');
    });
  }
  function setItem(selectedIdx) {
    addClass(items[selectedIdx], 'flash');
  }
  // function setItems(selectdIdx) {
  //   items.forEach(function(item, idx) {
  //     if (idx === selectdIdx) {
  //       addClass(item, 'flash');
  //       // item.style.opacity = '1';
  //     } else {
  //       removeClass(item, 'flash');
  //       // item.style.opacity = '0.5';
  //     }
  //   });
  // }
  function nextItem() {
    tmr = null;
    var currentIdx = -1;
    selectedIdx++;
    if (selectedIdx < selectedLevel.length) {
      // not finished pattern yet
      currentIdx = selectedLevel[selectedIdx];
    }
    // clear current
    if (selectedIdx > 0) {
      clearItems();
    }
    // set next

    if (selectedIdx > 0 && currentIdx > -1) {
      // was previous and next
      // allow a pause before next flash
      window.setTimeout(function() {
        postNext(currentIdx);
      }, 200);
    } else {
      // no previous flash so just set next
      postNext(currentIdx);
    }
  }
  function postNext(currentIdx) {
    if (currentIdx > -1) {
      setItem(currentIdx);
      tmr = window.setTimeout(nextItem, 800);
    } else {
      startWatching();
    }
  }
  function startWatching() {
    selectedIdx = 0;
    addClass('instruction-watch', 'hidden');
    removeClass('instruction-copy', 'hidden');
    watchInput = true;
  }
})();
