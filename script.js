(() => {
  const modalMarkup = `
    <div class="modal" id="estimate-modal" role="dialog" aria-modal="true" aria-labelledby="estimate-modal-title" hidden>
      <div class="modal__dialog">
        <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>&times;</button>
        <h2 id="estimate-modal-title">Заказать расчет</h2>
        <form class="modal-form" data-form-kind="estimate">
          <label class="modal-field">
            <span>Имя</span>
            <input type="text" name="name" autocomplete="name" required>
          </label>
          <label class="modal-field">
            <span>Номер телефона</span>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 (000) 000-00-00" required>
          </label>
          <label class="modal-field">
            <span>Услуга</span>
            <input type="text" name="service" autocomplete="off" placeholder="Например, дом из бруса" required>
          </label>
          <label class="modal-field">
            <span>Email</span>
            <input type="email" name="email" autocomplete="email" required>
          </label>
          <label class="modal-field">
            <span>Сообщение</span>
            <textarea name="message" rows="4" required></textarea>
          </label>
          <button class="modal-submit" type="submit">Отправить заявку</button>
          <p class="modal-form__status" aria-live="polite"></p>
        </form>
      </div>
    </div>

    <div class="modal" id="callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-modal-title" hidden>
      <div class="modal__dialog modal__dialog--small">
        <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>&times;</button>
        <h2 id="callback-modal-title">Обратный звонок</h2>
        <form class="modal-form" data-form-kind="callback">
          <label class="modal-field">
            <span>Имя</span>
            <input type="text" name="name" autocomplete="name" placeholder="Ваше имя" required>
          </label>
          <label class="modal-field">
            <span>Номер телефона</span>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 (000) 000-00-00" required>
          </label>
          <button class="modal-submit" type="submit">Заказать звонок</button>
          <p class="modal-form__status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalMarkup);

  const getPhoneDigits = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    const normalized =
      digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits;
    return normalized.slice(0, 10);
  };

  const formatPhone = (value) => {
    const phone = getPhoneDigits(value);
    if (!phone.length) return "";

    let result = "+7";
    if (phone.length > 0) result += ` (${phone.slice(0, 3)}`;
    if (phone.length >= 3) result += ")";
    if (phone.length > 3) result += ` ${phone.slice(3, 6)}`;
    if (phone.length > 6) result += `-${phone.slice(6, 8)}`;
    if (phone.length > 8) result += `-${phone.slice(8, 10)}`;
    return result;
  };

  const bindPhoneMask = (root = document) => {
    root.querySelectorAll('input[type="tel"]').forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Backspace" && event.key !== "Delete") return;

        const phone = getPhoneDigits(input.value);
        const selectedValue = input.value.slice(
          input.selectionStart || 0,
          input.selectionEnd || 0
        );
        const selectedPhone = getPhoneDigits(selectedValue);
        const wholeValueSelected =
          input.selectionStart === 0 && input.selectionEnd === input.value.length;
        const removesAllPhoneDigits =
          wholeValueSelected ||
          !phone.length ||
          phone.length <= 1 ||
          selectedPhone.length >= phone.length;

        if (removesAllPhoneDigits || input.selectionStart <= 4) {
          event.preventDefault();
          input.value = "";
        }
      });

      input.addEventListener("input", () => {
        if (!getPhoneDigits(input.value)) {
          input.value = "";
          return;
        }

        input.value = formatPhone(input.value);
      });

      input.addEventListener("blur", () => {
        if (!getPhoneDigits(input.value)) input.value = "";
      });
    });
  };

  bindPhoneMask();

  const productData = {
    modern: {
      title: "Современный дом",
      description:
        'Спроектируем и построим современный загородный дом в Санкт-Петербурге и Ленинградской области под ключ и в срок. <span>Начните с бесплатного расчета сметы за 1 день.</span>',
      tags: ["Современный", "Загородный дом", "Под ключ", "Скидки"],
    },
    terrace: {
      title: "Дом с террасой",
      description:
        'Продуманный проект для жизни за городом: просторная гостиная, панорамное остекление и удобная зона отдыха. <span>Начните с бесплатного расчета сметы за 1 день.</span>',
      tags: ["Терраса", "Панорамные окна", "Под ключ", "Смета за 1 день"],
    },
    onefloor: {
      title: "Одноэтажный дом",
      description:
        'Комфортный одноэтажный проект с понятной планировкой, инженерными решениями и точной сметой до начала работ. <span>Подготовим расчет за 1 день.</span>',
      tags: ["Одноэтажный", "Семейный дом", "Инженерия", "Под ключ"],
    },
    classic: {
      title: "Классический дом",
      description:
        'Сдержанная архитектура, надежные материалы и функциональная планировка для постоянного проживания круглый год. <span>Рассчитаем стоимость под ваш участок.</span>',
      tags: ["Классический", "Для семьи", "Теплый контур", "Сроки"],
    },
    timber: {
      title: "Дом из бруса",
      description:
        'Построим теплый деревянный дом для постоянного проживания и отдыха с точным расчетом материалов, сроков и бюджета. <span>Начните с бесплатной сметы за 1 день.</span>',
      tags: ["Деревянный дом", "Брус", "Под ключ", "Теплый контур"],
    },
    gasbeton: {
      title: "Дом из газобетона",
      description:
        'Построим надежный каменный дом с продуманной планировкой, инженерией и отделкой. <span>Подготовим расчет под ваш участок.</span>',
      tags: ["Газобетон", "Каменный дом", "Инженерия", "Под ключ"],
    },
    frame: {
      title: "Каркасный дом",
      description:
        'Возведем энергоэффективный каркасный дом с быстрыми сроками строительства и контролем качества узлов. <span>Смета будет готова за 1 день.</span>',
      tags: ["Каркасный дом", "Быстрый монтаж", "Энергоэффективность", "Скидки"],
    },
    commercial: {
      title: "Отделка коммерческого помещения",
      description:
        'Выполним комплексную отделку офисов, торговых и рабочих пространств под требования бизнеса и эксплуатации. <span>Рассчитаем работы и материалы.</span>',
      tags: ["Коммерция", "Отделка", "Сроки", "Контроль работ"],
    },
    renovation: {
      title: "Ремонт квартир",
      description:
        'Сделаем ремонт квартиры с прозрачной сметой, подбором материалов и ежедневным контролем выполнения работ. <span>Начните с расчета стоимости.</span>',
      tags: ["Ремонт", "Материалы", "Смета", "Под ключ"],
    },
  };

  const productPage = document.querySelector("[data-product-page]");
  if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("item") || "modern";
    const source = params.get("source") || "catalog";
    const product = productData[key] || productData.modern;
    const title = productPage.querySelector("[data-product-title]");
    const description = productPage.querySelector("[data-product-description]");
    const tags = productPage.querySelector("[data-product-tags]");
    const backLink = productPage.querySelector(".product-detail__back");
    const backTargets = {
      services: { href: "services.html", text: "← Назад к услугам" },
      portfolio: { href: "portfolio.html", text: "← Назад к портфолио" },
      catalog: { href: "catalog.html", text: "← Назад к каталогу" },
    };
    const backTarget = backTargets[source] || backTargets.catalog;

    document.title = `${product.title} | Адамант`;
    if (title) title.textContent = product.title;
    if (description) description.innerHTML = product.description;
    if (tags) {
      tags.innerHTML = product.tags.map((tag) => `<span>${tag}</span>`).join("");
    }
    if (backLink) {
      backLink.href = backTarget.href;
      backLink.textContent = backTarget.text;
    }

    document.querySelectorAll(".nav__link--active").forEach((link) => {
      link.classList.remove("nav__link--active");
    });

    const activeNav = document.querySelector(`.nav__link[href="${backTarget.href}"]`);
    if (activeNav) activeNav.classList.add("nav__link--active");
  }

  const mobileMenuButtons = Array.from(document.querySelectorAll(".mobile-menu-toggle"));
  const closeMobileNav = () => {
    document.body.classList.remove("mobile-nav-open");
    mobileMenuButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
  };

  mobileMenuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("mobile-nav-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("mobile-nav-open")) return;
    if (event.target.closest(".header")) return;
    closeMobileNav();
  });

  const houseStage = document.querySelector(".house-stage");
  if (houseStage) {
    const setHouseLight = (isOn) => {
      houseStage.classList.toggle("is-light-on", isOn);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHouseLight(true);
    } else {
      window.setTimeout(() => setHouseLight(true), 1180);
      window.setTimeout(() => setHouseLight(false), 1280);
      window.setTimeout(() => setHouseLight(true), 1430);
    }
  }

  document.querySelectorAll(".project-tabs").forEach((tabs) => {
    const section = tabs.closest(".section");
    const cards = Array.from(section?.querySelectorAll(".project-card") || []);
    if (!cards.length) return;

    tabs.addEventListener("click", (event) => {
      const button = event.target.closest(".project-tabs__button");
      if (!button) return;

      const filter = button.dataset.filter || "all";

      tabs.querySelectorAll(".project-tabs__button").forEach((tab) => {
        const isActive = tab === button;
        tab.classList.toggle("project-tabs__button--active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.hidden = !shouldShow;
      });
    });
  });

  const modals = Array.from(document.querySelectorAll(".modal"));
  let activeModal = null;
  let previousFocus = null;

  const getFocusable = (modal) =>
    Array.from(
      modal.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.disabled && element.offsetParent !== null);

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    previousFocus = document.activeElement;
    activeModal = modal;
    modal.hidden = false;
    document.body.classList.add("is-modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("modal--open");
      const firstInput =
        modal.querySelector("input, textarea") || modal.querySelector("button");
      if (firstInput) firstInput.focus();
    });
  };

  const closeModal = () => {
    if (!activeModal) return;

    activeModal.classList.remove("modal--open");
    activeModal.hidden = true;
    document.body.classList.remove("is-modal-open");

    const status = activeModal.querySelector(".modal-form__status");
    if (status) status.textContent = "";

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }

    activeModal = null;
    previousFocus = null;
  };

  document.addEventListener("click", (event) => {
    const estimateTrigger = event.target.closest(".js-open-estimate");
    if (estimateTrigger) {
      event.preventDefault();
      openModal("estimate-modal");
      return;
    }

    const phoneTrigger = event.target.closest(".phone");
    if (phoneTrigger) {
      event.preventDefault();
      openModal("callback-modal");
      return;
    }

    if (event.target.closest("[data-modal-close]")) {
      closeModal();
      return;
    }

    if (event.target.classList.contains("modal")) {
      closeModal();
      return;
    }

    const linkedCard = event.target.closest?.("[data-card-link]");
    if (linkedCard && !event.target.closest("a, button")) {
      window.location.href = linkedCard.dataset.cardLink;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("mobile-nav-open")) {
      closeMobileNav();
      return;
    }

    const linkedCard = event.target.closest?.("[data-card-link]");
    if (
      linkedCard &&
      !activeModal &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      window.location.href = linkedCard.dataset.cardLink;
      return;
    }

    if (!activeModal) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusable(activeModal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  modals.forEach((modal) => {
    const form = modal.querySelector(".modal-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const status = form.querySelector(".modal-form__status");
      form.reset();

      if (status) {
        status.textContent =
          form.dataset.formKind === "callback"
            ? "Заявка на звонок отправлена."
            : "Заявка на расчет отправлена.";
      }
    });
  });

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let status = form.querySelector(".contact-form__status");
      if (!status) {
        status = document.createElement("p");
        status.className = "contact-form__status";
        status.setAttribute("aria-live", "polite");
        form.append(status);
      }

      form.reset();
      status.textContent = "Сообщение отправлено.";
    });
  });
})();
