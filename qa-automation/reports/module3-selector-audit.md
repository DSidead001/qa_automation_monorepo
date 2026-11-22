# Аудит локаторів і DOM Tasteorama

## Крок 2. Пріоритет атрибутів: форма входу

| Елемент | Доступні атрибути | Пріоритет за шкалою | Обраний локатор | Обґрунтування |
| --- | --- | --- | --- | --- |
| Поле Email | `id="email"`, `name="email"`, `type="email"`, `placeholder="email@gmail.com"`, `class` | 2 — id | `#email` | У розмітці немає `data-testid`, тому беремо найвищий доступний пріоритет — унікальний `id`. |
| Поле пароля | `id="password"`, `name="password"`, `type="password"`, `placeholder="*********"`, `class` | 2 — id | `#password` | Так само немає `data-testid`, а `id="password"` унікальний на сторінці й не прив'язаний до верстки. |
| Кнопка входу | `type="submit"`, `class="LoginPage-module_LoginBtn_asHm3"` | 4 — атрибут (`type` / `name`) | `button[type="submit"]` | У кнопки немає `data-testid`, `id` та `aria-label` (пункти 1–3 шкали), тому беремо семантичний атрибут `type="submit"` замість хешованого класу CSS-модуля. |

## Крок 3. DOM-дерево карток рецептів: три питання і комбінатор

**Чекліст читання дерева для кнопки збереження рецепта:**
- **Скільки однакових сусідів:** на головній сторінці 12 карток `<article>`, у кожній лежить однакова кнопка збереження (`data-testid="Save recipe button"`, `aria-label="Save recipe"`).
- **Найближчий унікальний предок:** сама картка `<article>` (її можна відрізнити від сусідніх за текстом у `p[data-testid="Recipe title"]` або `alt` картинки).
- **Пряма дитина чи глибший нащадок:** глибший нащадок — кнопка лежить на 3-му рівні всередині картки (`article` -> `div.RecipeCard-module_content_wLwa6` -> `div.RecipeCard-module_buttons_Zb0V1` -> `button`).

| Пара | Комбінатор | Перевірка в Console | Результат |
| --- | --- | --- | --- |
| `article` -> назва рецепта | пробіл (нащадок), не `>` | `document.querySelectorAll('article > p[data-testid="Recipe title"]').length` -> `0`; `document.querySelectorAll('article p[data-testid="Recipe title"]').length` -> `12` | Назва `<p data-testid="Recipe title">` обгорнута у два `div`, тому `>` не спрацьовує, потрібен пробіл. |
| `article` -> кнопка збереження | пробіл (нащадок), не `>` | `document.querySelectorAll('article > button[data-testid="Save recipe button"]').length` -> `0`; `document.querySelectorAll('article button[data-testid="Save recipe button"]').length` -> `12` | Кнопка вкладена в `div.RecipeCard-module_buttons_Zb0V1`, а `data-testid` потрібен, щоб не зачепити другу кнопку «Learn more» (без нього `article button` дає 24). |
| `form` -> кнопка пошуку на головній (додатково) | `>` (прямий нащадок) | `document.querySelectorAll('form > button[data-testid="Search button"]').length` -> `1`; `document.querySelectorAll('form button[data-testid="Search button"]').length` -> `1` | Кнопка пошуку лежить прямо всередині `<form>`, тут `>` підходить і точно фіксує рівень вкладеності. |

## Крок 4. DevTools-діагностика: сценарій «неправильний пароль»

- **Умова появи:** сабміт форми входу (`/auth/login`) з `goit@gmail.com` і неправильним паролем.
- **Селектор спливного сповіщення:** `[role="alert"]`
- **Перевірка унікальності (`.length` поки тост на екрані):** `1`
- **Що в Console:** червона помилка мережі `POST http://localhost:4040/api/auth/login 401 (Unauthorized)` (`operations.js:10`), жовтих ворнінгів немає.
- **Дані з Network (порт 4040):**
  - **Запит:** `POST http://localhost:4040/api/auth/login`
  - **Статус-код:** `401 Unauthorized`
  - **Час виконання:** `238.68 ms`

## Крок 5. CSS-селектори реєстрації: атрибути, комбінатори, псевдокласи

1. **Поля пароля на `/auth/register`:**
   - `$$('input[type="password"]').length` -> `2` (чіпляє і основний пароль, і повтор пароля).
   - Звузив через `id`: `$$('#password').length` -> `1` (та `$$('#repeatPassword').length` -> `1` для підтвердження).

2. **Прямий нащадок для чекбокса всередині `label`:**
   - `$$('label > input[type="checkbox"]').length` -> `1`

3. **Сусідній елемент одразу після чекбокса:**
   - `$$('input[type="checkbox"] + span').length` -> `1`

4. **Псевдоклас `:checked` для чекбокса:**
   - До кліку: `$$('input[type="checkbox"]:checked').length` -> `0`
   - Після кліку: `$$('input[type="checkbox"]:checked').length` -> `1`

5. **Псевдоклас `:disabled` на головній (`/`):**
   - `$$('button:disabled').length` -> `2` (при відкритій панелі фільтрів без активних умов неактивні дві кнопки: «Reset filters» та стрілка попередньої сторінки пагінації).
   - Звузив до кнопки пагінації: `$$('button[aria-label="previous page"]:disabled').length` -> `1` (звуження `2 -> 1`).

## Підсумкова таблиця

| Елемент | Сторінка | Обраний CSS-селектор | Чому саме він |
| --- | --- | --- | --- |
| Поле Email | `/auth/login` | `#email` | Унікальний `id`, найвищий доступний пріоритет без `data-testid`. |
| Поле пароля (вхід) | `/auth/login` | `#password` | Унікальний `id`, не залежить від стилів чи плейсхолдера. |
| Кнопка входу | `/auth/login` | `button[type="submit"]` | Атрибут `type` (пріоритет 4) стабільніший за згенерований клас CSS-модуля. |
| Назва рецепта в картці | `/` | `article p[data-testid="Recipe title"]` | Пробіл знаходить вкладений `<p>` усередині картки (12 штук на сторінці). |
| Кнопка збереження рецепта | `/` | `article button[data-testid="Save recipe button"]` | Пробіл потрібен через вкладеність, а `data-testid` відділяє її від кнопки «Learn more». |
| Сповіщення про помилку входу | `/auth/login` | `[role="alert"]` | Семантичний атрибут, унікально знаходить тост (`length === 1`) під час показу. |
| Поле основного пароля | `/auth/register` | `#password` | Вирішує дубль `input[type="password"]`, який повертає 2 інпути. |
| Поле повторного пароля | `/auth/register` | `#repeatPassword` | Унікальний `id` другого інпуту пароля, однозначно виділяє поле підтвердження. |
| Чекбокс погодження з умовами | `/auth/register` | `label > input[type="checkbox"]` | Прямий нащадок чітко прив'язує інпут до свого `label` (стан перевіряється через `:checked`). |
| Кнопка попередньої сторінки (неактивна) | `/` | `button[aria-label="previous page"]:disabled` | Поєднує `aria-label` та `:disabled` для точної перевірки стану (`2 -> 1` при звуженні). |