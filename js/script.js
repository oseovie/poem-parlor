/**

 * Poem Parlor — Interactive Experience & Collection Reader

 * Atmospheric Motion & Tactile Interactions

 */



document.addEventListener("DOMContentLoaded", () => {

  const data = window.POEM_PARLOR_DATA;



    /* ==========================================================================
     1. THE WORD DOOR (Gateway to the Five Rooms)
     ========================================================================== */
  const doorShell = document.querySelector(".door-shell");
  const doorTrigger = document.getElementById("doorTrigger");
  const doorCloseBtn = document.getElementById("doorCloseBtn");

  if (doorShell && doorTrigger) {
    function openDoor() {
      doorShell.classList.add("is-open");
      doorTrigger.setAttribute("aria-expanded", "true");
    }

    function closeDoor() {
      doorShell.classList.remove("is-open");
      doorTrigger.setAttribute("aria-expanded", "false");
      doorTrigger.focus();
    }

    doorTrigger.addEventListener("click", () => {
      if (doorShell.classList.contains("is-open")) {
        closeDoor();
      } else {
        openDoor();
      }
    });

    if (doorCloseBtn) {
      doorCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDoor();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && doorShell.classList.contains("is-open")) {
        closeDoor();
      }
    });
  }

  /* ==========================================================================
     2. DYNAMIC POEM READER (poem.html — Book Leaf Experience)

     ========================================================================== */

  const poemPaper = document.getElementById("poemPaper");

  if (poemPaper && data) {

    const params = new URLSearchParams(window.location.search);

    const initialId = params.get("id");

    const referrer = params.get("from");



    function displayPoem(poemId, animateLeaf = false) {

      const poem = data.poems.find((p) => p.id === poemId) || data.poems[0];

      if (!poem) return;



      if (animateLeaf) {

        poemPaper.classList.add("leaf-turning");

      }



      setTimeout(

        () => {

          // Update title

          document.title = `No. ${poem.number} — ${poem.title} | Poem Parlor`;



          // Update header badges

          const secBadge = document.getElementById("readerSectionBadge");

          if (secBadge) {

            secBadge.textContent = `Collection I · Section ${poem.sectionNum}: ${poem.sectionTitle}`;

          }



          const roomBadge = document.getElementById("readerRoomBadge");

          if (roomBadge) {

            roomBadge.innerHTML = `<a href="poems.html#${poem.roomId}-room">The ${poem.roomId.charAt(0).toUpperCase() + poem.roomId.slice(1)} Room</a>`;

          }



          // Update Number Kicker & Title

          const kicker = document.getElementById("readerNumberKicker");

          if (kicker) {

            kicker.textContent = `NO. ${poem.number}`;

          }



          const title = document.getElementById("readerTitle");

          if (title) {

            title.textContent = poem.title;

          }



          // Update Section Epigraph

          const epigraph = document.getElementById("readerEpigraph");

          if (epigraph) {

            epigraph.textContent = `“${poem.sectionEpigraph}”`;

          }



          // Render formatted stanzas

          const body = document.getElementById("readerBody");

          if (body) {

            body.innerHTML = poem.stanzas

              .map((st) => `<p>${st.replace(/\n/g, "<br />")}</p>`)

              .join("");

          }



          // Page Turn Navigation

          const prevLink = document.getElementById("readerPrevLink");

          const nextLink = document.getElementById("readerNextLink");

          const prevTitle = document.getElementById("readerPrevTitle");

          const nextTitle = document.getElementById("readerNextTitle");

          const counter = document.getElementById("readerCounter");



          if (counter) {

            counter.textContent = `Folio ${poem.number} of 11`;

          }



          if (poem.prevId) {

            const prevPoem = data.poems.find((p) => p.id === poem.prevId);

            if (prevLink) {

              prevLink.href = `poem.html?id=${poem.prevId}${referrer ? `&from=${referrer}` : ""}`;

              prevLink.classList.remove("disabled");

            }

            if (prevTitle && prevPoem) {

              prevTitle.textContent = `No. ${prevPoem.number} · ${prevPoem.title}`;

            }

          } else if (prevLink) {

            prevLink.classList.add("disabled");

            prevLink.removeAttribute("href");

            if (prevTitle) prevTitle.textContent = "Start of Collection";

          }



          if (poem.nextId) {

            const nextPoem = data.poems.find((p) => p.id === poem.nextId);

            if (nextLink) {

              nextLink.href = `poem.html?id=${poem.nextId}${referrer ? `&from=${referrer}` : ""}`;

              nextLink.classList.remove("disabled");

            }

            if (nextTitle && nextPoem) {

              nextTitle.textContent = `No. ${nextPoem.number} · ${nextPoem.title}`;

            }

          } else if (nextLink) {

            nextLink.classList.add("disabled");

            nextLink.removeAttribute("href");

            if (nextTitle) nextTitle.textContent = "End of Collection";

          }



          // Return Links

          const returnRoomBtn = document.getElementById("readerReturnRoomBtn");

          if (returnRoomBtn) {

            if (referrer === "gallery") {

              returnRoomBtn.href = `gallery.html#${poem.roomId}`;

              returnRoomBtn.textContent = `Return to Visual Archive`;

            } else {

              returnRoomBtn.href = `poems.html#${poem.roomId}-room`;

              returnRoomBtn.textContent = `Return to ${poem.roomName}`;

            }

          }



          const returnCollectionBtn = document.getElementById("readerReturnCollectionBtn");

          if (returnCollectionBtn) {

            returnCollectionBtn.href = `poems.html#${poem.sectionId}`;

            returnCollectionBtn.textContent = `Return to Section ${poem.sectionNum}`;

          }



          if (animateLeaf) {

            poemPaper.classList.remove("leaf-turning");

            window.scrollTo({ top: poemPaper.offsetTop - 90, behavior: "smooth" });

          }

        },

        animateLeaf ? 220 : 0

      );

    }



    displayPoem(initialId, false);



    // Keyboard navigation (ArrowLeft & ArrowRight to turn pages)

    document.addEventListener("keydown", (e) => {

      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const currentParams = new URLSearchParams(window.location.search);

      const curId = currentParams.get("id") || data.poems[0].id;

      const curPoem = data.poems.find((p) => p.id === curId);

      if (!curPoem) return;



      if (e.key === "ArrowLeft" && curPoem.prevId) {

        history.pushState(null, "", `poem.html?id=${curPoem.prevId}${referrer ? `&from=${referrer}` : ""}`);

        displayPoem(curPoem.prevId, true);

      } else if (e.key === "ArrowRight" && curPoem.nextId) {

        history.pushState(null, "", `poem.html?id=${curPoem.nextId}${referrer ? `&from=${referrer}` : ""}`);

        displayPoem(curPoem.nextId, true);

      }

    });

  }



  /* ==========================================================================

     3. PERSPECTIVE SWITCHER (poems.html: The House vs The Book)

     ========================================================================== */

  const tabRooms = document.getElementById("tabRooms");

  const tabCollection = document.getElementById("tabCollection");

  const viewRooms = document.getElementById("rooms-view");

  const viewCollection = document.getElementById("collection-view");



  if (tabRooms && tabCollection && viewRooms && viewCollection) {

    function switchPerspective(mode) {

      if (mode === "collection") {

        tabCollection.classList.add("active");

        tabCollection.setAttribute("aria-selected", "true");

        tabRooms.classList.remove("active");

        tabRooms.setAttribute("aria-selected", "false");



        viewCollection.classList.add("active");

        viewRooms.classList.remove("active");

      } else {

        tabRooms.classList.add("active");

        tabRooms.setAttribute("aria-selected", "true");

        tabCollection.classList.remove("active");

        tabCollection.setAttribute("aria-selected", "false");



        viewRooms.classList.add("active");

        viewCollection.classList.remove("active");

      }

    }



    tabRooms.addEventListener("click", (e) => {

      e.preventDefault();

      switchPerspective("rooms");

      history.replaceState(null, "", "#rooms-view");

    });



    tabCollection.addEventListener("click", (e) => {

      e.preventDefault();

      switchPerspective("collection");

      history.replaceState(null, "", "#collection-view");

    });



    function checkHash() {

      const hash = window.location.hash.toLowerCase();

      if (

        hash.includes("collection") ||

        hash.includes("things-we-carry") ||

        hash.includes("people-we-lose") ||

        hash.includes("lives-we-almost") ||

        hash.includes("keep-going")

      ) {

        switchPerspective("collection");

        if (hash && hash !== "#collection-view") {

          const target = document.querySelector(hash);

          if (target) {

            setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 120);

          }

        }

      } else if (hash.includes("room")) {

        switchPerspective("rooms");

        const target = document.querySelector(hash);

        if (target) {

          setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 120);

        }

      }

    }



    window.addEventListener("hashchange", checkHash);

    checkHash();

  }



  /* ==========================================================================

     4. VISUAL ARCHIVE FILTER (gallery.html)

     ========================================================================== */

  const archiveFilterBtns = document.querySelectorAll(".archive-filter-btn");

  const archiveCards = document.querySelectorAll(".archive-card");



  if (archiveFilterBtns.length > 0 && archiveCards.length > 0) {

    function filterArchive(filterRoom) {

      archiveFilterBtns.forEach((btn) => {

        const matches = btn.dataset.filter === filterRoom;

        btn.classList.toggle("active", matches);

        btn.setAttribute("aria-selected", matches ? "true" : "false");

      });



      archiveCards.forEach((card) => {

        const room = card.dataset.room;

        if (filterRoom === "all" || room === filterRoom) {

          card.classList.remove("is-hidden");

        } else {

          card.classList.add("is-hidden");

        }

      });

    }



    archiveFilterBtns.forEach((btn) => {

      btn.addEventListener("click", () => {

        const filter = btn.dataset.filter;

        filterArchive(filter);

        if (filter === "all") {

          history.replaceState(null, "", window.location.pathname);

        } else {

          history.replaceState(null, "", `#${filter}`);

        }

      });

    });



    function checkArchiveHash() {

      const hash = window.location.hash.toLowerCase().replace("#", "").replace("-room", "");

      if (["quiet", "memory", "love", "becoming", "light"].includes(hash)) {

        filterArchive(hash);

      } else {

        filterArchive("all");

      }

    }



    window.addEventListener("hashchange", checkArchiveHash);

    checkArchiveHash();

  }





  /* ==========================================================================

     5. ROOM ENTRANCE ANIMATIONS (Scroll-triggered reveals)

     ========================================================================== */

  const roomAnimEls = document.querySelectorAll(".room-animate");



  if (roomAnimEls.length > 0) {

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



    if (prefersReduced) {

      roomAnimEls.forEach((el) => el.classList.add("is-visible"));

    } else {

      const roomObserver = new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("is-visible");

              roomObserver.unobserve(entry.target);

            }

          });

        },

        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }

      );



      roomAnimEls.forEach((el) => roomObserver.observe(el));

    }

  }



});

