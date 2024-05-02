let currentY = 0;
let prevCurrentY = 0;
let scrollAndClick = 0;

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,
  smoothMobile: true,
});

function locoScrollFN() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  locoScroll.on("scroll", ({ limit, scroll }) => {
    if (scrollAndClick === 0) {
      document.querySelector("#redDropdown").style.animation =
        "dropdown_anim_up 1s linear forwards";
      document.querySelector("#takeItCursor").style.display = "flex";
    }

    if (prevCurrentY > scroll.y) {
      gsap.to("#header-navigation", {
        autoAlpha: 1, // Turns Visibility to visible & opacity to 1
        duration: 0,
        top: scroll.y + "px",
      });

      gsap.to("#redDropdown", {
        autoAlpha: 1, // Turns Visibility to visible & opacity to 1
        duration: 0,
        top: scroll.y + "px",
      });
    }

    prevCurrentY = scroll.y;

    $("#page8-head").css({
      opacity: function () {
        const temp =
          (limit - (limit - 2000) - (scroll.y - (limit - 2000))) /
          (limit - (limit - 2000));

        currentY = scroll.y;
        return 1 - temp;
      },
    });

    $("#page8-mid").css({
      opacity: function () {
        const temp =
          (limit - (limit - 2000) - (scroll.y - (limit - 2000))) /
          (limit - (limit - 2000));

        currentY = scroll.y;
        return 1 - temp;
      },
    });
  });

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => {
    locoScroll.update();
  });

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}

locoScrollFN();

// cursor tracker effect
function cursorEffect(cursorId, pageContent) {
  pageContent.addEventListener("mousemove", function (e) {
    gsap.to(cursorId, {
      x:
        pageContent.id == "page1-container"
          ? e.clientX - $(cursorId).height() / 2
          : e.clientX - $(cursorId).height(),
      y:
        pageContent.id == "page1-container"
          ? currentY + e.clientY - $(cursorId).height() / 2
          : e.clientY - $(cursorId).height() / 2,
      opacity: 1,
    });
  });

  function scaleUp() {
    gsap.to(cursorId, {
      scale: 1,
      opacity: 1,
    });
  }

  function scaleDown() {
    gsap.to(cursorId, {
      scale: 0,
      opacity: 0,
    });
  }

  document
    .querySelector("#header-navigation")
    .addEventListener("mouseenter", function () {
      gsap.to("#playReelCursor", {
        scale: 0,
        opacity: 0,
      });
    });

  document
    .querySelector("#header-navigation")
    .addEventListener("mouseleave", function () {
      gsap.to("#playReelCursor", {
        scale: 1,
        opacity: 1,
      });
    });

  document
    .querySelector("#redDropdown")
    .addEventListener("mouseenter", scaleDown);

  document
    .querySelector("#redDropdown")
    .addEventListener("mouseleave", scaleUp);

  document
    .querySelector("#page4-texts")
    .addEventListener("mouseenter", function () {
      gsap.to("#takeItCursor", {
        scale: 0,
        opacity: 0,
      });
    });

  document
    .querySelector("#page4-texts")
    .addEventListener("mouseleave", function () {
      gsap.to("#takeItCursor", {
        scale: 1,
        opacity: 1,
      });
    });

  document
    .querySelector("#page4-texts")
    .addEventListener("mousemove", function () {
      gsap.to("#takeItCursor", {
        scale: 0,
        opacity: 0,
      });
    });

  document.querySelector("#page3").addEventListener("mouseenter", function () {
    gsap.to("#takeItCursor", {
      scale: 0,
      opacity: 0,
    });
  });

  pageContent.addEventListener("mouseleave", () => {
    scaleDown();
  });

  pageContent.addEventListener("mouseenter", () => {
    scaleUp();
  });
}

cursorEffect("#playReelCursor", document.querySelector("#page1-container"));
cursorEffect("#takeItCursor", document.querySelector("#page4"));

function dropdownIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelector("#dropdown-twitter").style.animation =
          "rightToLeft 0.6s ease-out forwards";
        document.querySelector("#dropdown-insta").style.animation =
          "rightToLeft 0.8s ease-out forwards";
        document.querySelector("#dropdown-linkedin").style.animation =
          "rightToLeft 1s ease-out forwards";
        document.querySelector("#left").style.animation =
          "rightToLeftOne 0.5s ease-out forwards";
      } else {
        document.querySelector("#dropdown-twitter").style.animation =
          "leftToRight 1s ease-out forwards";
        document.querySelector("#dropdown-insta").style.animation =
          "leftToRight 0.8s ease-out forwards";
        document.querySelector("#dropdown-linkedin").style.animation =
          "leftToRight 0.6s ease-out forwards";
        document.querySelector("#left").style.animation =
          "leftToRightOne 1s ease-out forwards";
      }
    });
  });
  observer.observe(document.querySelector("#right"));
}

dropdownIntersectFn();

function footerDownIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelector("#page8-head").style.animation =
          "footer_anim_down 2s linear forwards";
        document.querySelector("#page8-mid").style.animation =
          "footer_anim_down 2s linear forwards";
      } else {
        document.querySelector("#page8-head").style.animation =
          "footer_anim_up 2s linear forwards";
        document.querySelector("#page8-mid").style.animation =
          "footer_anim_up 2s linear forwards";
      }
    });
  });
  observer.observe(document.querySelector("#footer-heading"));
}

footerDownIntersectFn();

function pageTwoIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animatePageTwo();
      } else {
        $(".page2-hr").removeClass("start");
      }
    });
  });
  observer.observe(document.querySelector(".page2-main"));
}

pageTwoIntersectFn();

function pageFourAnimateText() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $(".page4-hr").addClass("start");
      } else {
        $(".page4-hr").removeClass("start");
      }
    });
  });
  observer.observe(document.querySelector("#page4-texts"));
}

pageFourAnimateText();

function pageFiveIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $(".page5-hr").addClass("start");
      } else {
        $(".page5-hr").removeClass("start");
      }
    });
  });
  observer.observe(document.querySelector("#page5-texts"));
}

pageFiveIntersectFn();

let allow = true;
function pageOneIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        allow = true;
        $("#brandName")[0].innerHTML = "The Venture Agency";
        document.getElementById("header-navigation").style.color = "#fff";
        if (small.matches) {
          document.getElementById("openMenu").style.border = "1px solid #fff";
          $("#header-navigation").removeClass("bgWhite");
        }
      } else {
        allow = false;
        $("#brandName")[0].innerHTML = "rejouice";
        document.getElementById("header-navigation").style.color = "#000";
        if (small.matches) {
          document.getElementById("openMenu").style.border = "1px solid #000";
          $("#header-navigation").addClass("bgWhite");
        }
      }
    });
  });
  observer.observe(document.querySelector("#page1"));
}

pageOneIntersectFn();

function pageFourIntersectFn() {
  const observerOne = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        animatePageFourMain();
      }
    });
  });

  observerOne.observe(document.querySelector(".page4-main"));

  const observerTwo = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        animatePageFourHead();
      }
    });
  });

  observerTwo.observe(document.querySelector("#page4-head"));

  const observerThree = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        animatePageFiveMain();
      }
    });
  });

  observerThree.observe(document.querySelector(".page5-main"));

  const observerFour = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        animatePageFiveHead();
      }
    });
  });

  observerFour.observe(document.querySelector("#page5-head"));
}

pageFourIntersectFn();

function textUpEffect(identifier) {
  const splitLines = new SplitText(`${identifier} span`, {
    type: "lines",
    linesClass: "line line++",
  });

  $(`${identifier} .line`).wrap('<div class="line-wrapper">');

  gsap.from(splitLines.lines, {
    yPercent: 200,
    ease: "power4",
    stagger: 0.2,
    onComplete: splitRevert,
  });

  function splitRevert() {
    splitLines.revert();
  }
}

function animatePageThree() {
  textUpEffect(".border-bottom");
}

function animatePageEight() {
  textUpEffect(".border-bottom-page6");
}

function pageThreeIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        animatePageThree();
      }
    });
  });

  observer.observe(document.querySelector(".passthrough-page3"));
}

pageThreeIntersectFn();

function pageEightIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        animatePageEight();
      }
    });
  });

  observer.observe(document.querySelector(".passthrough-page6"));
}

pageEightIntersectFn();

function animatePageTwo() {
  $(".page2-hr").addClass("start");
  textUpEffect(".page2-main");
  textUpEffect("#page2-head-right");
  textUpEffect("#page2-head-left");
}

function animatePageFourMain() {
  textUpEffect(".page4-main");
}

function animatePageFiveMain() {
  textUpEffect(".page5-main");
}

function animatePageFiveHead() {
  textUpEffect("#page5-head p");
}

function animatePageFourHead() {
  textUpEffect("#page4-head p");
}

function imageToVideo(id1, id2) {
  document.getElementById(id1).style.opacity = "0";
  document.getElementById(id1).style.transition = "opacity 0.3s ease-out";
  document.getElementById(id2).style.zIndex = "1";
  document.getElementById(id2).style.opacity = "1";
  document.getElementById(id2).style.position = "absolute";
  document.getElementById(id2).style.left = "0";
  document.getElementById(id2).style.transition = "opacity 0.3s ease-in";
}

function videoToImage(id1, id2) {
  document.getElementById(id1).style.opacity = "1";
  document.getElementById(id2).style.opacity = "0";
  document.getElementById(id2).style.position = "absolute";
  document.getElementById(id2).style.zIndex = "-1";
}

function imgHoverEffect() {
  document
    .getElementById("card-one-img")
    .addEventListener("mouseenter", function () {
      imageToVideo("card-one-img", "card-one-video");
    });

  document
    .getElementById("card-one-video")
    .addEventListener("mouseleave", function () {
      videoToImage("card-one-img", "card-one-video");
    });

  document
    .getElementById("card-two-img")
    .addEventListener("mouseenter", function () {
      imageToVideo("card-two-img", "card-two-video");
    });

  document
    .getElementById("card-two-video")
    .addEventListener("mouseleave", function () {
      videoToImage("card-two-img", "card-two-video");
    });

  document
    .getElementById("card-three-img")
    .addEventListener("mouseenter", function () {
      imageToVideo("card-three-img", "card-three-video");
    });

  document
    .getElementById("card-three-video")
    .addEventListener("mouseleave", function () {
      videoToImage("card-three-img", "card-three-video");
    });
}

imgHoverEffect();

let tl = new TimelineLite();

tl.to("#white-line-page3", 0, { x: -300 });
document
  .getElementsByClassName("passthrough-page3-container")[0]
  .addEventListener("mouseenter", () => {
    tl.to("#white-line-page3", 0, { x: -300 });
    tl.to("#white-line-page3", 1, { x: 800, ease: Power2.easeOut });
  });

document
  .getElementsByClassName("passthrough-page3-container")[0]
  .addEventListener("mouseleave", () => {
    tl.to("#white-line-page3", 0, { x: -300 });
    tl.to("#white-line-page3", 1, { x: 800, ease: Quad.easeOut });
  });

tl.to("#white-line-page6", 0, { x: -300 });
document
  .querySelector(".border-bottom-page6")
  .addEventListener("mouseenter", () => {
    tl.to("#white-line-page6", 0, { x: -300 });
    tl.to("#white-line-page6", 1, { x: 800, ease: Power2.easeOut });
  });

document
  .querySelector(".border-bottom-page6")
  .addEventListener("mouseleave", () => {
    tl.to("#white-line-page6", 0, { x: -300 });
    tl.to("#white-line-page6", 1, { x: 800, ease: Quad.easeOut });
  });

function checkAnimation() {
  let $elem = $(".circleSvg .outer");

  // If the animation has already been started
  if ($elem.hasClass("start")) {
    return;
  }
  // Start the animation
  $elem.addClass("start");
}

function circleIntersectFn() {
  let $elem = $(".circleSvg .outer");

  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        $elem.removeClass("reset");
        checkAnimation();
      } else {
        $elem.removeClass("start");

        $elem.addClass("reset");
      }
    });
  });

  observer.observe(document.querySelector(".circleSvg"));
}

circleIntersectFn();

function startAnimationNumber() {
  let $elem = $(".animate_number");

  // If the animation has already been started
  if ($elem.hasClass("start")) {
    return;
  }

  // Start the animation
  $elem.addClass("start");
}

function seatPageIntersectFn() {
  let $elem = $(".animate_number");

  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        $elem.removeClass("reset");
        startAnimationNumber();
      } else {
        $elem.removeClass("start");
        $elem.addClass("reset");
      }
    });
  });

  observer.observe(document.querySelector(".seat-number"));
}

seatPageIntersectFn();

let swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 30,
  autoplay: {
    delay: 2000,
    disableOnInteraction: true,
  },
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

let timeLineOne = gsap.timeline();
let timeLineTwo = gsap.timeline();

timeLineTwo.from("#main-heading span", {
  y: 100,
  opacity: 0,
  stagger: 0.1,
  duration: 1,
  delay: 5,
});

setTimeout(() => {
  $("#loader").addClass("show");
  $("#loader").addClass("hidden");
}, 3000);

function footerHeadingIntersectFn() {
  const observer = new IntersectionObserver((entries) => {
    // Loop over the entries
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        timeLineTwo.from("#footer-heading span", {
          y: -150,
          opacity: 0,
          stagger: 0.09,
          duration: 1,
        });
      }
    });
  });

  observer.observe(document.querySelector("#footer-heading"));
}

footerHeadingIntersectFn();

function sideByTexts() {
  const splitLines = new SplitText("#loader p", {
    type: "lines",
    linesClass: "line line++",
  });

  timeLineOne.from(".loaderh3", {
    x: 40,
    opacity: 0,
    duration: 3,
    stagger: 0.1,
  });

  timeLineOne.to(".loaderh3", {
    x: -40,
    opacity: 0,
    duration: 3,
    stagger: 0.1,
  });
}

sideByTexts();

let styleElem = document.head.appendChild(document.createElement("style"));

document
  .querySelector("#closeMenu")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#closeMenu");
  });

document
  .querySelector("#closeMenu")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#closeMenu");
  });

function borderAnimationForward(id) {
  styleElem.innerHTML =
    id +
    ":hover:before { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; border-bottom: solid 2px #fff; animation: border_anim 1s linear forwards; }";
}

function borderAnimationReverse(id) {
  styleElem.innerHTML =
    id +
    ":before { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; border-bottom: solid 2px #fff; animation: border_anim_rev 1s linear forwards; }";
}

function blackBorderAnimationForward(id) {
  styleElem.innerHTML =
    id +
    ":hover:before { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; border-bottom: solid 2px #000; animation: border_anim 1s linear forwards; }";
}

function blackBorderAnimationReverse(id) {
  styleElem.innerHTML =
    id +
    ":before { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; border-bottom: solid 2px #000; animation: border_anim_rev 1s linear forwards; }";
}

document.querySelector("#openMenu").addEventListener("mouseenter", function () {
  borderAnimationForward("#openMenu");
});

document.querySelector("#openMenu").addEventListener("mouseleave", function () {
  borderAnimationReverse("#openMenu");
});

// white underline effect
document
  .querySelector("#dropdown-twitter")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#dropdown-twitter");
  });

document
  .querySelector("#dropdown-twitter")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#dropdown-twitter");
  });

document
  .querySelector("#dropdown-insta")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#dropdown-insta");
  });

document
  .querySelector("#dropdown-insta")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#dropdown-insta");
  });

document
  .querySelector("#dropdown-linkedin")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#dropdown-linkedin");
  });

document
  .querySelector("#dropdown-linkedin")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#dropdown-linkedin");
  });

document
  .querySelector("#real-work")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#real-work");
  });

document
  .querySelector("#real-work")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#real-work");
  });

document
  .querySelector("#real-service")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#real-service");
  });

document
  .querySelector("#real-service")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#real-service");
  });

document
  .querySelector("#real-about")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#real-about");
  });

document
  .querySelector("#real-about")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#real-about");
  });

document
  .querySelector("#real-contact")
  .addEventListener("mouseenter", function () {
    blackBorderAnimationForward("#real-contact");
  });

document
  .querySelector("#real-contact")
  .addEventListener("mouseleave", function () {
    blackBorderAnimationReverse("#real-contact");
  });

document
  .querySelector("#footer-home")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-home");
  });

document
  .querySelector("#footer-home")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-home");
  });

document
  .querySelector("#footer-work")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-work");
  });

document
  .querySelector("#footer-work")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-work");
  });

document
  .querySelector("#footer-about")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-about");
  });

document
  .querySelector("#footer-about")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-about");
  });

document
  .querySelector("#footer-services")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-services");
  });

document
  .querySelector("#footer-services")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-services");
  });

document
  .querySelector("#footer-contact")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-contact");
  });

document
  .querySelector("#footer-contact")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-contact");
  });

document
  .querySelector("#footer-twitter")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-twitter");
  });

document
  .querySelector("#footer-twitter")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-twitter");
  });

document
  .querySelector("#footer-insta")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-insta");
  });

document
  .querySelector("#footer-insta")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-insta");
  });

document
  .querySelector("#footer-linkedin")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#footer-linkedin");
  });

document
  .querySelector("#footer-linkedin")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#footer-linkedin");
  });

document.querySelector("#emailId").addEventListener("mouseenter", function () {
  borderAnimationForward("#emailId");
});

document.querySelector("#emailId").addEventListener("mouseleave", function () {
  borderAnimationReverse("#emailId");
});

document
  .querySelector("#legalText")
  .addEventListener("mouseenter", function () {
    borderAnimationForward("#legalText");
  });

document
  .querySelector("#legalText")
  .addEventListener("mouseleave", function () {
    borderAnimationReverse("#legalText");
  });

function mouseEnterFn(id1, id2) {
  document.querySelector(id1).style.transform = "translateY(-100%)";
  document.querySelector(id2).style.visibility = "visible";
  document.querySelector(id2).style.transform = "translateY(-100%)";
  document.querySelector(id2).style.opacity = "1";
  document.querySelector(id1).style.opacity = "0";
}

function mouseLeaveFn(id1, id2) {
  document.querySelector(id1).style.transform = "translateY(0%)";
  document.querySelector(id2).style.visibility = "hidden";
  document.querySelector(id2).style.transform = "translateY(0%)";
  document.querySelector(id2).style.opacity = "0";
  document.querySelector(id1).style.opacity = "1";
}

document.querySelector("#real-home").addEventListener("click", function () {
  mouseEnterFn("#header-home", "#dummy-home");
});

// dropdown list animate effect
document
  .querySelector("#real-home")
  .addEventListener("mouseenter", function () {
    mouseEnterFn("#header-home", "#dummy-home");
  });

document
  .querySelector("#real-home")
  .addEventListener("mouseleave", function () {
    mouseLeaveFn("#header-home", "#dummy-home");
  });

document
  .querySelector("#real-work")
  .addEventListener("mouseenter", function () {
    mouseEnterFn("#header-work", "#dummy-work");
  });

document
  .querySelector("#real-work")
  .addEventListener("mouseleave", function () {
    mouseLeaveFn("#header-work", "#dummy-work");
  });

document
  .querySelector("#real-service")
  .addEventListener("mouseenter", function () {
    mouseEnterFn("#header-service", "#dummy-service");
  });

document
  .querySelector("#real-service")
  .addEventListener("mouseleave", function () {
    mouseLeaveFn("#header-service", "#dummy-service");
  });

document
  .querySelector("#real-about")
  .addEventListener("mouseenter", function () {
    mouseEnterFn("#header-about", "#dummy-about");
  });

document
  .querySelector("#real-about")
  .addEventListener("mouseleave", function () {
    mouseLeaveFn("#header-about", "#dummy-about");
  });

document
  .querySelector("#real-contact")
  .addEventListener("mouseenter", function () {
    mouseEnterFn("#header-contact", "#dummy-contact");
  });

document
  .querySelector("#real-contact")
  .addEventListener("mouseleave", function () {
    mouseLeaveFn("#header-contact", "#dummy-contact");
  });

document
  .querySelector("#header-button")
  .addEventListener("mouseenter", function () {
    document.querySelector("#show-btn span").style.transform =
      "translateY(-200%)";
    document.querySelector("#show-btn span").style.opacity = "0";
    document.querySelector("#down-show-btn").style.visibility = "visible";
    document.querySelector("#down-show-btn").style.transform =
      "translateY(-100%)";
    document.querySelector("#down-show-btn").style.opacity = "1";
  });

document
  .querySelector("#header-button")
  .addEventListener("mouseleave", function () {
    document.querySelector("#show-btn span").style.transform = "translateY(0%)";
    document.querySelector("#show-btn span").style.opacity = "1";
    document.querySelector("#down-show-btn").style.visibility = "hidden";
    document.querySelector("#down-show-btn").style.transform = "translateY(0%)";
    document.querySelector("#down-show-btn").style.opacity = "0";
  });

document.querySelector("#openMenu").addEventListener("click", function (e) {
  scrollAndClick = 1;
  document.querySelector("#takeItCursor").style.display = "none";
  $(".page1-hr").removeClass("end");
  document.querySelector("#redDropdown").style.display = "block";
  $(".page1-hr").addClass("start");
  document.querySelector("#redDropdown").style.animation =
    "dropdown_anim 1s linear forwards";

  setTimeout(() => {
    scrollAndClick = 0;
  }, 1000);
});

document.querySelector("#closeMenu").addEventListener("click", function (e) {
  scrollAndClick = 0;
  document.querySelector("#takeItCursor").style.display = "flex";
  $(".page1-hr").removeClass("start");
  $(".page1-hr").addClass("end");
  document.querySelector("#redDropdown").style.animation =
    "dropdown_anim_up 1s linear forwards";
});

function maxXXL(x) {
  if (x.matches) {
    document.getElementById("bigCircle").setAttribute("r", "45");
    document.getElementById("smallCircle").setAttribute("cy", "5");
  }
}

function maxXLLarge(x) {
  if (x.matches) {
    document.getElementById("bigCircle").setAttribute("r", "40");
    document.getElementById("smallCircle").setAttribute("cy", "10");
  }
}

function maxLarge(x) {
  if (x.matches) {
    document.getElementById("bigCircle").setAttribute("r", "35");
    document.getElementById("smallCircle").setAttribute("cy", "15");
  }
}

function maxMedium(x) {
  if (x.matches) {
    document.getElementById("bigCircle").setAttribute("r", "30");
    document.getElementById("smallCircle").setAttribute("cy", "20");
  }
}

function maxSmall(x) {
  if (x.matches) {
    document.getElementById("bigCircle").setAttribute("r", "25");
    document.getElementById("smallCircle").setAttribute("cy", "25");
  }
}

function maxXSmall(x) {
  if (x.matches) {
    document.getElementById("bigCircle").setAttribute("r", "23");
    document.getElementById("smallCircle").setAttribute("cy", "27");
  }
}

// Create a MediaQueryList object
let xxl = window.matchMedia("(max-width: 1038px)");
let xl = window.matchMedia("(max-width: 784px)");
let large = window.matchMedia("(max-width: 624px)");
let medium = window.matchMedia("(max-width: 548px)");
let small = window.matchMedia("(max-width: 454px)");
let xs = window.matchMedia("(max-width: 440px)");

// Call listener function at run time
// to change circle radius
maxXXL(xxl);
maxXLLarge(xl);
maxLarge(large);
maxMedium(medium);
maxSmall(small);
maxXSmall(xs);

document.querySelector("#header-button").addEventListener("mouseenter", () => {
  document.querySelector("#hide-btn").style.animation =
    "btn_anim 0.5s linear forwards";
});

document.querySelector("#header-button").addEventListener("mouseleave", () => {
  document.querySelector("#hide-btn").style.animation =
    "btn_anim_rev 0.5s linear forwards";
});

function blackModalShow() {
  document.querySelector("#black-slider").style.visibility = "visible";
  document.querySelector("#black-slider").style.animation =
    "black_modal_anim 0.5s linear forwards";
}

function showVideo() {
  $("#videoIframe").attr(
    "src",
    "https://player.vimeo.com/video/736431927?app_id=122963?loop=1&amp;title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1"
  );

  document.querySelector("#video-controller").style.visibility = "visible";
  document.querySelector("#video-controller").style.animation =
    "black_modal_anim 0.5s linear forwards";
}

document
  .querySelector("#take-it-btn")
  .addEventListener("click", blackModalShow);

document
  .querySelector("#takeItCursor")
  .addEventListener("click", blackModalShow);

document.querySelector("#play-reel").addEventListener("click", () => {
  showVideo();
});

document.querySelector("#page1-container").addEventListener("click", (e) => {
  if (
    allow &&
    e.srcElement.id !== "openMenu" &&
    e.srcElement.offsetParent.id !== "show-btn" &&
    e.srcElement.className !== "navItem" &&
    e.srcElement.id !== "logo" &&
    e.srcElement.id !== "closeMenu" &&
    e.srcElement.offsetParent.id !== "redDropdown" &&
    e.srcElement.offsetParent.id !== "dropdownUL" &&
    e.srcElement.offsetParent.id !== "header-button" &&
    e.srcElement.offsetParent.id !== "down-show-btn" &&
    e.srcElement.offsetParent.id !== "page1-container" &&
    e.srcElement.id !== "slogan" &&
    e.srcElement.className !== "rotate-icon"
  ) {
    showVideo();
  }
});

document.querySelector("#black-circle").addEventListener("click", () => {
  document.querySelector("#black-slider").style.animation =
    "black_modal_anim_rev 0.5s linear forwards";
});

document.querySelector("#video-off").addEventListener("click", () => {
  $("#videoIframe").attr("src", "");
  document.querySelector("#video-controller").style.animation =
    "black_modal_anim_rev 0.5s linear forwards";
});
