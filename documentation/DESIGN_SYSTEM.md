# Academic Precision Design System

Academic Precision is the visual foundation for the LMS. It is professional, reliable, and encouraging: the interface should make academic progress easy to scan and act on without competing with study content.

## Principles

- Use restrained surfaces, clear hierarchy, and generous whitespace to reduce cognitive load.
- Use Scholastic Blue for primary navigation and the principal action on a screen.
- Use Growth Green only for success, completion, and positive progress feedback.
- Use tonal layers and low-contrast outlines for structure. Resting cards do not use shadows.
- Preserve a clear distinction between student, instructor, and admin workflows with concise text-based role indicators.

## Color Tokens

Use semantic token names in components. Do not select a color based only on its hex value; this keeps intent consistent when the theme evolves.

### Surfaces and Content

| Token                       | Value     | Intended use                                   |
| --------------------------- | --------- | ---------------------------------------------- |
| `background`                | `#f7f9ff` | App canvas and screen background               |
| `surface`                   | `#f7f9ff` | Default neutral surface                        |
| `surface-dim`               | `#d7dae0` | De-emphasized surface                          |
| `surface-bright`            | `#f7f9ff` | Bright neutral surface                         |
| `surface-container-lowest`  | `#ffffff` | Cards and input surfaces                       |
| `surface-container-low`     | `#f1f4fa` | Low-emphasis grouped content                   |
| `surface-container`         | `#ebeef4` | Standard grouped content                       |
| `surface-container-high`    | `#e5e8ee` | Header or selected container surface           |
| `surface-container-highest` | `#dfe3e8` | Strongest neutral container                    |
| `surface-variant`           | `#dfe3e8` | Alternate neutral surface                      |
| `on-surface`                | `#181c20` | Primary text and icons                         |
| `on-surface-variant`        | `#414754` | Secondary text, metadata, and supporting icons |
| `inverse-surface`           | `#2d3135` | Inverse surfaces such as dark feedback areas   |
| `inverse-on-surface`        | `#eef1f7` | Content on inverse surfaces                    |
| `outline`                   | `#727785` | High-emphasis borders and inactive controls    |
| `outline-variant`           | `#c1c6d6` | Default dividers and card borders              |

### Brand and Status Colors

| Token                        | Value     | Intended use                                        |
| ---------------------------- | --------- | --------------------------------------------------- |
| `primary`                    | `#005bbf` | Main actions, active navigation, links, focus state |
| `on-primary`                 | `#ffffff` | Content on `primary`                                |
| `primary-container`          | `#1a73e8` | Strong blue selected or featured area               |
| `on-primary-container`       | `#ffffff` | Content on `primary-container`                      |
| `primary-fixed`              | `#d8e2ff` | Non-adaptive blue supporting surface                |
| `primary-fixed-dim`          | `#adc7ff` | Stronger fixed blue supporting surface              |
| `on-primary-fixed`           | `#001a41` | Content on `primary-fixed`                          |
| `on-primary-fixed-variant`   | `#004493` | Secondary content on fixed primary surfaces         |
| `inverse-primary`            | `#adc7ff` | Primary action on inverse surfaces                  |
| `surface-tint`               | `#005bc0` | Surface tint and blue emphasis                      |
| `secondary`                  | `#006e2c` | Completed work, success, and positive progress      |
| `on-secondary`               | `#ffffff` | Content on `secondary`                              |
| `secondary-container`        | `#86f898` | Positive status chip or completion surface          |
| `on-secondary-container`     | `#00722f` | Content on `secondary-container`                    |
| `secondary-fixed`            | `#89fa9b` | Non-adaptive positive surface                       |
| `secondary-fixed-dim`        | `#6ddd81` | Stronger fixed positive surface                     |
| `on-secondary-fixed`         | `#002108` | Content on `secondary-fixed`                        |
| `on-secondary-fixed-variant` | `#005320` | Secondary content on fixed positive surfaces        |
| `tertiary`                   | `#9e4300` | Caution, urgent deadlines, or warm subject accent   |
| `on-tertiary`                | `#ffffff` | Content on `tertiary`                               |
| `tertiary-container`         | `#c55500` | Strong tertiary container                           |
| `on-tertiary-container`      | `#0e0200` | Content on `tertiary-container`                     |
| `tertiary-fixed`             | `#ffdbcb` | Non-adaptive tertiary supporting surface            |
| `tertiary-fixed-dim`         | `#ffb691` | Stronger fixed tertiary surface                     |
| `on-tertiary-fixed`          | `#341100` | Content on `tertiary-fixed`                         |
| `on-tertiary-fixed-variant`  | `#783100` | Secondary content on fixed tertiary surfaces        |
| `error`                      | `#ba1a1a` | Validation, destructive actions, and failure states |
| `on-error`                   | `#ffffff` | Content on `error`                                  |
| `error-container`            | `#ffdad6` | Error message and validation surface                |
| `on-error-container`         | `#93000a` | Content on `error-container`                        |

## Typography

Use Inter throughout the app once the font is bundled and loaded. Until then, do not silently substitute a device font in a way that changes metrics; add the font setup before applying explicit `fontFamily: 'Inter'` styles broadly.

| Token                | Font size | Weight | Line height | Use                                   |
| -------------------- | --------: | -----: | ----------: | ------------------------------------- |
| `display`            |        32 |    700 |          40 | Screen-level, high-priority title     |
| `headline-lg`        |        24 |    600 |          32 | Primary screen or course heading      |
| `headline-lg-mobile` |        22 |    600 |          28 | Compact mobile heading                |
| `headline-md`        |        20 |    600 |          28 | Section heading or lesson title       |
| `body-lg`            |        16 |    400 |          24 | Long-form lesson content              |
| `body-md`            |        14 |    400 |          20 | Supporting content and metadata       |
| `label-lg`           |        14 |    500 |          20 | Button, navigation, and control label |
| `label-md`           |        12 |    500 |          16 | Compact status and role label         |

Do not use negative letter spacing. For React Native, use the supplied label letter spacing only where it improves compact control labels: `0.1` for `label-lg` and `0.5` for `label-md`.

## Spacing and Shape

The base unit is 4 px. Keep layouts on this scale, using 8 px as the default vertical rhythm.

| Token           | Value | Intended use                              |
| --------------- | ----: | ----------------------------------------- |
| `xs`            |     4 | Tight icon or label spacing               |
| `sm`            |     8 | Small gaps and compact stacks             |
| `md`            |    16 | Card padding and standard content spacing |
| `lg`            |    24 | Separation between content blocks         |
| `xl`            |    32 | Major section separation                  |
| `margin-mobile` |    16 | Screen edge margin                        |
| `gutter-mobile` |    12 | Mobile grid gutter                        |

Use 8 px (`DEFAULT`) for buttons, inputs, and cards. Use 4 px (`sm`) for small selection indicators. Reserve 24 px (`xl`) for featured course banners and modal containers. Every interactive control must provide a minimum 44 by 44 px touch target, even when its visible icon or label is smaller.

## Layout and Elevation

Screens use a mobile-first four-column fluid grid with 16 px horizontal margins and 12 px internal gutters. Maintain `lg` spacing between modules and `md` spacing inside a module.

| Level | Surface treatment                                               | Use                                   |
| ----- | --------------------------------------------------------------- | ------------------------------------- |
| 0     | `background`                                                    | Main screen canvas                    |
| 1     | `surface-container-lowest` with a 1 px `outline-variant` border | Cards, modules, inputs                |
| 2     | Elevated surface with `0px 4px 12px rgba(0, 0, 0, 0.08)` shadow | Bottom sheets, modal containers, FABs |

Prefer a tonal surface change to a shadow when separating content. Borders should define structure quietly and should never dominate readable content.

## Component Rules

### Buttons

- Primary actions use `primary` with `on-primary` text. Limit each screen or focused panel to one dominant primary action.
- Secondary actions use a transparent background with a `primary` outline and `primary` content.
- Destructive actions use `error` and `on-error` only when the action is irreversible or materially harmful.

### Inputs

- Use `surface-container-low` as the field surface and keep the label visible.
- Use a bottom `outline-variant` border by default.
- On focus, change the bottom border to 2 px `primary` and ensure the focused state is visible without relying only on color.

### Cards and Course Modules

- Use `surface-container-lowest`, an `outline-variant` border, 8 px corners, and no resting shadow.
- Add a thin subject-category accent along the top edge when it helps learners distinguish courses quickly.
- Place a 4 px progress bar at the bottom: `secondary` for completed progress and a light neutral surface for the track.

### Status and Roles

- Chips use a subtle semantic container color with its matching `on-*-container` text color.
- Use `secondary-container` for complete or submitted success states, `tertiary` colors for due-soon emphasis, and `error-container` for failed or invalid states.
- Role indicators are compact text badges using `label-md`; they must remain understandable without color alone.

## Accessibility and Implementation Notes

- Pair every foreground token with its specified `on-*` token. Do not use `on-surface-variant` for essential instructional content.
- Communicate status with text, icons, or labels in addition to color.
- Support system font scaling and avoid fixed-height text containers that can clip enlarged type.
- Respect safe-area insets on every screen and keep meaningful content within the 16 px mobile margin.
- Use these values through a shared TypeScript theme object when implementation begins; screens and components should consume semantic tokens instead of declaring raw color values.
