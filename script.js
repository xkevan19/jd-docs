/* Table of Contents:
 1. Initialization
 2. Lightbox Functionality
    2.1. Open Lightbox
    2.2. Close Lightbox
 3. Section Management
    3.1. Update UI for Section
    3.2. Update Breadcrumbs
    3.3. Update Next/Previous Navigation
 4. Event Listeners
    4.1. Sidebar Link Click
    4.2. Hamburger Menu Toggle
    4.3. Breadcrumb and Nav Click
 5. Page Initialization
 6. Search Functionality
 --- END --- */

document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Initialization ---
  const sectionData = [
    { id: "introduction", displayName: "Introduction" },
    { id: "user-guide", displayName: "User Guide" },
    { id: "architecture", displayName: "Architecture" },
    { id: "ui-ux", displayName: "UI/UX" },
  ];

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");
  const closeLightbox = document.getElementById("close-lightbox");

  const cards = document.querySelectorAll(".group");

  // --- 2. Lightbox Functionality ---
  // --- 2.1. Open Lightbox ---
  cards.forEach((card) => {
    const video = card.querySelector("video");
    const img = card.querySelector("img");

    if (video || img) {
      card.addEventListener("click", function (e) {
        let target = e.target;
        while (target && target !== card) {
          if (target.tagName === "A") {
            return;
          }
          target = target.parentElement;
        }

        e.preventDefault();

        if (video) {
          const videoSource = video.querySelector("source");
          if (videoSource) {
            const lightboxSource = lightboxVideo.querySelector("source");
            lightboxSource.src = videoSource.src;
            lightboxSource.type = videoSource.type || "video/webm";

            lightboxVideo.load();

            lightboxVideo.classList.remove("hidden");
            lightboxImg.classList.add("hidden");
          }
        } else if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || "Lightbox image";

          lightboxImg.classList.remove("hidden");
          lightboxVideo.classList.add("hidden");
          lightboxVideo.pause();
        }

        lightbox.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      });
    }
  });

  // --- 2.2. Close Lightbox ---
  closeLightbox.addEventListener("click", function () {
    closeLightboxFunction();
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightboxFunction();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightboxFunction();
    }
  });

  function closeLightboxFunction() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
    lightboxVideo.pause();
  }

  // --- 3. Section Management ---
  // --- 3.1. Update UI for Section ---
  function updateUIForSection(targetId) {
    document.querySelectorAll("section[id]").forEach((section) => {
      section.classList.add("hidden");
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove("hidden");
    }

    document.querySelectorAll('aside nav a[href^="#"]').forEach((link) => {
      if (link.getAttribute("href") === "#" + targetId) {
        link.classList.remove(
          "text-neutral-300",
          "hover:bg-neutral-700",
          "hover:text-blue-300"
        );
        link.classList.add("bg-neutral-800", "text-blue-400");

        const svg = link.querySelector("svg");

        if (svg) {
          svg.classList.remove("text-neutral-400", "group-hover:text-blue-400");
          svg.classList.add("text-blue-400");
        }
      } else {
        link.classList.remove(
          "bg-neutral-800",
          "text-blue-400",
          "bg-neutral-700",
          "text-blue-300"
        );
        link.classList.add(
          "text-neutral-300",
          "hover:bg-neutral-700",
          "hover:text-blue-300"
        );

        const svg = link.querySelector("svg");
        if (svg) {
          svg.classList.remove("text-blue-400");
          svg.classList.add("text-neutral-400", "group-hover:text-blue-400");
        }
      }
    });
    updateBreadcrumbs(targetId);
    updateNextPrevNavigation(targetId);
  }

  // --- 3.2. Update Breadcrumbs ---
  function updateBreadcrumbs(targetId) {
    const formatSectionName = (id) => {
      return sectionData.find((section) => section.id === id).displayName;
    };

    const desktopLastBreadcrumb = document.querySelector(
      '.hidden.md\\:flex[aria-label="Breadcrumb"] ol li:last-child a'
    );
    if (desktopLastBreadcrumb) {
      desktopLastBreadcrumb.textContent = formatSectionName(targetId);
      desktopLastBreadcrumb.href = "#" + targetId;
    }

    const mobileLastBreadcrumb = document.querySelector(
      '.md\\:hidden[aria-label="Breadcrumb"] ol li:last-child a'
    );
    if (mobileLastBreadcrumb) {
      mobileLastBreadcrumb.textContent = formatSectionName(targetId);
      mobileLastBreadcrumb.href = "#" + targetId;
    }
  }

  // --- 3.3. Update Next/Previous Navigation ---
  function updateNextPrevNavigation(targetId) {
    const currentIndex = sectionData.findIndex(
      (section) => section.id === targetId
    );

    const prevLink = document.querySelector(
      ".border-t.border-neutral-700 a:first-child"
    );
    const nextLink = document.querySelector(
      ".border-t.border-neutral-700 a:last-child"
    );

    if (currentIndex > 0) {
      const prevSection = sectionData[currentIndex - 1].id;
      const prevSectionName = sectionData[currentIndex - 1].displayName;

      prevLink.href = "#" + prevSection;
      prevLink.innerHTML = `
                <svg class="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous: ${prevSectionName}
            `;
      prevLink.classList.remove("opacity-0");
    } else {
      prevLink.classList.add("opacity-0");
    }

    if (currentIndex < sectionData.length - 1) {
      const nextSection = sectionData[currentIndex + 1].id;
      const nextSectionName = sectionData[currentIndex + 1].displayName;

      nextLink.href = "#" + nextSection;
      nextLink.innerHTML = `
                Next: ${nextSectionName}
                <svg class="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            `;
      nextLink.classList.remove("opacity-0");
    } else {
      nextLink.classList.add("opacity-0");
    }

    prevLink.style.display = currentIndex > 0 ? "inline-flex" : "none";
    nextLink.style.display =
      currentIndex < sectionData.length - 1 ? "inline-flex" : "none";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // --- 4. Event Listeners ---
  // --- 4.1. Sidebar Link Click ---
  const sidebarLinks = document.querySelectorAll('aside nav a[href^="#"]');
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      // Reload and then go to section
      window.location.href = "#" + targetId;
      window.location.reload();
    });
  });

  // --- 4.2. Hamburger Menu Toggle ---
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // --- 4.3. Breadcrumb and Nav Click ---
  function addNavigationListeners(selector) {
    document.querySelectorAll(selector).forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        window.location.href = "#" + targetId;
        window.location.reload();
      });
    });
  }
  addNavigationListeners('nav a[href^="#"]');
  addNavigationListeners('.hidden.md\\:flex[aria-label="Breadcrumb"] ol li a');
  addNavigationListeners('.md\\:hidden[aria-label="Breadcrumb"] ol li a');
  addNavigationListeners(".border-t.border-neutral-700 a");

  // --- 5. Page Initialization ---
  function initializePage() {
    let targetId = window.location.hash.substring(1);
    if (!targetId || !sectionData.some((section) => section.id === targetId)) {
      targetId = "introduction";
    }
    updateUIForSection(targetId);
  }
  initializePage();
  window.addEventListener("hashchange", initializePage);

  // --- 6. Search Functionality ---
  const searchInput = document.getElementById("search");
  if (searchInput) {
    const contentSections = document.querySelectorAll("section[id]");
    const searchableElements = document.querySelectorAll(".searchable");
    let searchTimeout = null;
    let searchIndex = [];
    let searchHistory = JSON.parse(
      localStorage.getItem("docSearchHistory") || "[]"
    );
    let searchWorker;

    // Initialize Web Worker for search operations
    function initSearchWorker() {
      const workerBlob = new Blob(
        [
          `
      // Search worker
      let searchIndex = [];
      
      // Stemming function (Porter Algorithm simplified)
      function stemWord(word) {
        if (word.length < 3) return word;
        
        // Handle basic plurals and -ed, -ing endings
        if (word.endsWith('ies') && word.length > 4) {
          return word.slice(0, -3) + 'y';
        } else if (word.endsWith('es') && word.length > 3) {
          return word.slice(0, -2);
        } else if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) {
          return word.slice(0, -1);
        } else if (word.endsWith('ing') && word.length > 5) {
          return word.slice(0, -3);
        } else if (word.endsWith('ed') && word.length > 4) {
          return word.slice(0, -2);
        }
        
        return word;
      }
      
      // Tokenize text into words and apply stemming
      function tokenize(text) {
        const words = text.toLowerCase().split(/\\W+/).filter(word => word.length > 1);
        return words.map(word => stemWord(word));
      }
      
      // Calculate word proximity score
      function calculateProximityScore(text, searchTerms) {
        const words = text.toLowerCase().split(/\\W+/);
        let minDistance = Infinity;
        
        // If only one search term, proximity is perfect
        if (searchTerms.length <= 1) return 100;
        
        // Find positions of search terms
        const positions = {};
        searchTerms.forEach(term => {
          positions[term] = [];
        });
        
        words.forEach((word, index) => {
          searchTerms.forEach(term => {
            if (word.includes(term) || stemWord(word).includes(term)) {
              positions[term].push(index);
            }
          });
        });
        
        // Calculate minimum distance between terms
        for (let i = 0; i < searchTerms.length - 1; i++) {
          const pos1 = positions[searchTerms[i]];
          if (!pos1.length) continue;
          
          for (let j = i + 1; j < searchTerms.length; j++) {
            const pos2 = positions[searchTerms[j]];
            if (!pos2.length) continue;
            
            for (let a = 0; a < pos1.length; a++) {
              for (let b = 0; b < pos2.length; b++) {
                const distance = Math.abs(pos1[a] - pos2[b]);
                minDistance = Math.min(minDistance, distance);
              }
            }
          }
        }
        
        // Convert distance to score (closer = higher score)
        if (minDistance === Infinity) return 0;
        return Math.max(0, 100 - (minDistance * 5));
      }
      
      // Perform search with all improvements
      function performSearch(query, isExact, isOR) {
        const results = [];
        
        // Handle exact phrase search
        if (isExact) {
          const exactPhrase = query.toLowerCase();
          
          searchIndex.forEach(item => {
            if (item.content.includes(exactPhrase)) {
              results.push({
                ...item,
                score: 100 * item.weight,
                exact: true,
                highlight: findExactPhraseContext(item.content, exactPhrase)
              });
            }
          });
          
          return results;
        }
        
        // Handle normal search with boolean logic
        const searchTerms = query.toLowerCase().trim().split(/\\s+/);
        const negatedTerms = searchTerms.filter(term => term.startsWith('-')).map(term => term.substring(1));
        const positiveTerms = searchTerms.filter(term => !term.startsWith('-'));
        
        // If no positive terms, return empty results
        if (positiveTerms.length === 0 && negatedTerms.length > 0) {
          return [];
        }
        
        const stemmedPositiveTerms = positiveTerms.map(term => stemWord(term));
        
        searchIndex.forEach(item => {
          // Skip if any negated term is present
          for (const term of negatedTerms) {
            if (item.content.includes(term) || item.tokens.includes(stemWord(term))) {
              return;
            }
          }
          
          let matchCount = 0;
          let score = 0;
          
          // Check each positive term
          for (const termIndex in stemmedPositiveTerms) {
            const term = positiveTerms[termIndex];
            const stemmedTerm = stemmedPositiveTerms[termIndex];
            
            // Check if the term is present (original or stemmed)
            const originalMatch = item.content.includes(term);
            const stemmedMatch = item.tokens.includes(stemmedTerm);
            
            if (originalMatch || stemmedMatch) {
              matchCount++;
              // Original matches get higher score than stemmed matches
              score += originalMatch ? 10 : 5;
              
              // Title matches get bonus points
              if (item.title.toLowerCase().includes(term)) {
                score += 30;
              }
              
              // Header matches get bonus points
              if (item.headerContent && item.headerContent.toLowerCase().includes(term)) {
                score += 20;
              }
              
              // Code block matches get bonus points
              if (item.isCode) {
                score += 15;
              }
            }
          }
          
          // For OR search, any match is valid
          // For AND search (default), all terms must match
          if ((isOR && matchCount > 0) || (!isOR && matchCount === positiveTerms.length)) {
            // Add proximity score for multi-term searches
            if (positiveTerms.length > 1) {
              score += calculateProximityScore(item.content, positiveTerms);
            }
            
            // Apply element weight
            score *= item.weight;
            
            // Add to results
            results.push({
              ...item,
              score: score,
              exact: false,
              highlight: findBestMatchContext(item.content, positiveTerms)
            });
          }
        });
        
        return results;
      }
      
      // Find best context for highlighting (used for non-exact matches)
      function findBestMatchContext(content, terms) {
        const MAX_EXCERPT_LENGTH = 200;
        const contexts = [];
        
        // Find occurrences of each term
        terms.forEach(term => {
          let startIndex = 0;
          while ((startIndex = content.toLowerCase().indexOf(term, startIndex)) !== -1) {
            // Get surrounding text
            const contextStart = Math.max(0, startIndex - 50);
            const contextEnd = Math.min(content.length, startIndex + term.length + 50);
            const context = content.substring(contextStart, contextEnd);
            
            contexts.push({
              text: context,
              position: contextStart,
              term: term
            });
            
            startIndex += term.length;
          }
        });
        
        // If no direct matches found (stemmed matches), return beginning
        if (contexts.length === 0) {
          return [{
            text: content.substring(0, MAX_EXCERPT_LENGTH) + (content.length > MAX_EXCERPT_LENGTH ? '...' : ''),
            position: 0,
            term: ''
          }];
        }
        
        // Sort by position (to get coherent excerpts)
        contexts.sort((a, b) => a.position - b.position);
        
        // Merge overlapping contexts
        const mergedContexts = [];
        let currentContext = contexts[0];
        
        for (let i = 1; i < contexts.length; i++) {
          const nextContext = contexts[i];
          
          // If contexts overlap or are close, merge them
          if (nextContext.position <= currentContext.position + currentContext.text.length + 20) {
            const mergedEnd = nextContext.position + nextContext.text.length - currentContext.position;
            if (mergedEnd > currentContext.text.length) {
              currentContext.text = content.substring(
                currentContext.position, 
                nextContext.position + nextContext.text.length
              );
            }
            // Add the term for highlighting
            if (!currentContext.terms) currentContext.terms = [currentContext.term];
            currentContext.terms.push(nextContext.term);
            delete currentContext.term;
          } else {
            // If current context has a single term, convert to array
            if (currentContext.term && !currentContext.terms) {
              currentContext.terms = [currentContext.term];
              delete currentContext.term;
            }
            
            mergedContexts.push(currentContext);
            currentContext = nextContext;
          }
        }
        
        // Add the last context
        if (currentContext.term && !currentContext.terms) {
          currentContext.terms = [currentContext.term];
          delete currentContext.term;
        }
        mergedContexts.push(currentContext);
        
        // Limit to beginning, middle, end of document to show different parts
        let selectedContexts = [];
        if (mergedContexts.length === 1) {
          selectedContexts = mergedContexts;
        } else if (mergedContexts.length === 2) {
          selectedContexts = mergedContexts;
        } else {
          // Get beginning, middle and end contexts
          selectedContexts = [
            mergedContexts[0],
            mergedContexts[Math.floor(mergedContexts.length / 2)],
            mergedContexts[mergedContexts.length - 1]
          ];
        }
        
        // Format contexts for display with ellipsis
        return selectedContexts.map(context => {
          let excerpt = context.text;
          
          // Add ellipsis
          if (context.position > 0) excerpt = '...' + excerpt;
          if (context.position + excerpt.length < content.length) excerpt = excerpt + '...';
          
          return {
            text: excerpt,
            terms: context.terms
          };
        });
      }
      
      // Find context for exact phrase matches
      function findExactPhraseContext(content, phrase) {
        const MAX_EXCERPT_LENGTH = 200;
        const phraseIndex = content.toLowerCase().indexOf(phrase);
        
        if (phraseIndex === -1) return [];
        
        // Get surrounding text
        const contextStart = Math.max(0, phraseIndex - 50);
        const contextEnd = Math.min(content.length, phraseIndex + phrase.length + 50);
        let context = content.substring(contextStart, contextEnd);
        
        // Add ellipsis
        if (contextStart > 0) context = '...' + context;
        if (contextEnd < content.length) context = context + '...';
        
        return [{
          text: context,
          exactPhrase: phrase
        }];
      }
      
      // Message handler
      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch (type) {
          case 'setIndex':
            searchIndex = data;
            self.postMessage({ type: 'indexReady' });
            break;
            
          case 'search':
            const { query, isExact, isOR } = data;
            const results = performSearch(query, isExact, isOR);
            
            // Sort results by score (highest first)
            results.sort((a, b) => b.score - a.score);
            
            self.postMessage({ 
              type: 'searchResults', 
              data: {
                results: results,
                query: query
              }
            });
            break;
        }
      };
    `,
        ],
        { type: "application/javascript" }
      );

      const workerUrl = URL.createObjectURL(workerBlob);
      searchWorker = new Worker(workerUrl);

      // Clean up the URL object
      URL.revokeObjectURL(workerUrl);

      searchWorker.onmessage = function (e) {
        const { type, data } = e.data;

        if (type === "searchResults") {
          displaySearchResults(data.results, data.query);
        } else if (type === "indexReady") {
          console.log("Search index loaded in worker");
        }
      };
    }

    let searchResultsContainer = document.getElementById(
      "search-results-container"
    );
    if (!searchResultsContainer) {
      searchResultsContainer = document.createElement("div");
      searchResultsContainer.id = "search-results-container";
      searchResultsContainer.className =
        "search-results hidden p-4 mt-8 rounded-lg shadow-md bg-neutral-800 dark:border dark:border-neutral-700";
      searchResultsContainer.setAttribute("role", "region");
      searchResultsContainer.setAttribute("aria-live", "polite");
      searchResultsContainer.setAttribute("aria-label", "Search results");

      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.prepend(searchResultsContainer);
      }
    }

    // Create filter container
    const filterContainer = document.createElement("div");
    filterContainer.id = "search-filters";
    filterContainer.className =
      "search-filters hidden mt-16 mb-4 p-2 bg-neutral-700 rounded flex flex-wrap gap-2 items-center";
    searchResultsContainer.parentNode.insertBefore(
      filterContainer,
      searchResultsContainer
    );

    // Add section filter
    const sectionFilter = document.createElement("select");
    sectionFilter.id = "section-filter";
    sectionFilter.className =
      "bg-neutral-600 text-neutral-200 rounded px-2 py-1 text-sm";
    sectionFilter.innerHTML = '<option value="">All Sections</option>';

    // Add content type filter
    const typeFilter = document.createElement("select");
    typeFilter.id = "type-filter";
    typeFilter.className =
      "bg-neutral-600 text-neutral-200 rounded px-2 py-1 text-sm";
    typeFilter.innerHTML = `
    <option value="">All Content Types</option>
    <option value="text">Text Content</option>
    <option value="code">Code Examples</option>
    <option value="heading">Headings</option>
  `;

    // Add filter labels
    const sectionLabel = document.createElement("label");
    sectionLabel.htmlFor = "section-filter";
    sectionLabel.className = "text-neutral-300 text-sm";
    sectionLabel.textContent = "Filter by section:";

    const typeLabel = document.createElement("label");
    typeLabel.htmlFor = "type-filter";
    typeLabel.className = "text-neutral-300 text-sm";
    typeLabel.textContent = "Filter by type:";

    // Add search options toggle
    const searchOptions = document.createElement("div");
    searchOptions.className = "search-options flex items-center gap-2 ml-auto";

    const orSearchLabel = document.createElement("label");
    orSearchLabel.className =
      "flex items-center gap-1 text-sm text-neutral-300";
    orSearchLabel.innerHTML = `
    <input type="checkbox" id="or-search" class="accent-blue-500">
    <span>OR search</span>
  `;

    searchOptions.appendChild(orSearchLabel);

    // Add filters to container
    filterContainer.appendChild(sectionLabel);
    filterContainer.appendChild(sectionFilter);
    filterContainer.appendChild(typeLabel);
    filterContainer.appendChild(typeFilter);
    filterContainer.appendChild(searchOptions);

    // Add autocomplete container
    const autocompleteContainer = document.createElement("div");
    autocompleteContainer.id = "search-autocomplete";
    autocompleteContainer.className =
      "search-autocomplete absolute z-10 w-full mt-1 rounded-md bg-neutral-800 shadow-lg hidden";
    searchInput.parentElement.style.position = "relative";
    searchInput.parentElement.appendChild(autocompleteContainer);

    // Create loading indicator with improved animation
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className =
      "search-loading hidden absolute right-10 top-1/2 transform -translate-y-1/2";
    loadingIndicator.innerHTML = `
    <div class="flex items-center gap-1">
      <div class="animate-pulse bg-blue-500 h-1 w-2 rounded-full"></div>
      <div class="animate-pulse bg-blue-500 h-1 w-2 rounded-full" style="animation-delay: 0.2s"></div>
      <div class="animate-pulse bg-blue-500 h-1 w-2 rounded-full" style="animation-delay: 0.4s"></div>
    </div>
  `;
    searchInput.parentElement.appendChild(loadingIndicator);

    // Create search history button
    const historyButton = document.createElement("button");
    historyButton.className =
      "search-history-button absolute right-12 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300";
    historyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `;
    historyButton.setAttribute("aria-label", "Show search history");
    searchInput.parentElement.appendChild(historyButton);

    // Create search history dropdown
    const historyDropdown = document.createElement("div");
    historyDropdown.className =
      "search-history-dropdown absolute z-10 w-full mt-1 rounded-md bg-neutral-800 shadow-lg hidden";
    historyDropdown.setAttribute("role", "listbox");
    historyDropdown.setAttribute("aria-label", "Search history");
    searchInput.parentElement.appendChild(historyDropdown);

    // Build search index on page load with content type detection
    function buildSearchIndex() {
      searchIndex = [];

      // Populate section filter
      contentSections.forEach((section) => {
        const sectionTitle =
          section.querySelector("h2, h3")?.textContent || "Untitled Section";
        const option = document.createElement("option");
        option.value = section.id;
        option.textContent = sectionTitle;
        sectionFilter.appendChild(option);
      });

      // Index all searchable elements
      searchableElements.forEach((element) => {
        let parentSection = element.closest("section[id]");
        let sectionId = parentSection ? parentSection.id : "";
        let sectionTitle = parentSection
          ? parentSection.querySelector("h2, h3")?.textContent ||
            "Untitled Section"
          : "Untitled Section";

        // Determine content type and weight
        let weight = 1.0;
        let isCode = false;
        let isHeading = false;
        let headerContent = "";

        if (element.tagName.match(/^H[1-6]$/)) {
          weight = 3.0;
          isHeading = true;
        } else if (element.tagName === "PRE" || element.querySelector("code")) {
          weight = 1.5;
          isCode = true;
        } else if (element.classList.contains("important")) {
          weight = 2.0;
        }

        if (!isHeading) {
          const closestHeading = element
            .closest("section")
            .querySelector("h1, h2, h3, h4, h5, h6");
          if (closestHeading) {
            headerContent = closestHeading.textContent;
          }
        }

        // Tokenize the content for stemming
        const content = element.textContent.toLowerCase();
        const tokens = [];

        // Split by non-word characters and filter out short words
        content.split(/\W+/).forEach((word) => {
          if (word.length > 1) {
            let stemmed = word;

            // Handle basic plurals and verb forms
            if (word.endsWith("ies") && word.length > 4) {
              stemmed = word.slice(0, -3) + "y";
            } else if (word.endsWith("es") && word.length > 3) {
              stemmed = word.slice(0, -2);
            } else if (
              word.endsWith("s") &&
              !word.endsWith("ss") &&
              word.length > 3
            ) {
              stemmed = word.slice(0, -1);
            } else if (word.endsWith("ing") && word.length > 5) {
              stemmed = word.slice(0, -3);
            } else if (word.endsWith("ed") && word.length > 4) {
              stemmed = word.slice(0, -2);
            }

            tokens.push(stemmed);
          }
        });

        // Index the text content
        searchIndex.push({
          element: element,
          content: content,
          tokens: tokens,
          sectionId: sectionId,
          sectionTitle: sectionTitle,
          weight: weight,
          isCode: isCode,
          isHeading: isHeading,
          headerContent: headerContent,
          title: element.getAttribute("title") || "",
        });
      });

      // Initialize worker and send index
      initSearchWorker();
      searchWorker.postMessage({
        type: "setIndex",
        data: searchIndex.map((item) => {
          const { element, ...rest } = item;
          return rest;
        }),
      });
    }

    // Initialize the search index
    buildSearchIndex();

    // Function to generate search suggestions
    function generateSuggestions(input) {
      if (!input || input.length < 2) {
        autocompleteContainer.innerHTML = "";
        autocompleteContainer.classList.add("hidden");
        return;
      }

      // Find common words in the index that match the input
      const inputLower = input.toLowerCase();
      const suggestions = new Set();
      const maxSuggestions = 5;

      // Extract words from search index
      searchIndex.forEach((item) => {
        const words = item.content.toLowerCase().split(/\W+/);
        words.forEach((word) => {
          if (
            word.length > 3 &&
            word.startsWith(inputLower) &&
            word !== inputLower
          ) {
            suggestions.add(word);
          }
        });
      });

      searchHistory.forEach((historic) => {
        if (
          historic.toLowerCase().includes(inputLower) &&
          historic.toLowerCase() !== inputLower
        ) {
          suggestions.add(historic);
        }
      });

      autocompleteContainer.innerHTML = "";

      if (suggestions.size > 0) {
        autocompleteContainer.classList.remove("hidden");

        // Convert to array and limit
        const suggestionsArray = Array.from(suggestions).slice(
          0,
          maxSuggestions
        );

        // Create suggestion elements
        suggestionsArray.forEach((suggestion) => {
          const suggestionItem = document.createElement("div");
          suggestionItem.className =
            "search-suggestion px-3 py-2 hover:bg-neutral-700 cursor-pointer text-neutral-300";
          suggestionItem.textContent = suggestion;
          suggestionItem.setAttribute("role", "option");
          suggestionItem.setAttribute("tabindex", "0");

          suggestionItem.addEventListener("click", () => {
            searchInput.value = suggestion;
            autocompleteContainer.classList.add("hidden");
            performSearch(suggestion);
          });

          // Keyboard navigation
          suggestionItem.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              searchInput.value = suggestion;
              autocompleteContainer.classList.add("hidden");
              performSearch(suggestion);
            }
          });

          autocompleteContainer.appendChild(suggestionItem);
        });
      } else {
        autocompleteContainer.classList.add("hidden");
      }
    }

    // Update search history
    function updateSearchHistory(query) {
      if (!query || query.length < 3) return;

      const index = searchHistory.indexOf(query);
      if (index > -1) {
        searchHistory.splice(index, 1);
      }

      searchHistory.unshift(query);
      if (searchHistory.length > 10) {
        searchHistory.pop();
      }

      // Save to localStorage
      localStorage.setItem("docSearchHistory", JSON.stringify(searchHistory));
    }

    // Display search history
    function showSearchHistory() {
      historyDropdown.innerHTML = "";

      if (searchHistory.length === 0) {
        const noHistory = document.createElement("div");
        noHistory.className = "px-3 py-2 text-neutral-500 text-sm";
        noHistory.textContent = "No search history";
        historyDropdown.appendChild(noHistory);
      } else {
        // Add clear history option
        const clearHistoryItem = document.createElement("div");
        clearHistoryItem.className =
          "px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-700 cursor-pointer border-b border-neutral-700";
        clearHistoryItem.textContent = "Clear search history";
        clearHistoryItem.addEventListener("click", () => {
          searchHistory = [];
          localStorage.removeItem("docSearchHistory");
          historyDropdown.classList.add("hidden");
        });
        historyDropdown.appendChild(clearHistoryItem);

        // Add history items
        searchHistory.forEach((query) => {
          const historyItem = document.createElement("div");
          historyItem.className =
            "search-history-item px-3 py-2 hover:bg-neutral-700 cursor-pointer text-neutral-300 flex items-center";

          historyItem.innerHTML = `
          <svg class="mr-2 text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${query}</span>
        `;

          historyItem.setAttribute("role", "option");
          historyItem.setAttribute("tabindex", "0");

          historyItem.addEventListener("click", () => {
            searchInput.value = query;
            historyDropdown.classList.add("hidden");
            performSearch(query);
          });

          historyDropdown.appendChild(historyItem);
        });
      }

      historyDropdown.classList.remove("hidden");
    }

    // Function to display search results
    function displaySearchResults(results, searchTerm) {
      if (searchTerm === "") {
        initializePage();

        document.querySelectorAll(".search-highlight").forEach((el) => {
          el.outerHTML = el.innerHTML;
        });

        searchResultsContainer.classList.add("hidden");
        filterContainer.classList.add("hidden");

        contentSections.forEach((section) => {
          section.classList.remove("hidden");
        });

        return;
      }

      updateSearchHistory(searchTerm);

      searchResultsContainer.innerHTML = "";
      searchResultsContainer.classList.remove("hidden");
      filterContainer.classList.remove("hidden");

      // Apply any active filters
      const sectionFilterValue = sectionFilter.value;
      const typeFilterValue = typeFilter.value;

      const filteredResults = results.filter((result) => {
        if (sectionFilterValue && result.sectionId !== sectionFilterValue) {
          return false;
        }

        if (typeFilterValue) {
          if (typeFilterValue === "code" && !result.isCode) return false;
          if (typeFilterValue === "heading" && !result.isHeading) return false;
          if (typeFilterValue === "text" && (result.isCode || result.isHeading))
            return false;
        }

        return true;
      });

      // Add search results heading with count
      const resultsHeading = document.createElement("h2");
      resultsHeading.className =
        "text-xl font-bold mb-4 text-neutral-200 flex justify-between items-center";
      resultsHeading.id = "search-results-heading";

      const resultsCount = filteredResults.length;
      resultsHeading.innerHTML = `
      <span>
        <span class="search-results-count">${resultsCount}</span> 
        result${resultsCount !== 1 ? "s" : ""} for "${searchTerm}"
      </span>
    `;

      // Add ARIA announcement for screen readers
      const srAnnouncement = document.createElement("div");
      srAnnouncement.className = "sr-only";
      srAnnouncement.setAttribute("aria-live", "polite");
      srAnnouncement.textContent = `${resultsCount} search results found for ${searchTerm}.`;
      resultsHeading.appendChild(srAnnouncement);

      searchResultsContainer.appendChild(resultsHeading);

      // Hide all sections for clean search results view
      contentSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // Reset previous highlights
      document.querySelectorAll(".search-highlight").forEach((el) => {
        el.outerHTML = el.innerHTML;
      });

      // Display search results
      if (filteredResults.length > 0) {
        const resultsList = document.createElement("div");
        resultsList.className = "search-results-list";
        resultsList.setAttribute("role", "list");
        resultsList.setAttribute("aria-labelledby", "search-results-heading");

        // --- Pagination ---
        const resultsPerPage = 10;
        let currentPage = 1;

        function displayPage(page) {
          const start = (page - 1) * resultsPerPage;
          const end = start + resultsPerPage;
          const pageResults = filteredResults.slice(start, end);

          resultsList.innerHTML = "";

          pageResults.forEach((result) => {
            const resultItem = document.createElement("div");
            resultItem.className =
              "search-result-item p-4 mb-4 rounded-lg border border-neutral-700 hover:bg-neutral-700/50 cursor-pointer";
            resultItem.setAttribute("role", "listitem");
            resultItem.setAttribute("tabindex", "0");

            const link = document.createElement("a");
            link.href = `#${result.sectionId}`;
            link.className = "text-blue-400 hover:underline";
            link.textContent = result.sectionTitle;

            // Add a more specific aria-label for the link
            link.setAttribute(
              "aria-label",
              `Go to section: ${result.sectionTitle}`
            );

            if (result.title) {
              const title = document.createElement("h3");
              title.className = "text-lg font-semibold text-neutral-200 mt-1";
              title.textContent = result.title;
              resultItem.appendChild(title);
            }

            const excerpt = document.createElement("div");
            excerpt.className = "text-neutral-300 mt-2";

            if (result.exact && result.highlight.length) {
              excerpt.innerHTML = result.highlight[0].text.replace(
                new RegExp(result.highlight[0].exactPhrase, "gi"),
                `<mark class="search-highlight bg-yellow-500/70">$&</mark>`
              );
            } else if (result.highlight && result.highlight.length) {
              result.highlight.forEach((h) => {
                const excerptPart = document.createElement("p");
                excerptPart.className = "mb-2";
                let highlightedText = h.text;

                // Sort terms by length
                const sortedTerms = h.terms.sort((a, b) => b.length - a.length);
                sortedTerms.forEach((term) => {
                  highlightedText = highlightedText.replace(
                    new RegExp(
                      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                      "gi"
                    ), // Escape regex chars
                    `<mark class="search-highlight bg-yellow-500/70">$&</mark>`
                  );
                });
                excerptPart.innerHTML = highlightedText;
                excerpt.appendChild(excerptPart);
              });
            } else {
              excerpt.textContent =
                result.content.substring(0, 200) +
                (result.content.length > 200 ? "..." : "");
            }

            resultItem.appendChild(link);
            resultItem.appendChild(excerpt);

            resultItem.addEventListener("focus", () => {
              resultItem.classList.add("ring-2", "ring-blue-500");
            });
            resultItem.addEventListener("blur", () => {
              resultItem.classList.remove("ring-2", "ring-blue-500");
            });

            // Navigate to section on Enter/Space
            resultItem.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                window.location.hash = `#${result.sectionId}`;
                const targetSection = document.getElementById(result.sectionId);
                if (targetSection) {
                  targetSection.classList.add("ring-2", "ring-blue-500");
                  setTimeout(() => {
                    targetSection.classList.remove("ring-2", "ring-blue-500");
                  }, 2000);
                }
              }
            });

            // Handle clicks to navigate and highlight
            resultItem.addEventListener("click", () => {
              window.location.hash = `#${result.sectionId}`;
              const targetSection = document.getElementById(result.sectionId);
              if (targetSection) {
                targetSection.classList.add("ring-2", "ring-blue-500");
                setTimeout(() => {
                  targetSection.classList.remove("ring-2", "ring-blue-500");
                }, 2000);
              }
            });

            resultsList.appendChild(resultItem);
          });
        }

        displayPage(currentPage);

        // --- Pagination Controls ---
        function createPaginationControls() {
          const paginationContainer = document.createElement("div");
          paginationContainer.className =
            "search-pagination flex justify-center m-4";

          const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

          const prevButton = document.createElement("button");
          prevButton.textContent = "Previous";
          prevButton.className =
            "px-4 py-2 rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed";
          prevButton.disabled = currentPage === 1;
          prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
              currentPage--;
              displayPage(currentPage);
              updatePaginationControls();
            }
          });
          prevButton.setAttribute("aria-label", "Previous page");

          paginationContainer.appendChild(prevButton);

          for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.className = `px-4 py-2 mx-1 rounded ${
              i === currentPage
                ? "bg-blue-500 text-white"
                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
            }`;
            pageButton.addEventListener("click", () => {
              currentPage = i;
              displayPage(currentPage);
              updatePaginationControls();
            });
            pageButton.setAttribute("aria-label", `Page ${i}`);

            paginationContainer.appendChild(pageButton);
          }

          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.className =
            "px-4 py-2 rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed";
          nextButton.disabled = currentPage === totalPages;
          nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
              currentPage++;
              displayPage(currentPage);
              updatePaginationControls();
            }
          });
          nextButton.setAttribute("aria-label", "Next page");

          paginationContainer.appendChild(nextButton);
          searchResultsContainer.appendChild(paginationContainer);

          function updatePaginationControls() {
            paginationContainer.innerHTML = "";

            prevButton.disabled = currentPage === 1;
            paginationContainer.appendChild(prevButton);

            // Page Numbers - show current, prev, next, first and last, and ellipses
            const pageNumbers = [];
            const maxPagesToShow = 5;

            if (totalPages <= maxPagesToShow) {
              for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
              }
            } else {
              // Show first, last, current, and immediate neighbors
              pageNumbers.push(1);

              if (currentPage > 3) {
                pageNumbers.push("...");
              }

              const startPage = Math.max(2, currentPage - 1);
              const endPage = Math.min(totalPages - 1, currentPage + 1);

              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
              }

              if (currentPage < totalPages - 2) {
                pageNumbers.push("...");
              }
              pageNumbers.push(totalPages);
            }

            for (const pageNum of pageNumbers) {
              if (pageNum === "...") {
                const ellipsis = document.createElement("span");
                ellipsis.textContent = "...";
                ellipsis.className = "px-4 py-2 mx-1 text-neutral-400";
                paginationContainer.appendChild(ellipsis);
              } else {
                const pageButton = document.createElement("button");
                pageButton.textContent = pageNum;
                pageButton.className = `px-4 py-2 mx-1 rounded ${
                  pageNum === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                }`;
                pageButton.addEventListener("click", () => {
                  currentPage = pageNum;
                  displayPage(currentPage);
                  updatePaginationControls();
                });
                pageButton.setAttribute("aria-label", `Page ${pageNum}`);
                paginationContainer.appendChild(pageButton);
              }
            }

            nextButton.disabled = currentPage === totalPages;
            paginationContainer.appendChild(nextButton);
          }
        }

        createPaginationControls();
        searchResultsContainer.appendChild(resultsList);
      } else {
        const noResults = document.createElement("div");
        noResults.className = "text-neutral-400 p-4";
        noResults.textContent = "No results found.";
        searchResultsContainer.appendChild(noResults);
      }

      loadingIndicator.classList.add("hidden");
    }

    // Function to perform search
    function performSearch(query) {
      loadingIndicator.classList.remove("hidden");
      const isExact = query.startsWith('"') && query.endsWith('"');
      const isOR = document.getElementById("or-search").checked;

      if (isExact) {
        query = query.slice(1, -1);
      }

      searchWorker.postMessage({
        type: "search",
        data: {
          query: query,
          isExact: isExact,
          isOR: isOR,
        },
      });
    }

    function initializePage() {
      contentSections.forEach((section) => {
        section.classList.remove("hidden");
      });
      searchResultsContainer.classList.add("hidden");
      filterContainer.classList.add("hidden");
      autocompleteContainer.classList.add("hidden");
    }

    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      const query = searchInput.value.trim();

      if (query.length === 0) {
        initializePage();
        return;
      }

      searchTimeout = setTimeout(() => {
        generateSuggestions(query);
        performSearch(query);
      }, 250);
    });

    sectionFilter.addEventListener("change", () => {
      performSearch(searchInput.value.trim());
    });
    typeFilter.addEventListener("change", () => {
      performSearch(searchInput.value.trim());
    });

    document.getElementById("or-search").addEventListener("change", () => {
      performSearch(searchInput.value.trim());
    });

    historyButton.addEventListener("click", (e) => {
      e.stopPropagation();
      showSearchHistory();
    });

    document.addEventListener("click", (e) => {
      if (
        !historyDropdown.contains(e.target) &&
        !historyButton.contains(e.target)
      ) {
        historyDropdown.classList.add("hidden");
      }
    });

    historyDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    if (searchInput.form) {
      searchInput.form.addEventListener("submit", (e) => {
        e.preventDefault();
        performSearch(searchInput.value.trim());
      });
    }

    document.addEventListener("click", (e) => {
      if (
        !autocompleteContainer.contains(e.target) &&
        e.target !== searchInput
      ) {
        autocompleteContainer.classList.add("hidden");
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      const suggestions =
        autocompleteContainer.querySelectorAll(".search-suggestion");
      let currentFocus = -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        suggestions.forEach((suggestion, index) => {
          if (suggestion === document.activeElement) {
            currentFocus = index;
          }
        });

        currentFocus = (currentFocus + 1) % suggestions.length;
        if (suggestions[currentFocus]) {
          suggestions[currentFocus].focus();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        suggestions.forEach((suggestion, index) => {
          if (suggestion === document.activeElement) {
            currentFocus = index;
          }
        });
        currentFocus =
          (currentFocus - 1 + suggestions.length) % suggestions.length;
        if (suggestions[currentFocus]) {
          suggestions[currentFocus].focus();
        }
      } else if (e.key === "Escape") {
        autocompleteContainer.classList.add("hidden");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".prototype-item").forEach((item) => {
    const card = item.querySelector(".prototype-card");
    const helpers = item.querySelectorAll(".helper-widget");

    item.addEventListener("mouseenter", () => {
      helpers.forEach((helper) => {
        const line = helper.querySelector(".helper-line");
        setTimeout(() => {
          if (line) line.style.width = "24px";
        }, 100);
      });
    });

    item.addEventListener("mouseleave", () => {
      helpers.forEach((helper) => {
        const line = helper.querySelector(".helper-line");
        if (line) line.style.width = "10px";
      });
    });

    // Create parallax effect on cards
    item.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      card.style.transform = `translateY(-10px) rotateY(${
        deltaX * 5
      }deg) rotateX(${-deltaY * 5}deg)`;
    });

    item.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".prototype-card").forEach((card) => {
    observer.observe(card);
  });
});
