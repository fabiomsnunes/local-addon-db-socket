# Local DB Socket

A [Local](https://localwp.com/) add-on that automatically patches `wp-config.php` on site start so you can run `wp` commands from **any terminal** — VS Code, iTerm, Claude Code, anything — without having to open Local's "Site Shell".

## The Problem

Local runs each site's MySQL on a unique Unix socket, but the generated `wp-config.php` ships with `define( 'DB_HOST', 'localhost' );`. A globally installed WP-CLI can't find the database from a normal terminal — it only works inside Local's "Open Site Shell", which breaks integration with your editor and other CLI tools.

## The Solution

On every `siteStarted` event, this add-on replaces the `DB_HOST` line in your site's `wp-config.php` with the correct socket path:

**Before:**

```php
define( 'DB_HOST', 'localhost' );
```

**After:**

```php
define( 'DB_HOST', 'localhost:/Users/you/Library/Application Support/Local/run/<site-id>/mysql/mysqld.sock' );
```

One line changed, zero configuration, no UI. It runs silently in the background every time a site starts, so the socket path stays correct even if Local's internal paths change.

## Requirements

- **Local** 6.5.2 or newer
- **WP-CLI installed on your system** — e.g. `brew install wp-cli` on macOS, or the [official Phar install](https://wp-cli.org/#installing). This add-on does **not** install WP-CLI for you; it only makes the one you already have able to reach Local's database from a normal terminal.

## Installation — From GitHub Release (recommended)

No Node.js required — the release zip is pre-built.

1. Download `local-addon-db-socket.zip` from the [latest release](../../releases/latest).
2. Extract it into Local's add-ons directory:

   | OS      | Path                                                              |
   | ------- | ----------------------------------------------------------------- |
   | macOS   | `~/Library/Application Support/Local/addons/local-addon-db-socket` |
   | Windows | `%APPDATA%\Local\addons\local-addon-db-socket`                    |
   | Linux   | `~/.config/Local/addons/local-addon-db-socket`                    |

3. Restart Local.

## Installation — From Source

Requires **Node.js 20+**.

```bash
git clone https://github.com/<your-user>/local-addon-db-socket.git
cd local-addon-db-socket
npm install
npm run build
```

Then symlink (or copy) the project into Local's add-ons directory — see the paths in the table above.

## Usage

1. Start a site in Local.
2. Open any terminal, `cd` into the site:

   ```bash
   cd ~/Local\ Sites/my-site/app/public
   wp option get siteurl
   ```

3. It just works.

## Important Notes

- **The site must be running in Local** — MySQL is only accessible while Local has the site started. If you stop the site, `wp` commands will fail until you start it again.
- **Remember to update `DB_HOST` when deploying to production.** The patched value contains a local socket path specific to your machine and won't work on a remote server. This is no different from updating `DB_NAME`, `DB_USER`, or `DB_PASSWORD` for a live environment — you were going to change those anyway.
- **Silent by design.** The add-on has no UI, no notifications, and no settings. If something goes wrong (e.g. `wp-config.php` is missing or has an unusual format), it fails silently and the file is left untouched.

## How It Works

The add-on hooks into Local's `siteStarted` action. On each start it:

1. Builds the socket path: `{Local data dir}/run/{site.id}/mysql/mysqld.sock`
2. Reads `{site path}/app/public/wp-config.php`
3. Runs a regex replace over the `define( 'DB_HOST', ... );` line
4. Writes the file back

The regex handles flexible whitespace and both single- and double-quoted strings. Because it runs on every start and matches the already-patched line as well, the file stays consistent even across Local updates.

## License

MIT
