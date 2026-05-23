(() => {
  const modalMarkup = `
    <div class="modal" id="estimate-modal" role="dialog" aria-modal="true" aria-labelledby="estimate-modal-title" hidden>
      <div class="modal__dialog modal__dialog--lead">
        <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>&times;</button>
        <div class="modal-lead" data-modal-state="form">
          <section class="modal-lead__content">
            <span class="modal-lead__icon" aria-hidden="true">
              <img src="/new-icons/estimate-day.png" alt="">
            </span>
            <h2 id="estimate-modal-title">Оставьте заявку</h2>
            <p class="modal-lead__text">Мы свяжемся с вами, ответим на вопросы и подготовим бесплатный расчёт сметы.</p>
            <form class="modal-form modal-form--lead" data-form-kind="estimate">
              <div class="modal-form__row">
                <label class="modal-field">
                  <input type="text" name="name" autocomplete="name" placeholder="Ваше имя" aria-label="Ваше имя">
                </label>
                <label class="modal-field">
                  <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="Телефон *" aria-label="Телефон" required>
                </label>
              </div>
              <label class="modal-field">
                <input type="text" name="service" placeholder="Услуга" aria-label="Услуга">
              </label>
              <label class="modal-field">
                <textarea name="message" rows="5" placeholder="Расскажите о вашем проекте" aria-label="Сообщение"></textarea>
              </label>
              <label class="modal-file">
                <input type="file" name="photos" accept="image/*" multiple>
                <span class="modal-file__button">Прикрепить фото</span>
                <span class="modal-file__summary" data-file-summary>Можно прикрепить до 5 фото</span>
              </label>
              <label class="modal-consent">
                <input type="checkbox" name="privacy" checked>
                <span>Согласен на <span class="modal-consent__link">обработку персональных данных</span></span>
              </label>
              <button class="modal-submit" type="submit">Отправить заявку</button>
              <p class="modal-form__status" aria-live="polite"></p>
            </form>
          </section>
          <aside class="modal-lead__visual" aria-hidden="true">
            <img src="/request-house.jpg" alt="">
            <div class="modal-lead__benefits">
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--consult"></span>
                <div>
                  <strong>Бесплатная консультация</strong>
                  <p>Ответим на все ваши вопросы</p>
                </div>
              </div>
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--calc"></span>
                <div>
                  <strong>Точный расчёт сметы</strong>
                  <p>Подготовим смету под ваш проект</p>
                </div>
              </div>
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--clock"></span>
                <div>
                  <strong>Быстрый ответ</strong>
                  <p>Свяжемся с вами в течение 15 минут</p>
                </div>
              </div>
              <span class="modal-lead__secure">Ваши данные защищены и не передаются третьим лицам</span>
            </div>
          </aside>
        </div>

        <section class="modal-result modal-result--success" data-modal-state="success" hidden>
          <div class="modal-result__mark" aria-hidden="true"></div>
          <h2>Заявка отправлена!</h2>
          <p>Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
          <div class="modal-result__card">
            <span class="modal-result__card-icon modal-result__card-icon--phone"></span>
            <div>
              <strong>Что дальше?</strong>
              <p>Наш менеджер свяжется с вами в течение 15 минут в рабочее время (9:00 — 20:00).</p>
            </div>
          </div>
          <button class="modal-submit" type="button" data-modal-close>Вернуться на сайт</button>
        </section>

        <section class="modal-result modal-result--error" data-modal-state="error" hidden>
          <div class="modal-result__mark" aria-hidden="true"></div>
          <h2>Не удалось отправить заявку</h2>
          <p>Что-то пошло не так. Попробуйте отправить заявку еще раз или свяжитесь с нами другим способом.</p>
          <div class="modal-result__card">
            <span class="modal-result__card-icon modal-result__card-icon--signal"></span>
            <div>
              <strong>Что можно сделать?</strong>
              <p>Проверьте соединение или попробуйте снова через пару минут.</p>
            </div>
          </div>
          <button class="modal-submit" type="button" data-modal-retry>Попробовать снова</button>
          <a class="modal-submit modal-submit--secondary" href="tel:+79111970457">Позвонить нам</a>
        </section>
      </div>
    </div>

    <div class="modal" id="callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-modal-title" hidden>
      <div class="modal__dialog modal__dialog--lead">
        <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>&times;</button>
        <div class="modal-lead" data-modal-state="form">
          <section class="modal-lead__content">
            <span class="modal-lead__icon" aria-hidden="true">
              <img src="/new-icons/phone.png" alt="">
            </span>
            <h2 id="callback-modal-title">Заказать<br>обратный звонок</h2>
            <p class="modal-lead__text">Оставьте номер телефона — мы перезвоним вам, ответим на вопросы и поможем с выбором решения.</p>
            <form class="modal-form modal-form--lead" data-form-kind="callback">
              <label class="modal-field">
                <input type="text" name="name" autocomplete="name" placeholder="Ваше имя" aria-label="Ваше имя">
              </label>
              <label class="modal-field">
                <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="Телефон *" aria-label="Телефон" required>
              </label>
              <label class="modal-field">
                <select name="callTime" aria-label="Удобное время звонка">
                  <option value="">Удобное время звонка</option>
                  <option value="В течение 10 минут">В течение 10 минут</option>
                  <option value="Сегодня">Сегодня</option>
                  <option value="Завтра">Завтра</option>
                  <option value="В рабочее время">В рабочее время</option>
                </select>
              </label>
              <label class="modal-field">
                <textarea name="message" rows="4" placeholder="Комментарий (необязательно)" aria-label="Комментарий"></textarea>
              </label>
              <label class="modal-consent">
                <input type="checkbox" name="privacy" checked>
                <span>Согласен на <span class="modal-consent__link">обработку персональных данных</span></span>
              </label>
              <button class="modal-submit" type="submit">Жду звонка</button>
              <p class="modal-form__status" aria-live="polite"></p>
            </form>
          </section>
          <aside class="modal-lead__visual" aria-hidden="true">
            <img src="/request-house.jpg" alt="">
            <div class="modal-lead__benefits">
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--clock"></span>
                <div>
                  <strong>Перезвоним в течение 10 минут</strong>
                  <p>Наш специалист свяжется с вами быстро и ответит на все вопросы</p>
                </div>
              </div>
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--consult"></span>
                <div>
                  <strong>Бесплатная консультация</strong>
                  <p>Проконсультируем по проектам, материалам и срокам строительства</p>
                </div>
              </div>
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--calc"></span>
                <div>
                  <strong>Поможем рассчитать стоимость проекта</strong>
                  <p>Подготовим точный расчет под ваш проект</p>
                </div>
              </div>
              <span class="modal-lead__secure">Ваши данные в безопасности</span>
            </div>
          </aside>
        </div>

        <section class="modal-result modal-result--success" data-modal-state="success" hidden>
          <div class="modal-result__mark" aria-hidden="true"></div>
          <h2>Заявка отправлена!</h2>
          <p>Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
          <div class="modal-result__card">
            <span class="modal-result__card-icon modal-result__card-icon--phone"></span>
            <div>
              <strong>Что дальше?</strong>
              <p>Наш менеджер свяжется с вами в течение 15 минут в рабочее время (9:00 — 20:00).</p>
            </div>
          </div>
          <button class="modal-submit" type="button" data-modal-close>Вернуться на сайт</button>
        </section>

        <section class="modal-result modal-result--error" data-modal-state="error" hidden>
          <div class="modal-result__mark" aria-hidden="true"></div>
          <h2>Не удалось отправить заявку</h2>
          <p>Что-то пошло не так. Попробуйте отправить заявку еще раз или свяжитесь с нами другим способом.</p>
          <div class="modal-result__card">
            <span class="modal-result__card-icon modal-result__card-icon--signal"></span>
            <div>
              <strong>Что можно сделать?</strong>
              <p>Проверьте соединение или попробуйте снова через пару минут.</p>
            </div>
          </div>
          <button class="modal-submit" type="button" data-modal-retry>Попробовать снова</button>
          <a class="modal-submit modal-submit--secondary" href="tel:+79111970457">Позвонить нам</a>
        </section>
      </div>
    </div>

    <div class="modal" id="message-modal" role="dialog" aria-modal="true" aria-labelledby="message-modal-title" hidden>
      <div class="modal__dialog modal__dialog--lead">
        <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>&times;</button>
        <div class="modal-lead" data-modal-state="form">
          <section class="modal-lead__content">
            <span class="modal-lead__icon" aria-hidden="true">
              <img src="/new-icons/chat.png" alt="">
            </span>
            <h2 id="message-modal-title">Написать нам</h2>
            <p class="modal-lead__text">Оставьте почту и сообщение — мы ответим и подскажем по проекту.</p>
            <form class="modal-form modal-form--lead" data-form-kind="message">
              <input type="hidden" name="service" value="Сообщение из футера" autocomplete="off">
              <div class="modal-form__row">
                <label class="modal-field">
                  <input type="text" name="name" autocomplete="name" placeholder="Ваше имя" aria-label="Ваше имя">
                </label>
                <label class="modal-field">
                  <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="Телефон" aria-label="Телефон">
                </label>
              </div>
              <label class="modal-field">
                <input type="email" name="email" autocomplete="email" placeholder="E-mail *" aria-label="E-mail" required>
              </label>
              <label class="modal-field">
                <textarea name="message" rows="5" placeholder="Ваше сообщение *" aria-label="Сообщение" required></textarea>
              </label>
              <label class="modal-consent">
                <input type="checkbox" name="privacy" checked>
                <span>Согласен на <span class="modal-consent__link">обработку персональных данных</span></span>
              </label>
              <button class="modal-submit" type="submit">Отправить сообщение</button>
              <p class="modal-form__status" aria-live="polite"></p>
            </form>
          </section>
          <aside class="modal-lead__visual" aria-hidden="true">
            <img src="/request-house.jpg" alt="">
            <div class="modal-lead__benefits">
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--consult"></span>
                <div>
                  <strong>Ответим на ваши вопросы</strong>
                  <p>Разберем задачу и подскажем следующий шаг</p>
                </div>
              </div>
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--calc"></span>
                <div>
                  <strong>Подготовим рекомендации</strong>
                  <p>Сориентируем по проекту, срокам и материалам</p>
                </div>
              </div>
              <div class="modal-benefit">
                <span class="modal-benefit__icon modal-benefit__icon--clock"></span>
                <div>
                  <strong>Свяжемся в ближайшее время</strong>
                  <p>Ответим на указанную почту или телефон</p>
                </div>
              </div>
              <span class="modal-lead__secure">Ваши данные защищены и не передаются третьим лицам</span>
            </div>
          </aside>
        </div>

        <section class="modal-result modal-result--success" data-modal-state="success" hidden>
          <div class="modal-result__mark" aria-hidden="true"></div>
          <h2>Сообщение отправлено!</h2>
          <p>Спасибо! Мы получили ваше сообщение и ответим в ближайшее время.</p>
          <div class="modal-result__card">
            <span class="modal-result__card-icon modal-result__card-icon--phone"></span>
            <div>
              <strong>Что дальше?</strong>
              <p>Менеджер посмотрит обращение и свяжется с вами по указанным контактам.</p>
            </div>
          </div>
          <button class="modal-submit" type="button" data-modal-close>Вернуться на сайт</button>
        </section>

        <section class="modal-result modal-result--error" data-modal-state="error" hidden>
          <div class="modal-result__mark" aria-hidden="true"></div>
          <h2>Не удалось отправить сообщение</h2>
          <p>Что-то пошло не так. Попробуйте отправить сообщение еще раз или свяжитесь с нами другим способом.</p>
          <div class="modal-result__card">
            <span class="modal-result__card-icon modal-result__card-icon--signal"></span>
            <div>
              <strong>Что можно сделать?</strong>
              <p>Проверьте соединение или попробуйте снова через пару минут.</p>
            </div>
          </div>
          <button class="modal-submit" type="button" data-modal-retry>Попробовать снова</button>
          <a class="modal-submit modal-submit--secondary" href="tel:+79111970457">Позвонить нам</a>
        </section>
      </div>
    </div>

    <button class="site-chat-button" type="button" aria-label="Открыть чат" data-chat-toggle>
      <span class="site-chat-button__icon" aria-hidden="true">
        <img src="/new-icons/chat.png" alt="">
      </span>
      <span class="site-chat-button__badge" data-chat-badge hidden>0</span>
    </button>
    <section class="site-chat" data-site-chat hidden>
      <div class="site-chat__header">
        <div>
          <strong>Чат с Адамант Строй</strong>
          <span>Отвечаем в рабочее время</span>
        </div>
        <button class="site-chat__close" type="button" aria-label="Закрыть чат" data-chat-close>&times;</button>
      </div>
      <div class="site-chat__messages" data-chat-messages></div>
      <form class="site-chat__form" data-chat-form>
        <textarea name="message" rows="2" placeholder="Напишите сообщение" required></textarea>
        <button type="submit" aria-label="Отправить сообщение">
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <p class="site-chat__status" aria-live="polite" data-chat-status></p>
    </section>

  `;

  document.body.insertAdjacentHTML("beforeend", modalMarkup);
  const estimateModal = document.getElementById("estimate-modal");

  const setEstimateService = (value = "") => {
    const serviceInput = estimateModal?.querySelector('input[name="service"]');
    if (serviceInput) {
      serviceInput.value = value;
    }
  };

  const getEstimateServiceFromTrigger = (trigger) => {
    if (!trigger) return "";

    const explicitService = trigger.dataset?.estimateService?.trim();
    if (explicitService) return explicitService;

    const productTitle = trigger
      .closest(".product-detail__content")
      ?.querySelector("[data-product-title]");
    if (productTitle?.textContent?.trim()) {
      return productTitle.textContent.trim();
    }

    const serviceTitle = trigger.closest(".service-card")?.querySelector("h2, h3");
    if (serviceTitle?.textContent?.trim()) {
      return serviceTitle.textContent.trim();
    }

    return "";
  };

  const getPhoneDigits = (value) => value.replace(/\D/g, "");

  const getSubscriberDigits = (value) => {
    const digits = getPhoneDigits(value);
    if (!digits) return "";

    if (digits.startsWith("7") || digits.startsWith("8")) {
      return digits.slice(1, 11);
    }

    return digits.slice(0, 10);
  };

  const formatPhone = (value) => {
    const digits = getPhoneDigits(value);
    if (!digits) return "";

    const phone = getSubscriberDigits(value);
    let result = "+7";

    if (!phone.length) {
      return result;
    }

    if (phone.length > 0) result += ` (${phone.slice(0, 3)}`;
    if (phone.length >= 3) result += ")";
    if (phone.length > 3) result += ` ${phone.slice(3, 6)}`;
    if (phone.length > 6) result += `-${phone.slice(6, 8)}`;
    if (phone.length > 8) result += `-${phone.slice(8, 10)}`;
    return result;
  };

  const bindPhoneMask = (root = document) => {
    root.querySelectorAll('input[type="tel"]').forEach((input) => {
      if (input.dataset.phoneMaskBound === "true") return;
      input.dataset.phoneMaskBound = "true";

      input.addEventListener("keydown", (event) => {
        if (event.key !== "Backspace" && event.key !== "Delete") return;

        const phone = getSubscriberDigits(input.value);
        const selectionStart = input.selectionStart ?? input.value.length;
        const selectionEnd = input.selectionEnd ?? selectionStart;
        const startDigits = getSubscriberDigits(input.value.slice(0, selectionStart)).length;
        const endDigits = getSubscriberDigits(input.value.slice(0, selectionEnd)).length;

        if (!phone.length) {
          event.preventDefault();
          input.value = "";
          return;
        }

        let nextPhone = phone;

        if (selectionStart !== selectionEnd) {
          nextPhone = phone.slice(0, startDigits) + phone.slice(endDigits);
        } else if (event.key === "Backspace") {
          const removeIndex = startDigits - 1;
          if (removeIndex < 0) {
            nextPhone = "";
          } else {
            nextPhone = phone.slice(0, removeIndex) + phone.slice(removeIndex + 1);
          }
        } else {
          const removeIndex = startDigits;
          if (removeIndex >= phone.length) return;
          nextPhone = phone.slice(0, removeIndex) + phone.slice(removeIndex + 1);
        }

        event.preventDefault();
        input.value = nextPhone ? formatPhone(nextPhone) : "";

        requestAnimationFrame(() => {
          const position = input.value.length;
          input.setSelectionRange(position, position);
        });
      });

      input.addEventListener("input", () => {
        if (!getPhoneDigits(input.value)) {
          input.value = "";
          return;
        }

        input.value = formatPhone(input.value);
      });

      input.addEventListener("blur", () => {
        if (!getSubscriberDigits(input.value)) {
          input.value = getPhoneDigits(input.value) ? "+7" : "";
        }
      });
    });
  };

  bindPhoneMask();

  const readFieldValue = (formData, key) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const setStatusMessage = (element, text, isError = false) => {
    if (!element) return;

    element.textContent = text;
    element.style.color = isError ? "#b42318" : "";
  };

  const setModalState = (modal, state = "form") => {
    if (!modal) return;

    modal.dataset.modalState = state;
    modal.querySelectorAll("[data-modal-state]").forEach((element) => {
      element.hidden = element.dataset.modalState !== state;
    });
  };

  const resetModal = (modal) => {
    if (!modal) return;

    const form = modal.querySelector(".modal-form");
    if (form) form.reset();

    modal.querySelectorAll('input[type="file"]').forEach(updateFileSummary);

    const status = modal.querySelector(".modal-form__status");
    if (status) {
      status.textContent = "";
      status.style.color = "";
    }

    setModalState(modal, "form");
  };

  const focusModalForm = (modal) => {
    const firstInput = modal?.querySelector("input:not([type=\"hidden\"]), textarea, select");
    if (firstInput) firstInput.focus();
  };

  const buildRequestMessageValue = (formData) => {
    const callTime = readFieldValue(formData, "callTime");
    const message = readFieldValue(formData, "message");

    return [
      callTime ? `Удобное время звонка: ${callTime}` : "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const getRequestPhotoFiles = (formData) =>
    formData
      .getAll("photos")
      .filter((file) => file instanceof File && file.size > 0);

  const validateRequestPhotoFiles = (files) => {
    if (files.length > 5) {
      return "Можно прикрепить не больше 5 фото.";
    }

    const oversizedFile = files.find((file) => file.size > 8 * 1024 * 1024);
    if (oversizedFile) {
      return `Фото ${oversizedFile.name} больше 8 МБ.`;
    }

    const wrongTypeFile = files.find((file) => !file.type.startsWith("image/"));
    if (wrongTypeFile) {
      return `Файл ${wrongTypeFile.name} не похож на изображение.`;
    }

    return "";
  };

  const getFileSummaryText = (files) => {
    if (!files.length) return "Можно прикрепить до 5 фото";
    if (files.length === 1) return files[0].name;
    return `Выбрано фото: ${files.length}`;
  };

  const updateFileSummary = (input) => {
    const summary = input.closest(".modal-file")?.querySelector("[data-file-summary]");
    if (!summary) return;

    summary.textContent = getFileSummaryText(Array.from(input.files ?? []));
  };

  document.addEventListener("change", (event) => {
    const input = event.target.closest?.('input[type="file"][name="photos"]');
    if (input) updateFileSummary(input);
  });

  const submitRequest = async (payload) => {
    if (payload.requestType === "estimate") {
      const formPayload = new FormData();
      const photos = Array.isArray(payload.photos) ? payload.photos : [];

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "photos") return;
        formPayload.append(key, typeof value === "string" ? value : "");
      });

      photos.forEach((file) => {
        formPayload.append("photos", file);
      });

      const response = await fetch("/api/request-with-photos", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    }

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  const countUpElements = Array.from(document.querySelectorAll("[data-count-up]"));

  const parseCountUpValue = (value) => {
    const text = value.trim();
    const match = text.match(/^(\D*?)(\d[\d\s]*)(.*)$/);

    if (!match) {
      return null;
    }

    const [, prefix, rawNumber, suffix] = match;
    const target = Number(rawNumber.replace(/\s/g, ""));

    if (!Number.isFinite(target)) {
      return null;
    }

    return {
      prefix,
      target,
      suffix: suffix.trimStart(),
    };
  };

  const formatCountUpValue = ({ prefix, suffix }, value) => {
    const rounded = Math.round(value);
    const spacer = suffix && !suffix.startsWith("+") ? " " : "";
    return `${prefix}${rounded}${spacer}${suffix}`;
  };

  const animateCountUp = (element) => {
    if (element.dataset.countUpStarted === "true") return;

    const parsed = parseCountUpValue(element.dataset.countUpTarget || element.textContent || "");
    if (!parsed) return;

    element.dataset.countUpStarted = "true";
    element.dataset.countUpTarget = element.dataset.countUpTarget || element.textContent.trim();
    element.textContent = formatCountUpValue(parsed, 0);

    const isOneDay = parsed.target === 1 && /день/i.test(parsed.suffix);
    const duration = parsed.target === 15 ? 2200 : parsed.target <= 20 ? 1200 : 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (isOneDay && progress < 1) {
        const randomValue = Math.max(2, Math.floor(Math.random() * 9) + 1);
        element.textContent = formatCountUpValue(parsed, randomValue);
      } else {
        element.textContent = formatCountUpValue(parsed, parsed.target * eased);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = formatCountUpValue(parsed, parsed.target);
      }
    };

    requestAnimationFrame(tick);
  };

  if (countUpElements.length) {
    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            animateCountUp(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.35 }
      );

      countUpElements.forEach((element) => countObserver.observe(element));
    } else {
      countUpElements.forEach(animateCountUp);
    }
  }

  const staggerRevealSections = Array.from(document.querySelectorAll("[data-stagger-reveal]"));

  if (staggerRevealSections.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    staggerRevealSections.forEach((section) => {
      const items = Array.from(section.querySelectorAll("[data-stagger-item]"));

      items.forEach((item, index) => {
        item.style.setProperty("--stagger-delay", `${index * 150}ms`);
      });

      const reveal = () => section.classList.add("is-stagger-visible");

      if (reduceMotion) {
        reveal();
        return;
      }

      section.classList.add("is-stagger-ready");

      if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              reveal();
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px",
          }
        );

        revealObserver.observe(section);
      } else {
        reveal();
      }
    });
  }

  const chatRoot = document.querySelector("[data-site-chat]");
  const chatToggle = document.querySelector("[data-chat-toggle]");
  const chatClose = document.querySelector("[data-chat-close]");
  const chatForm = document.querySelector("[data-chat-form]");
  const chatMessages = document.querySelector("[data-chat-messages]");
  const chatStatus = document.querySelector("[data-chat-status]");
  const chatBadge = document.querySelector("[data-chat-badge]");
  const chatTextarea = chatForm?.querySelector("textarea");
  const chatStorageKey = "adamant-site-chat-session";
  const chatLastSeenKey = "adamant-site-chat-last-seen";
  const chatState = {
    sessionId: "",
    messages: [],
    pollTimer: null,
    pollInterval: 0,
    isOpen: false,
    unreadCount: 0,
  };

  const createLocalId = () =>
    `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const getChatSessionId = () => {
    try {
      const existing = window.localStorage.getItem(chatStorageKey);
      if (existing) return existing;

      const next =
        typeof window.crypto?.randomUUID === "function"
          ? window.crypto.randomUUID()
          : createLocalId();
      window.localStorage.setItem(chatStorageKey, next);
      return next;
    } catch {
      return createLocalId();
    }
  };

  const getExistingChatSessionId = () => {
    try {
      return window.localStorage.getItem(chatStorageKey) || "";
    } catch {
      return "";
    }
  };

  const getChatLastSeen = () => {
    try {
      const value = window.localStorage.getItem(chatLastSeenKey);
      return value ? Date.parse(value) : Date.now();
    } catch {
      return Date.now();
    }
  };

  const ensureChatLastSeen = () => {
    try {
      if (!window.localStorage.getItem(chatLastSeenKey)) {
        setChatLastSeen();
      }
    } catch {
      // localStorage can be unavailable in private browser modes.
    }
  };

  const setChatLastSeen = (value = new Date().toISOString()) => {
    try {
      window.localStorage.setItem(chatLastSeenKey, value);
    } catch {
      // localStorage can be unavailable in private browser modes.
    }
  };

  const getLatestManagerMessageDate = (messages = []) => {
    const timestamps = messages
      .filter((message) => message.from === "manager")
      .map((message) => Date.parse(message.createdAt || ""))
      .filter((value) => Number.isFinite(value));

    if (!timestamps.length) {
      return null;
    }

    return new Date(Math.max(...timestamps)).toISOString();
  };

  const updateChatBadge = () => {
    if (!chatBadge) return;

    if (chatState.unreadCount > 0 && !chatState.isOpen) {
      chatBadge.textContent = String(Math.min(chatState.unreadCount, 99));
      chatBadge.hidden = false;
    } else {
      chatBadge.hidden = true;
    }
  };

  const markChatSeen = () => {
    chatState.unreadCount = 0;
    setChatLastSeen(getLatestManagerMessageDate(chatState.messages) || new Date().toISOString());
    updateChatBadge();
  };

  const updateUnreadMessages = () => {
    if (chatState.isOpen) {
      markChatSeen();
      return;
    }

    const lastSeen = getChatLastSeen();
    chatState.unreadCount = chatState.messages.filter((message) => {
      if (message.from !== "manager") return false;

      const createdAt = Date.parse(message.createdAt || "");
      return Number.isFinite(createdAt) && createdAt > lastSeen;
    }).length;
    updateChatBadge();
  };

  const setChatStatus = (message = "", isError = false) => {
    if (!chatStatus) return;

    chatStatus.textContent = message;
    chatStatus.classList.toggle("site-chat__status--error", isError);
  };

  const formatChatTime = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderChatMessages = (messages = []) => {
    if (!chatMessages) return;

    chatMessages.innerHTML = "";

    if (!messages.length) {
      const empty = document.createElement("p");
      empty.className = "site-chat__empty";
      empty.textContent = "Напишите нам, и мы ответим здесь.";
      chatMessages.append(empty);
      return;
    }

    messages.forEach((message) => {
      const item = document.createElement("article");
      const fromManager = message.from === "manager";
      item.className = `site-chat__message ${
        fromManager ? "site-chat__message--manager" : "site-chat__message--visitor"
      }`;

      const bubble = document.createElement("div");
      bubble.className = "site-chat__bubble";
      bubble.textContent = message.text || "";

      const time = document.createElement("time");
      time.dateTime = message.createdAt || "";
      time.textContent = formatChatTime(message.createdAt);

      item.append(bubble, time);
      chatMessages.append(item);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const fetchChatMessages = async () => {
    if (!chatState.sessionId) return;

    const response = await fetch(
      `/api/chat/messages?sessionId=${encodeURIComponent(chatState.sessionId)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Chat messages failed with status ${response.status}`);
    }

    const payload = await response.json();
    chatState.messages = Array.isArray(payload.messages) ? payload.messages : [];
    renderChatMessages(chatState.messages);
    updateUnreadMessages();
  };

  const startChatPolling = (interval = 7000) => {
    if (chatState.pollTimer && chatState.pollInterval === interval) return;

    stopChatPolling();
    chatState.pollInterval = interval;

    fetchChatMessages().catch(() => undefined);
    chatState.pollTimer = window.setInterval(() => {
      fetchChatMessages().catch(() => undefined);
    }, interval);
  };

  const stopChatPolling = () => {
    if (!chatState.pollTimer) return;

    window.clearInterval(chatState.pollTimer);
    chatState.pollTimer = null;
    chatState.pollInterval = 0;
  };

  const openChat = () => {
    if (!chatRoot || !chatToggle) return;

    chatState.sessionId = chatState.sessionId || getChatSessionId();
    chatState.isOpen = true;
    chatRoot.hidden = false;
    document.body.classList.add("is-chat-open");
    chatToggle.classList.add("site-chat-button--active");
    markChatSeen();

    requestAnimationFrame(() => {
      chatRoot.classList.add("site-chat--open");
      chatTextarea?.focus();
    });

    startChatPolling(3000);
  };

  const closeChat = () => {
    if (!chatRoot || !chatToggle) return;

    chatState.isOpen = false;
    chatRoot.classList.remove("site-chat--open");
    document.body.classList.remove("is-chat-open");
    chatToggle.classList.remove("site-chat-button--active");
    markChatSeen();

    if (chatState.sessionId) {
      startChatPolling(7000);
    } else {
      stopChatPolling();
    }

    window.setTimeout(() => {
      if (!chatState.isOpen) {
        chatRoot.hidden = true;
      }
    }, 180);
  };

  chatToggle?.addEventListener("click", () => {
    if (chatState.isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  chatClose?.addEventListener("click", closeChat);

  chatTextarea?.addEventListener("keydown", (event) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.isComposing
    ) {
      return;
    }

    event.preventDefault();

    if (typeof chatForm?.requestSubmit === "function") {
      chatForm.requestSubmit();
      return;
    }

    chatForm?.dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );
  });

  chatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = chatTextarea?.value.trim() ?? "";
    if (!text) return;

    chatState.sessionId = chatState.sessionId || getChatSessionId();
    setChatStatus("Отправляем...");

    const optimisticMessage = {
      id: createLocalId(),
      sessionId: chatState.sessionId,
      from: "visitor",
      text,
      createdAt: new Date().toISOString(),
      page: window.location.pathname,
    };
    chatState.messages = [...chatState.messages, optimisticMessage];
    renderChatMessages(chatState.messages);
    if (chatTextarea) chatTextarea.value = "";

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: chatState.sessionId,
          text,
          page: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat send failed with status ${response.status}`);
      }

      const payload = await response.json();
      chatState.messages = Array.isArray(payload.messages)
        ? payload.messages
        : chatState.messages;
      renderChatMessages(chatState.messages);
      markChatSeen();
      setChatStatus(
        payload.deliveredToTelegram
          ? "Сообщение отправлено."
          : "Сообщение сохранено, но Telegram пока недоступен.",
        !payload.deliveredToTelegram
      );
    } catch {
      setChatStatus("Не удалось отправить сообщение. Попробуйте еще раз.", true);
    }
  });

  chatState.sessionId = getExistingChatSessionId();
  ensureChatLastSeen();
  updateChatBadge();
  if (chatState.sessionId) {
    startChatPolling(7000);
  }

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
  if (productPage && productPage.dataset.cmsProduct !== "true") {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("item") || "modern";
    const source = params.get("source") || "catalog";
    const product = productData[key] || productData.modern;
    const title = productPage.querySelector("[data-product-title]");
    const description = productPage.querySelector("[data-product-description]");
    const tags = productPage.querySelector("[data-product-tags]");
    const backLink = productPage.querySelector(".product-detail__back");
    const backTargets = {
      services: { href: "/services", text: "← Назад к услугам" },
      portfolio: { href: "/portfolio", text: "← Назад к портфолио" },
      catalog: { href: "/catalog", text: "← Назад к каталогу" },
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

  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual) {
    const hero = heroVisual.closest(".hero");
    let heroVisualFrame = 0;

    const isHeroAtTop = () => {
      if (!hero) return window.scrollY < 160;

      const rect = hero.getBoundingClientRect();
      return rect.top > -Math.min(180, window.innerHeight * 0.22);
    };

    const updateHeroVisual = () => {
      heroVisual.classList.toggle("is-light-on", isHeroAtTop());
    };

    const requestHeroVisualUpdate = () => {
      if (heroVisualFrame) return;

      heroVisualFrame = window.requestAnimationFrame(() => {
        heroVisualFrame = 0;
        updateHeroVisual();
      });
    };

    updateHeroVisual();
    window.addEventListener("scroll", requestHeroVisualUpdate, { passive: true });
    window.addEventListener("resize", requestHeroVisualUpdate);
  }

  const houseStage = document.querySelector(".house-stage");
  if (houseStage) {
    const setHouseLight = (isOn) => {
      houseStage.classList.toggle("is-light-on", isOn);
    };

    const hero = houseStage.closest(".hero");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let houseTimers = [];
    let houseIntroState = "idle";
    let houseScrollFrame = 0;

    const isHeroAtTop = () => {
      if (!hero) return window.scrollY < 160;

      const rect = hero.getBoundingClientRect();
      return rect.top > -Math.min(180, window.innerHeight * 0.22);
    };

    const clearHouseTimers = () => {
      houseTimers.forEach((timer) => window.clearTimeout(timer));
      houseTimers = [];
    };

    const startHouseIntro = () => {
      if (houseIntroState === "playing" || houseIntroState === "done") return;

      clearHouseTimers();
      houseIntroState = "playing";
      setHouseLight(false);

      houseTimers = [
        window.setTimeout(() => {
          if (isHeroAtTop()) setHouseLight(true);
        }, 1180),
        window.setTimeout(() => {
          if (isHeroAtTop()) setHouseLight(false);
        }, 1280),
        window.setTimeout(() => {
          houseIntroState = "done";
          setHouseLight(isHeroAtTop());
        }, 1430),
      ];
    };

    const updateHouseForScroll = () => {
      const isAtTop = isHeroAtTop();

      if (!isAtTop) {
        if (houseIntroState === "playing") {
          houseIntroState = "idle";
        }

        clearHouseTimers();
        setHouseLight(false);
        return;
      }

      if (prefersReducedMotion || houseIntroState === "done") {
        setHouseLight(true);
        return;
      }

      startHouseIntro();
    };

    const requestHouseUpdate = () => {
      if (houseScrollFrame) return;

      houseScrollFrame = window.requestAnimationFrame(() => {
        houseScrollFrame = 0;
        updateHouseForScroll();
      });
    };

    updateHouseForScroll();
    window.addEventListener("scroll", requestHouseUpdate, { passive: true });
    window.addEventListener("resize", requestHouseUpdate);
  }

  document.querySelectorAll(".project-tabs").forEach((tabs) => {
    const section = tabs.closest(".section");
    const cards = Array.from(section?.querySelectorAll("[data-category]") || []);
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

  document.querySelectorAll(".js-wheel-slider").forEach((slider) => {
    let animationFrame = 0;
    let targetScrollLeft = slider.scrollLeft;

    const hasHorizontalOverflow = () => slider.scrollWidth > slider.clientWidth + 2;

    const getMaxScroll = () => Math.max(0, slider.scrollWidth - slider.clientWidth);

    const clampScroll = (value) => Math.min(Math.max(value, 0), getMaxScroll());

    const canMove = (delta) => {
      if (!hasHorizontalOverflow()) return false;

      const maxScroll = getMaxScroll();
      const current = slider.scrollLeft;

      return delta > 0 ? current < maxScroll - 2 : current > 2;
    };

    const animateSlider = () => {
      const distance = targetScrollLeft - slider.scrollLeft;

      if (Math.abs(distance) < 0.7) {
        slider.scrollLeft = targetScrollLeft;
        animationFrame = 0;
        return;
      }

      slider.scrollLeft += distance * 0.18;
      animationFrame = window.requestAnimationFrame(animateSlider);
    };

    const scheduleAnimation = () => {
      if (animationFrame) return;

      if (typeof window.requestAnimationFrame === "function") {
        animationFrame = window.requestAnimationFrame(animateSlider);
        return;
      }

      slider.scrollLeft = targetScrollLeft;
    };

    const scrollSliderToTarget = () => {
      if (
        animationFrame &&
        typeof window.cancelAnimationFrame === "function"
      ) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = 0;

      if (typeof slider.scrollTo === "function") {
        try {
          slider.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
          return;
        } catch (error) {
          slider.scrollLeft = targetScrollLeft;
          return;
        }
      }

      slider.scrollLeft = targetScrollLeft;
    };

    slider.addEventListener(
      "wheel",
      (event) => {
        const horizontalDelta = event.deltaX;
        const isHorizontalGesture =
          Math.abs(horizontalDelta) > 4 &&
          Math.abs(horizontalDelta) > Math.abs(event.deltaY) * 1.15;

        if (!isHorizontalGesture || !canMove(horizontalDelta)) {
          return;
        }

        event.preventDefault();
        targetScrollLeft = clampScroll(slider.scrollLeft + horizontalDelta * 0.9);
        scheduleAnimation();
      },
      { passive: false }
    );

    const sliderRoot = slider.closest("[data-home-services-carousel]");
    const prevButton = sliderRoot?.querySelector("[data-slider-prev]");
    const nextButton = sliderRoot?.querySelector("[data-slider-next]");

    const getSlideStep = () => {
      const firstCard = slider.querySelector(".home-card, .home-project-card");
      if (!firstCard) return Math.max(260, slider.clientWidth * 0.78);

      const gap = parseFloat(window.getComputedStyle(slider).columnGap || "0") || 0;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const updateArrowState = () => {
      if (!prevButton || !nextButton) return;

      const maxScroll = getMaxScroll();
      prevButton.disabled = slider.scrollLeft <= 2;
      nextButton.disabled = slider.scrollLeft >= maxScroll - 2;
    };

    const moveByStep = (direction) => {
      targetScrollLeft = clampScroll(slider.scrollLeft + getSlideStep() * direction);
      scrollSliderToTarget();

      window.setTimeout(updateArrowState, 260);
    };

    prevButton?.addEventListener("click", () => moveByStep(-1));
    nextButton?.addEventListener("click", () => moveByStep(1));
    slider.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);
    updateArrowState();
  });

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("[data-slider-prev], [data-slider-next]");
      if (!button || button.hasAttribute("disabled")) return;

      const sliderRoot = button.closest("[data-home-services-carousel]");
      const slider = sliderRoot?.querySelector(".js-wheel-slider");
      if (!slider) return;

      const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
      if (maxScroll <= 2) return;

      const firstCard = slider.querySelector(".home-card, .home-project-card");
      const gap = parseFloat(window.getComputedStyle(slider).columnGap || "0") || 0;
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + gap
        : Math.max(260, slider.clientWidth * 0.78);
      const direction = button.matches("[data-slider-prev]") ? -1 : 1;
      const nextScrollLeft = Math.min(
        Math.max(slider.scrollLeft + step * direction, 0),
        maxScroll
      );
      const prevButton = sliderRoot.querySelector("[data-slider-prev]");
      const nextButton = sliderRoot.querySelector("[data-slider-next]");
      const updateButtons = () => {
        if (prevButton) prevButton.disabled = slider.scrollLeft <= 2;
        if (nextButton) nextButton.disabled = slider.scrollLeft >= maxScroll - 2;
      };

      event.preventDefault();
      event.stopPropagation();

      if (typeof slider.scrollTo === "function") {
        try {
          slider.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
        } catch (error) {
          slider.scrollLeft = nextScrollLeft;
        }
      } else {
        slider.scrollLeft = nextScrollLeft;
      }

      window.setTimeout(updateButtons, 280);
    },
    true
  );

  const modals = Array.from(document.querySelectorAll(".modal"));
  let activeModal = null;
  let previousFocus = null;
  let backdropPointerDownModal = null;

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
    resetModal(modal);
    modal.hidden = false;
    document.body.classList.add("is-modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("modal--open");
      focusModalForm(modal);
    });
  };

  const openEstimateModal = (trigger) => {
    openModal("estimate-modal");
    setEstimateService(getEstimateServiceFromTrigger(trigger));
  };

  const openCallbackModal = () => {
    openModal("callback-modal");
  };

  const openMessageModal = () => {
    openModal("message-modal");
  };

  const closeModal = () => {
    if (!activeModal) return;

    activeModal.classList.remove("modal--open");
    activeModal.hidden = true;
    document.body.classList.remove("is-modal-open");

    const status = activeModal.querySelector(".modal-form__status");
    if (status) status.textContent = "";

    resetModal(activeModal);

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }

    activeModal = null;
    previousFocus = null;
  };

  document.addEventListener("click", (event) => {
    const messageTrigger = event.target.closest(".js-open-message");
    if (messageTrigger) {
      event.preventDefault();
      openMessageModal();
      return;
    }

    const callbackTrigger = event.target.closest(".js-open-callback");
    if (callbackTrigger) {
      event.preventDefault();
      openCallbackModal();
      return;
    }

    const estimateTrigger = event.target.closest(".js-open-estimate");
    if (estimateTrigger) {
      event.preventDefault();
      openEstimateModal(estimateTrigger);
      return;
    }

    const phoneTrigger = event.target.closest(".phone");
    if (phoneTrigger) {
      event.preventDefault();
      openCallbackModal();
      return;
    }

    const retryTrigger = event.target.closest("[data-modal-retry]");
    if (retryTrigger) {
      event.preventDefault();
      const modal = retryTrigger.closest(".modal");
      setModalState(modal, "form");
      requestAnimationFrame(() => focusModalForm(modal));
      return;
    }

    if (event.target.closest("[data-modal-close]")) {
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
    modal.addEventListener("pointerdown", (event) => {
      backdropPointerDownModal = event.target === modal ? modal : null;
    });

    modal.addEventListener("pointerup", (event) => {
      if (event.target === modal && backdropPointerDownModal === modal) {
        closeModal();
      }

      backdropPointerDownModal = null;
    });

    modal.addEventListener("pointercancel", () => {
      backdropPointerDownModal = null;
    });

    const form = modal.querySelector(".modal-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = form.querySelector(".modal-form__status");
      const submitButton = form.querySelector('[type="submit"]');
      const formData = new FormData(form);
      const formKind = form.dataset.formKind;
      const requestType =
        formKind === "callback" ? "callback" : formKind === "message" ? "message" : "estimate";
      const usesResultState =
        modal.id === "estimate-modal" || modal.id === "callback-modal" || modal.id === "message-modal";
      const photoFiles = requestType === "estimate" ? getRequestPhotoFiles(formData) : [];
      const photoError = requestType === "estimate" ? validateRequestPhotoFiles(photoFiles) : "";

      if (photoError) {
        setStatusMessage(status, photoError, true);
        return;
      }

      if (submitButton) submitButton.disabled = true;
      setStatusMessage(status, "Отправляем...");

      try {
        await submitRequest({
          requestType,
          name: readFieldValue(formData, "name"),
          phone: readFieldValue(formData, "phone"),
          email: readFieldValue(formData, "email"),
          service: readFieldValue(formData, "service"),
          message: buildRequestMessageValue(formData),
          sourcePage: window.location.pathname,
          photos: photoFiles,
        });

        form.reset();
        if (usesResultState) {
          setModalState(modal, "success");
        } else {
          setStatusMessage(
            status,
            requestType === "callback"
              ? "Заявка на звонок отправлена."
              : requestType === "message"
                ? "Сообщение отправлено."
              : "Заявка отправлена."
          );
        }
      } catch {
        if (usesResultState) {
          setModalState(modal, "error");
        } else {
          setStatusMessage(
            status,
            "Не удалось отправить заявку. Попробуйте еще раз.",
            true
          );
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      let status = form.querySelector(".contact-form__status");
      if (!status) {
        status = document.createElement("p");
        status.className = "contact-form__status";
        status.setAttribute("aria-live", "polite");
        form.append(status);
      }

      const submitButton = form.querySelector('[type="submit"]');
      const formData = new FormData(form);

      if (submitButton) submitButton.disabled = true;
      setStatusMessage(status, "Отправляем...");

      try {
        await submitRequest({
          requestType: "estimate",
          name: readFieldValue(formData, "name"),
          phone: readFieldValue(formData, "phone"),
          email: readFieldValue(formData, "email"),
          service: readFieldValue(formData, "service"),
          message: readFieldValue(formData, "message"),
          sourcePage: window.location.pathname,
        });

        form.reset();
        setStatusMessage(status, "Сообщение отправлено.");
      } catch {
        setStatusMessage(
          status,
          "Не удалось отправить сообщение. Попробуйте еще раз.",
          true
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });
})();
