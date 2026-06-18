(function () {
  // --- DOM elements
  const utilityBar = document.querySelector(".nav-utility");
  const mainHeader = document.querySelector(".nav-main-header");
  const osbRow = document.querySelector(".nav-osb");
  const bodyEl = document.body;

  // --- Helper: update sticky state based on exact combined height of top sections
  function updateSticky() {
    if (!mainHeader || !osbRow) return;

    // Force Chrome to recalculate layout
    const utilityHeight = utilityBar ? utilityBar.getBoundingClientRect().height : 0;
    const mainHeaderHeight = mainHeader.getBoundingClientRect().height;
    const totalTopHeight = utilityHeight + mainHeaderHeight;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const shouldStick = scrollY > totalTopHeight;

    if (shouldStick) {
      if (!bodyEl.classList.contains("nav-scrolled")) {
        bodyEl.classList.add("nav-scrolled");
        // Force reflow for Chrome
        void bodyEl.offsetHeight;
        const osbHeight = osbRow.getBoundingClientRect().height;
        bodyEl.style.paddingTop = osbHeight + "px";
      } else {
        const osbHeight = osbRow.getBoundingClientRect().height;
        bodyEl.style.paddingTop = osbHeight + "px";
      }
    } else {
      if (bodyEl.classList.contains("nav-scrolled")) {
        bodyEl.classList.remove("nav-scrolled");
        bodyEl.style.paddingTop = "";
      }
    }
  }

  // Use requestAnimationFrame for smoother scrolling in Chrome
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateSticky();
        ticking = false;
      });
      ticking = true;
    }
  }

  // --- Debounced resize listener
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSticky();
      // Force mobile menu to recalculate if open
      if (overlay && overlay.classList.contains("open")) {
        const mobileContent = overlay.querySelector(".mobile-menu-sections");
        if (mobileContent) {
          mobileContent.style.opacity = "0.99";
          setTimeout(() => {
            mobileContent.style.opacity = "";
          }, 10);
        }
      }
    }, 100);
  }

  // --- Event binding with Chrome compatibility
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", handleResize);
  
  // Initial call with slight delay for Chrome to calculate properly
  setTimeout(updateSticky, 100);
  updateSticky();

  // --- Mobile overlay toggle
  const burger = document.getElementById("burgerBtn");
  const overlay = document.getElementById("mobileOverlay");
  const closeBtn = document.getElementById("closeOverlayBtn");

  function openOverlay() {
    if (overlay) {
      overlay.classList.add("open");
      bodyEl.classList.add("menu-open");
      document.body.style.overflow = "hidden";
      // Chrome needs this to trigger CSS transition
      void overlay.offsetWidth;
    }
  }

  function closeOverlay() {
    if (overlay) {
      overlay.classList.remove("open");
      bodyEl.classList.remove("menu-open");
      document.body.style.overflow = "";
    }
  }

  if (burger) {
    burger.addEventListener("click", openOverlay);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOverlay);
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
    });
  }

  // Close overlay on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && overlay.classList.contains("open")) {
      closeOverlay();
    }
  });

  // ========================
  // MOBILE MENU DATA - EXACT MATCH WITH HTML
  // ========================

  // Main navigation data from desktop mega menu
  const mainNavItems = [
    {
      title: "About AUB",
      sections: [
        {
          title: "About AUB",
          links: [
            { text: "Overview", url: "/AboutUs/Pages/default.aspx" },
            { text: "History", url: "/aboutus/Pages/history.aspx" },
            { text: "Mission and Vision", url: "/aboutus/Pages/mission.aspx" },
            { text: "Facts and Figures", url: "/aboutus/Pages/facts.aspx" },
            { text: "Title IX", url: "/President/oeo-titleix" }
          ]
        },
        {
          title: "Leadership & Media",
          links: [
            { text: "AUB Leadership", url: "/AboutUs/Pages/leadership.aspx" },
            { text: "Office of the President", url: "/president" },
            { text: "New York Office", url: "/nyo" },
            { text: "The MainGate Magazine", url: "/maingate" },
            { text: "Office of Advancement", url: "/advancement" }
          ]
        },
        {
          title: "Campus & Heritage",
          links: [
            { text: "Campus", url: "/aboutus/Pages/campus.aspx" },
            { text: "About Beirut and Lebanon", url: "/aboutus/Pages/beirut-lb.aspx" },
            { text: "Accreditation", url: "/accreditation" },
            { text: "AUB 150", url: "https://150.aub.edu.lb/", external: true }
          ]
        }
      ]
    },
    {
      title: "Academics",
      sections: [
        {
          title: "Programs & Faculties",
          links: [
            { text: "Faculties", url: "/academics/Pages/faculties.aspx" },
            { text: "Departments and Centers", url: "/Pages/AZ.aspx" },
            { text: "Majors and Programs", url: "/academics/pages/majors_programs.aspx" },
            { text: "Search for a Course", url: "https://www-banner.aub.edu.lb/pls/weba/bwckctlg.p_disp_dyn_ctlg", external: true }
          ]
        },
        {
          title: "Innovation & Support",
          links: [
            { text: "Institute for Academic Innovation and Development", url: "/theinstitute" },
            { text: "Graduate Council", url: "/graduatecouncil" },
            { text: "General Education Program", url: "/generaleducation" },
            { text: "Office of International Programs", url: "/oip" }
          ]
        },
        {
          title: "Resources",
          links: [
            { text: "Office of the Provost", url: "/provost" },
            { text: "Office of the Registrar", url: "/registrar" },
            { text: "Libraries", url: "/libraries" }
          ]
        }
      ]
    },
    {
      title: "Admissions",
      sections: [
        {
          title: "Apply & Aid",
          links: [
            { text: "Admissions", url: "/admissions" },
            { text: "Financial Aid", url: "/faid" },
            { text: "Tuition and Fees Calculator", url: "http://www.aub.edu.lb/admissions/Pages/TC/index.html", external: true },
            { text: "Visiting Student", url: "https://www.aub.edu.lb/admissions/applications/Pages/SpecialVisiting.aspx", external: true }
          ]
        },
        {
          title: "Scholarships",
          links: [
            { text: "Scholarships", url: "/faid/Pages/Scholarships.aspx" },
            { text: "LEAD scholarship opportunities", url: "/lead" },
            { text: "Office of Student Affairs", url: "/sao" }
          ]
        },
        {
          title: "Pathways",
          links: [
            { text: "Majors and Programs", url: "/academics/pages/majors_programs.aspx" },
            { text: "Graduate Council", url: "/graduatecouncil" },
            { text: "Office of International Programs", url: "/oip" }
          ]
        }
      ]
    },
    {
      title: "Research",
      sections: [
        {
          title: "Research Enterprise",
          links: [
            { text: "Office of Research", url: "/research" },
            { text: "Research by Faculty/School", url: "/Pages/ResearchbyFaculty.aspx" },
            { text: "Interfaculty Research Centers", url: "/Pages/ResearchCenters.aspx" },
            { text: "University Research Board", url: "/urb" }
          ]
        },
        {
          title: "Funding & Integrity",
          links: [
            { text: "Research Funding", url: "/Pages/ResearchSupport.aspx" },
            { text: "Research Integrity", url: "/urb/Pages/Researchintegrity.aspx" },
            { text: "Human Research Protection Program / Institutional Review Board", url: "/irb" }
          ]
        },
        {
          title: "Opportunities",
          links: [
            { text: "Medical Research Volunteer Program", url: "/MRVP" },
            { text: "Undergraduate Research Volunteer Program", url: "/provost/urvp" },
            { text: "Research News", url: "/articles/Pages/research.aspx" }
          ]
        }
      ]
    },
    {
      title: "Outreach",
      sections: [
        {
          title: "Community",
          links: [
            { text: "Community Engagement", url: "/CCE" },
            { text: "Neighborhood Initiative", url: "/Neighborhood" },
            { text: "Nature Conservation", url: "/natureconservation" },
            { text: "University for Seniors", url: "/seniors" }
          ]
        },
        {
          title: "Institutes",
          links: [
            { text: "Issam Fares Institute", url: "/ifi" },
            { text: "iPark", url: "https://sites.aub.edu.lb/ipark/", external: true },
            { text: "Knowledge to Policy Center", url: "/k2p" },
            { text: "The Munib and Angela Masri Institute of Energy and Natural Resources", url: "/masri_institute" }
          ]
        },
        {
          title: "Global Impact",
          links: [
            { text: "AI Hub", url: "https://www.aub.edu.lb/hub/Pages/default.aspx", external: true },
            { text: "Environment and Sustainable Development", url: "/fafs/esdu" },
            { text: "Global Health Institute", url: "https://ghi.aub.edu.lb/", external: true }
          ]
        }
      ]
    },
    {
      title: "Boldly Campaign",
      sections: [
        {
          title: "Campaign",
          links: [
            { text: "Campaign Overview", url: "http://boldly.aub.edu.lb/", external: true },
            { text: "Impact Stories", url: "http://boldly.aub.edu.lb/impact-stories/", external: true },
            { text: "Campaign Objectives", url: "http://boldly.aub.edu.lb/campaign-objectives/", external: true },
            { text: "Ways to Support", url: "http://boldly.aub.edu.lb/ways-to-support/", external: true },
            { text: "Campaign Progress", url: "http://boldly.aub.edu.lb/#funding-v2", external: true },
            { text: "Join the Campaign", url: "https://secureca.imodules.com/s/1716/interior.aspx?sid=1716&gid=2&pgid=618&cid=2462", external: true }
          ]
        }
      ]
    }
  ];

  // OSB navigation data from nav-osb section
  const osbNavItems = [
    {
      title: "About",
      links: [
        { text: "Meet the Dean", url: "/osb/about/Pages/Meet-the-Dean.aspx" },
        { text: "Mission And Vision", url: "/osb/about/Pages/default.aspx" },
        { text: "About Suliman Saleh Olayan", url: "/osb/about/Pages/Olayan-.aspx" },
        { text: "International Advisory Board", url: "https://www.aub.edu.lb/osb/Pages/advisoryboard.aspx", external: true },
        { text: "Global Recognitions & Labels", url: "/osb/about/Pages/Global-Recognition-.aspx" },
        { text: "Governance", url: "/osb/about/Pages/Governance.aspx" },
        { text: "Faculty and Staff Resources", url: "/osb/about/Pages/recources.aspx" },
        { text: "OSB 125", url: "/osb/125/Pages/default.aspx", external: true },
        { text: "OSB Strategic Plan 2029", url: "https://sites.aub.edu.lb/osb2029/", external: true },
        { text: "Job Opportunities", url: "https://www.aub.edu.lb/osb/about/Pages/Employment.aspx", external: true }
      ]
    },
    {
      title: "Academic Programs",
      links: [
        { text: "Undergraduate Program", url: "/osb/UndergradProgram", external: true },
        { text: "Specialized Masters", url: "/osb/Pages/SpecializedMasters.aspx", external: true },
        { text: "MBA", url: "/osb/MBA", external: true },
        { text: "MBA Online", url: "/osb/OMBA/Pages/default.aspx", external: true },
        { text: "Executive MBA", url: "/osb/EMBA", external: true }
      ]
    },
    {
      title: "Executive Education",
      url: "https://www.aub.edu.lb/osb/executiveeducation/Pages/default.aspx",
      external: true,
      isLink: true
    },
    {
      title: "OSB Online",
      links: [
        { text: "Entrepreneurship & Innovation Online Graduate Professional Diploma", url: "https://www.aub.edu.lb/online/Entrepreneurship-Innovation-online-diploma/Pages/default.aspx", external: true },
        { text: "Combating Trade-Based Financial Crime Online Certificate", url: "https://www.aub.edu.lb/osb/online/combating-trade-based-financial-crime-certificate/Pages/default.aspx", external: true },
        { text: "Strategic Branding in the Digital Era Online Diploma", url: "https://www.aub.edu.lb/osb/online/strategic_branding/Pages/default.aspx", external: true },
        { text: "Investment Analysis and Modern Portfolio Management Online Graduate Professional Diploma", url: "https://www.aub.edu.lb/osb/online/investment-analysis-modern-portfolio-management/Pages/default.aspx", external: true }
      ]
    },
    {
      title: "Faculty",
      url: "/osb/Pages/Faculty.aspx",
      isLink: true
    },
    {
      title: "Research",
      url: "https://www.aub.edu.lb/osb/facultyresearch/Pages/default.aspx",
      external: true,
      isLink: true
    },
    {
      title: "News",
      url: "https://www.aub.edu.lb/osb/news/Pages/default.aspx",
      isLink: true
    },
    {
      title: "OSB Impacts",
      url: "https://www.aub.edu.lb/osb/impact/Pages/default.aspx",
      external: true,
      isLink: true
    }
  ];

  // Utility links data
  const utilityLinks = [
    { text: "A - Z", url: "/Pages/AZ.aspx" },
    { text: "Find People", url: "/Search/Pages/People.aspx" },
    { text: "AUBMC", url: "https://aubmc.org.lb/", external: true },
    { text: "Libraries", url: "/libraries" },
    { text: "Jobs", url: "/Employment" },
    { text: "Alumni", url: "http://alumni.aub.edu.lb/s/1716/start.aspx?gid=2&pgid=61", external: true },
    { text: "AUB Online", url: "https://online.aub.edu.lb", external: true },
    { text: "AUB – Mediterraneo", url: "https://www.aubmed.ac.cy/", external: true },
    { text: "Telehealth", url: "https://myaubhealth.aubmc.org.lb/mychartprd/Authentication/Login", external: true },
    { text: "Give", url: "/advancement/Development/Pages/HowToMakeAGift.aspx" }
  ];

  // Helper function to create links (Chrome-optimized)
  function createLink(linkData, className = "") {
    const a = document.createElement("a");
    a.href = linkData.url;
    a.textContent = linkData.text;
    if (className) a.className = className;
    if (linkData.external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  // Build mobile main navigation
  function buildMobileMain() {
    const container = document.getElementById("mobileMainNav");
    if (!container) return;
    container.innerHTML = "";

    mainNavItems.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mobile-nav-item";

      const button = document.createElement("div");
      button.className = "mobile-nav-link has-sub";
      button.setAttribute("data-menu-id", index);
      button.innerHTML = `<span>${item.title}</span><span class="chevron-icon"></span>`;

      const submenu = document.createElement("div");
      submenu.className = "mobile-submenu";

      item.sections.forEach(section => {
        const sectionTitle = document.createElement("div");
        sectionTitle.className = "subcategory-title";
        sectionTitle.textContent = section.title;
        submenu.appendChild(sectionTitle);

        section.links.forEach(link => {
          const anchor = createLink(link);
          submenu.appendChild(anchor);
        });
      });

      // Chrome-friendly click handler
      button.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other open menus
        document.querySelectorAll(".mobile-nav-link.has-sub.open").forEach(openBtn => {
          if (openBtn !== button) {
            openBtn.classList.remove("open");
            const siblingSubmenu = openBtn.parentElement?.querySelector(".mobile-submenu");
            if (siblingSubmenu) siblingSubmenu.classList.remove("open");
          }
        });
        
        button.classList.toggle("open");
        submenu.classList.toggle("open");
      });

      wrapper.appendChild(button);
      wrapper.appendChild(submenu);
      container.appendChild(wrapper);
    });
  }

  // Build mobile OSB navigation
  function buildMobileOsb() {
    const container = document.getElementById("mobileOsbNav");
    if (!container) return;
    container.innerHTML = "";

    osbNavItems.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mobile-nav-item";

      if (item.isLink && item.url) {
        // Single link item
        const link = createLink({ text: item.title, url: item.url, external: item.external }, "mobile-nav-link");
        wrapper.appendChild(link);
      } else if (item.links && item.links.length > 0) {
        // Dropdown item
        const button = document.createElement("div");
        button.className = "mobile-nav-link has-sub";
        button.setAttribute("data-osb-id", index);
        button.innerHTML = `<span>${item.title}</span><span class="chevron-icon"></span>`;

        const submenu = document.createElement("div");
        submenu.className = "mobile-submenu";

        item.links.forEach(link => {
          const anchor = createLink(link);
          submenu.appendChild(anchor);
        });

        button.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other open OSB menus
          document.querySelectorAll("#mobileOsbNav .mobile-nav-link.has-sub.open").forEach(openBtn => {
            if (openBtn !== button) {
              openBtn.classList.remove("open");
              const siblingSubmenu = openBtn.parentElement?.querySelector(".mobile-submenu");
              if (siblingSubmenu) siblingSubmenu.classList.remove("open");
            }
          });
          
          button.classList.toggle("open");
          submenu.classList.toggle("open");
        });

        wrapper.appendChild(button);
        wrapper.appendChild(submenu);
      }

      container.appendChild(wrapper);
    });
  }

  // Build utility grid
  function buildUtilityGrid() {
    const container = document.getElementById("mobileUtilityGrid");
    if (!container) return;
    container.innerHTML = "";
    
    utilityLinks.forEach(link => {
      const anchor = createLink(link);
      container.appendChild(anchor);
    });
  }

  // Initialize mobile menus when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      buildMobileMain();
      buildMobileOsb();
      buildUtilityGrid();
    });
  } else {
    buildMobileMain();
    buildMobileOsb();
    buildUtilityGrid();
  }
})();