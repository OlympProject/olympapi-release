# OlympAPI Test Scenarios

64 manual test scenarios for OlympAPI workflows and the local OlympAPI test server.

**Test-App:** OlympAPI Desktop App  
**Test-Workspace:** `OlympAPI Manual Test`  
**Test-Folder:** Create a local folder `C:\Temp\OlympAPIManualTest` or `~/OlympAPIManualTest` with subfolders `exports`, `imports`, `uploads`, `git-remote`.

**Prepare Data:**

- Start the test server from `OlympAPI/test-server`.
- HTTP base URL: `http://localhost:3000`
- HTTPS base URL: `https://localhost:3443`
- Create an environment `Test Server` with `BASE_URL = http://localhost:3000`.
- For SSL scenarios, generate certificates with `npm run gen-certs` and restart the test server.
- For proxy scenarios, start the proxy with `npm run proxy` on port `3001`.
- Prepare one small text file in `uploads/sample.txt` and one binary file in `uploads/sample.bin`.
- For Git Sync scenarios, prepare an empty GitHub, Gitea, or Forgejo repository and a PAT with repository write access.

---

## Scenario 01 - First Launch + App Shell

**Feature:** App starts, custom shell, request workspace and status bar are visible  
**Setup:** Start OlympAPI

**Steps:**
1. Start the app
2. Check the top window bar
3. Check sidebar, request panel, response panel and bottom status bar
4. Open Settings

**Expected:**
- App starts without crashing
- Top bar shows OlympAPI, window controls, settings and theme toggle
- Sidebar, request editor and response panel are visible
- Bottom status bar shows workspace, proxy/cookie/layout state

**What to check:** Shell layout is stable, no overlapping UI, keyboard and mouse navigation work

---

## Scenario 02 - Environment Variable GET

**Feature:** GET request with environment variable in URL  
**Setup:** Environment `Test Server` is active

**Steps:**
1. Create a new request
2. Set method `GET`
3. Set URL `{{BASE_URL}}/health`
4. Send the request

**Expected:**
- Response status is `200 OK`
- Body contains `status`, `version`, `uptime` and `timestamp`
- URL variable resolves to `http://localhost:3000`

**What to check:** Environment variables resolve before the request is sent

---

## Scenario 03 - POST JSON Body

**Feature:** Raw JSON request body

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/body/json`
3. Body -> Raw -> JSON:
   ```json
   { "name": "Alice", "age": 30 }
   ```
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains `received.name = Alice` and `received.age = 30`
- Response reports type `application/json`

**What to check:** JSON body is sent with correct content type and preserved key order where possible

---

## Scenario 04 - PUT Method

**Feature:** PUT request method

**Steps:**
1. Set method `PUT`
2. Set URL `{{BASE_URL}}/echo`
3. Send

**Expected:**
- Response status is `200 OK`
- Body contains `"method": "PUT"`
- Echo response includes URL, headers, query and timestamp

**What to check:** Method selection maps to the actual HTTP method

---

## Scenario 05 - PATCH Method

**Feature:** PATCH request method

**Steps:**
1. Set method `PATCH`
2. Set URL `{{BASE_URL}}/echo`
3. Send

**Expected:**
- Response status is `200 OK`
- Body contains `"method": "PATCH"`

**What to check:** PATCH requests execute without falling back to POST or PUT

---

## Scenario 06 - DELETE Method

**Feature:** DELETE request method

**Steps:**
1. Set method `DELETE`
2. Set URL `{{BASE_URL}}/echo`
3. Send

**Expected:**
- Response status is `200 OK`
- Body contains `"method": "DELETE"`

**What to check:** DELETE request is sent without an unexpected body

---

## Scenario 07 - HEAD Method

**Feature:** HEAD response without body

**Steps:**
1. Set method `HEAD`
2. Set URL `{{BASE_URL}}/echo`
3. Send

**Expected:**
- Response status is `200 OK`
- Body panel is empty
- Response headers are visible

**What to check:** Empty body is rendered as an empty response, not as an error

---

## Scenario 08 - OPTIONS Method

**Feature:** OPTIONS/CORS preflight request

**Steps:**
1. Set method `OPTIONS`
2. Set URL `{{BASE_URL}}/echo`
3. Send

**Expected:**
- Response status is `200 OK`
- `Allow` header lists supported methods
- Body contains an allowed-methods array

**What to check:** Headers and body remain visible for OPTIONS responses

---

## Scenario 09 - Query Parameters

**Feature:** Query parameter editor

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/params`
3. Add query params `name=Alice` and `page=1`
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains received params `name` and `page`
- URL preview includes both query parameters

**What to check:** Query params are URL-encoded and synchronized with the URL

---

## Scenario 10 - Missing Required Query Params

**Feature:** Error response display

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/params/required`
3. Do not add query parameters
4. Send

**Expected:**
- Response status is `400 Bad Request`
- Body contains missing keys `name` and `page`
- Error response is still shown in the response panel

**What to check:** 4xx responses are displayed as valid responses, not transport failures

---

## Scenario 11 - Custom Header

**Feature:** Request header editor

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/headers/required`
3. Add header `X-Custom-Header: hello-from-olympapi`
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains received header `x-custom-header`

**What to check:** Custom headers are sent in lowercase/normalized form by the server

---

## Scenario 12 - URL Encoded Form Body

**Feature:** `application/x-www-form-urlencoded` body

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/body/form`
3. Body -> Form URL Encoded: `username=alice`, `password=secret`
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains both form fields
- Response reports type `application/x-www-form-urlencoded`

**What to check:** Form fields are encoded and sent with the correct content type

---

## Scenario 13 - Body Validation Error

**Feature:** Server validation error handling

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/body/validate`
3. Body -> Raw -> JSON:
   ```json
   { "name": "Alice" }
   ```
4. Send

**Expected:**
- Response status is `422 Unprocessable Entity`
- Body contains missing field `email`

**What to check:** Validation errors remain readable and syntax-highlighted

---

## Scenario 14 - Bearer Token Auth

**Feature:** Bearer token authentication

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/auth/bearer`
3. Auth -> Bearer Token: `test-token-123`
4. Send
5. Repeat with a wrong token

**Expected:**
- Correct token returns `200 OK`
- Body contains `authenticated: true` and `method: bearer`
- Wrong token returns `401 Unauthorized`

**What to check:** Auth tab writes the Authorization header only for the active request

---

## Scenario 15 - Basic Auth

**Feature:** HTTP Basic authentication

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/auth/basic`
3. Auth -> Basic Auth: username `admin`, password `password123`
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains `authenticated: true`, `method: basic`, `user: admin`

**What to check:** Basic auth value is encoded and not shown in response logs as plain password

---

## Scenario 16 - API Key Header Auth

**Feature:** API key authentication in header

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/auth/apikey`
3. Auth -> API Key: key `X-API-Key`, value `api-key-xyz`, location Header
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains `authenticated: true` and `method: apikey`

**What to check:** API key header is sent only once and does not duplicate manual headers

---

## Scenario 17 - API Key Query Auth

**Feature:** API key authentication in query string

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/auth/apikey`
3. Auth -> API Key: key `api_key`, value `api-key-xyz`, location Query Params
4. Send

**Expected:**
- Response status is `200 OK`
- URL preview includes `api_key=api-key-xyz`

**What to check:** Query-auth values are encoded and visible in the final URL preview

---

## Scenario 18 - Pre-Request Script Header

**Feature:** Pre-request script mutates headers

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/debug/echo`
3. Script -> Pre-request:
   ```javascript
   request.headers["X-Script-Header"] = "set-by-script";
   ```
4. Send

**Expected:**
- Response status is `200 OK`
- Echo body contains `x-script-header: set-by-script`

**What to check:** Script mutation is applied before sending

---

## Scenario 19 - Pre-Request Script Environment Variable

**Feature:** Pre-request script updates active environment

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/health`
3. Script -> Pre-request:
   ```javascript
   pm.environment.set("DYNAMIC_KEY", "script-value-123");
   ```
4. Send
5. Open the active environment

**Expected:**
- Response status is `200 OK`
- Environment contains `DYNAMIC_KEY = script-value-123`

**What to check:** Environment changes persist after request execution

---

## Scenario 20 - Request Chaining Login

**Feature:** Save response values into environment

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/auth/login`
3. Body JSON: `{ "username": "demo", "password": "demo123" }`
4. Chain rules: `$.token -> JWT_TOKEN`, `$.userId -> USER_ID`
5. Send

**Expected:**
- Response contains token and userId
- Active environment contains `JWT_TOKEN` and `USER_ID`

**What to check:** JSONPath extraction and environment writes work together

---

## Scenario 21 - Request Chaining Follow-Up

**Feature:** Use chained variables in a second request

**Setup:** Scenario 20 has stored `JWT_TOKEN` and `USER_ID`

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/users/{{USER_ID}}`
3. Add header `Authorization: Bearer {{JWT_TOKEN}}`
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains user `user-42`

**What to check:** Chained variables resolve in both URL and headers

---

## Scenario 22 - Response Test Status Code

**Feature:** Response test for status code

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/status/201`
3. Tests -> add `Status Code == 201`
4. Send

**Expected:**
- Response status is `201`
- Test result is green

**What to check:** Response tests run after each response

---

## Scenario 23 - Response Test Body Contains

**Feature:** Response test for body text

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/data/users`
3. Tests -> add `Body contains "Alice"`
4. Send

**Expected:**
- Test result is green
- Body contains user `Alice`

**What to check:** Test matching uses the full response body

---

## Scenario 24 - Response Test Time and Header

**Feature:** Response tests for timing and headers

**Steps:**
1. Set method `GET`
2. Set URL `{{BASE_URL}}/delay/100`
3. Add test `Response Time < 500 ms`
4. Add test `Header content-type contains json`
5. Send

**Expected:**
- Both tests are green
- Response time is roughly 100 ms

**What to check:** Multiple tests can pass on the same response

---

## Scenario 25 - OpenAPI Import

**Feature:** Import Swagger/OpenAPI JSON

**Steps:**
1. Sidebar -> Import
2. Enter URL `http://localhost:3000/swagger.json`
3. Keep default import options
4. Import into Collections

**Expected:**
- Collection `OlympAPI Test Server` is created
- Endpoints appear as requests
- Methods, paths, descriptions and response tests are imported

**What to check:** Import creates usable requests, not only static documentation

---

## Scenario 26 - OpenAPI Environment Variables

**Feature:** Create environment variables during OpenAPI import

**Steps:**
1. Sidebar -> Import
2. Enter URL `http://localhost:3000/swagger.json`
3. Enable `Create environment variables`
4. Import
5. Open the environment selector

**Expected:**
- Workspace-scoped environment is created
- Variables include `BASE_URL` and `BASE_URL_SSL`
- Imported requests use variables instead of raw URLs

**What to check:** Generated environment is active and scoped to the current workspace

---

## Scenario 27 - OpenAPI Import Without Tests

**Feature:** Disable automatic response test import

**Steps:**
1. Sidebar -> Import
2. Enter URL `http://localhost:3000/swagger.json`
3. Disable `Import response tests`
4. Import
5. Open `GET /health`

**Expected:**
- Request has no generated response tests
- Method, URL, headers and query data are still imported

**What to check:** Optional response tests do not affect core request import

---

## Scenario 28 - OpenAPI Path Grouping

**Feature:** Group requests by URL path

**Steps:**
1. Import `http://localhost:3000/swagger.json`
2. Choose Path grouping
3. Enable categorize by path and group same-path root requests
4. Import

**Expected:**
- Requests are grouped by URL segment
- Multiple methods on `/echo` land in an `echo` folder
- Unique root paths remain in a predictable folder

**What to check:** Grouping mirrors URL structure without losing requests

---

## Scenario 29 - OpenAPI Tag Grouping

**Feature:** Group requests by OpenAPI tags

**Steps:**
1. Import `http://localhost:3000/swagger.json`
2. Choose Tags + Path
3. Disable `Include path folders under tags`
4. Import

**Expected:**
- Top-level folders match tags such as Auth, Body and Status
- Untagged endpoints land under Untagged

**What to check:** Tag-only grouping creates a readable collection tree

---

## Scenario 30 - OpenAPI Tags + Path Grouping

**Feature:** Group requests by tag and path

**Steps:**
1. Import `http://localhost:3000/swagger.json`
2. Choose Tags + Path
3. Enable `Include path folders under tags`
4. Import

**Expected:**
- Example `/auth/bearer` appears as Auth -> Bearer -> Request
- Duplicate folder names are avoided when tag equals the first path segment

**What to check:** Tag/path nesting is useful and does not duplicate folders

---

## Scenario 31 - Postman Import

**Feature:** Import Postman collection

**Steps:**
1. Sidebar -> Import
2. Select `docs/COLLECTIONS/OlympAPI-TestSuite.postman_collection.json`
3. Import

**Expected:**
- Collection `OlympAPI TestSuite` appears
- Requests include methods, URLs, headers and bodies
- Variables remain usable

**What to check:** Postman v2.1 import is complete enough for immediate execution

---

## Scenario 32 - Postman Export and Re-Import

**Feature:** Export collection as Postman JSON

**Steps:**
1. Open any collection menu
2. Export as Postman Collection
3. Save the JSON in `exports`
4. Import the saved file into Postman or back into OlympAPI

**Expected:**
- Exported JSON is valid Postman v2.1
- Requests, headers and bodies are preserved

**What to check:** Exported file can be consumed by another tool

---

## Scenario 33 - Multipart Form Data Upload

**Feature:** Multipart body with text and file fields

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/body/multipart`
3. Body -> form-data: `username=alice`
4. Add file field `attachment` using `uploads/sample.txt`
5. Send

**Expected:**
- Response status is `200 OK`
- Body contains text field `username`
- Body contains file metadata for `attachment`

**What to check:** File metadata is sent without showing raw file contents in the UI

---

## Scenario 34 - Binary File Upload

**Feature:** Raw binary body

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/body/binary`
3. Body -> binary -> select `uploads/sample.bin`
4. Send

**Expected:**
- Response status is `200 OK`
- Body contains size, contentType and preview fields

**What to check:** File size matches and preview shows only a safe hex sample

---

## Scenario 35 - GraphQL Request

**Feature:** GraphQL query with variables

**Steps:**
1. Set method `POST`
2. Set URL `{{BASE_URL}}/graphql`
3. Body -> GraphQL query:
   ```graphql
   query GetUser($id: ID!) {
     echo
   }
   ```
4. Variables:
   ```json
   { "id": "1" }
   ```
5. Send

**Expected:**
- Response status is `200 OK`
- Body echoes query and variables

**What to check:** GraphQL query and variables are serialized as JSON

---

## Scenario 36 - SSL Verification Toggle

**Feature:** Global SSL verification setting

**Setup:** HTTPS test server is running with local certificate

**Steps:**
1. Settings -> Request -> SSL Verification enabled
2. Send `GET https://localhost:3443/health`
3. Disable SSL Verification if available
4. Send the request again

**Expected:**
- Enabled SSL check fails for self-signed certificate
- Disabled SSL check returns `200 OK`

**What to check:** SSL setting is honored without leaking certificate details

---

## Scenario 37 - Request-Level SSL Override

**Feature:** Advanced request SSL override

**Steps:**
1. Set URL `https://localhost:3443/health`
2. Keep global SSL verification enabled
3. Advanced tab -> disable SSL verification for this request
4. Send

**Expected:**
- Response status is `200 OK`
- Same request without override fails

**What to check:** Resolution order uses request setting before global setting

---

## Scenario 38 - Proxy Setting

**Feature:** Route requests through a proxy

**Setup:** Proxy server is running on `http://localhost:3001`

**Steps:**
1. Settings or status bar -> enable proxy
2. Set proxy URL `http://localhost:3001`
3. Send `GET {{BASE_URL}}/echo`
4. Check proxy terminal output

**Expected:**
- Response status is `200 OK`
- Proxy terminal logs `GET /echo`
- Status bar shows active proxy

**What to check:** Proxy setting is persisted and used by request executor

---

## Scenario 39 - Request Timeout Global Setting

**Feature:** Global request timeout

**Steps:**
1. Settings -> Request Timeout: `1` ms
2. Send `GET {{BASE_URL}}/delay/100`
3. Reset timeout to `30000` ms

**Expected:**
- First request fails with timeout
- Normal timeout allows regular requests again

**What to check:** Timeout errors are clear and settings persist

---

## Scenario 40 - Collection Timeout Override

**Feature:** Collection-level request timeout

**Steps:**
1. Create a collection with request `{{BASE_URL}}/delay/100`
2. Collection settings -> Timeout `1` ms
3. Send the request
4. Clear collection timeout and send again

**Expected:**
- Collection timeout causes timeout error
- Clearing collection timeout falls back to global timeout

**What to check:** Resolution order uses request, then collection, then global setting

---

## Scenario 41 - Workspaces

**Feature:** Workspace creation, switching and data isolation

**Steps:**
1. Open workspace selector
2. Create workspace `OlympAPI Manual Test`
3. Create collection `Workspace Test`
4. Switch to another workspace
5. Check sidebar and environment selector

**Expected:**
- Collection is visible only in its workspace
- Workspace-specific environments are isolated
- Global environments remain available where intended

**What to check:** Workspace scope applies to collections, history and environments

---

## Scenario 42 - Workspace History Isolation

**Feature:** Request history per workspace

**Steps:**
1. In workspace A, send `/health` and `/echo`
2. Switch to workspace B
3. Open history panel
4. Switch back to workspace A

**Expected:**
- Workspace B history is empty or unrelated
- Workspace A history still contains both requests

**What to check:** History storage uses workspace-specific files/keys

---

## Scenario 43 - Request Tabs

**Feature:** Multiple request tabs and dirty state

**Steps:**
1. Open two requests from a collection
2. Modify URL in tab 1
3. Switch to tab 2 and back to tab 1
4. Close dirty tab
5. Confirm discard

**Expected:**
- Each tab keeps independent request state
- Dirty indicator appears for unsaved changes
- Close confirmation appears for dirty tabs

**What to check:** Shadow state pattern prevents tab state bleed

---

## Scenario 44 - Keyboard Shortcuts

**Feature:** Request tab keyboard shortcuts

**Steps:**
1. Press `Ctrl+T`
2. Press `Ctrl+W`
3. Press `Ctrl+,`
4. Press `Ctrl+Enter` on a valid request

**Expected:**
- New tab opens
- Active tab closes or asks for confirmation
- Settings opens
- Request sends

**What to check:** Shortcuts work without stealing text-editor input unexpectedly

---

## Scenario 45 - Response Layout Columns

**Feature:** Response panel columns layout

**Steps:**
1. Status bar -> switch layout to Columns
2. Send `GET {{BASE_URL}}/echo`
3. Inspect body, headers and tests areas

**Expected:**
- Body and headers are visible without tab switching
- Tests panel remains accessible

**What to check:** Split layout is readable at desktop widths

---

## Scenario 46 - Response Layout Persistence

**Feature:** Response layout toggle persistence

**Steps:**
1. Toggle response layout to Tabs
2. Restart app
3. Check response panel layout
4. Toggle back to Columns

**Expected:**
- Selected layout persists after restart
- Both layouts show the same response data

**What to check:** `responseLayout` setting is saved and restored

---

## Scenario 47 - Cookie Jar Set-Cookie

**Feature:** Store response cookies

**Steps:**
1. Send `GET {{BASE_URL}}/cookies/set?session=abc123`
2. Open cookie jar from status bar

**Expected:**
- Cookie badge increments
- Cookie `session=abc123` is visible for localhost

**What to check:** Set-Cookie header is parsed into the jar

---

## Scenario 48 - Cookie Jar Auto-Send

**Feature:** Send stored cookies automatically

**Setup:** Scenario 47 stored `session=abc123`

**Steps:**
1. Send `GET {{BASE_URL}}/cookies/read`
2. Do not set manual Cookie header

**Expected:**
- Response includes `session=abc123`
- Request Cookies tab shows jar cookie read-only

**What to check:** Domain/path matching sends the correct cookie

---

## Scenario 49 - Manual Cookie Override

**Feature:** Manual cookie overrides jar cookie

**Steps:**
1. Request `GET {{BASE_URL}}/cookies/read`
2. Cookies tab -> add `session=override-value`
3. Send

**Expected:**
- Response shows `session=override-value`
- Jar cookie is not deleted

**What to check:** Manual cookie merge has priority over jar values

---

## Scenario 50 - Cookie Deletion

**Feature:** Remove cookie from jar

**Steps:**
1. Open cookie jar dialog
2. Delete cookie `session`
3. Close dialog
4. Check cookie badge

**Expected:**
- Cookie no longer appears
- Badge count decreases

**What to check:** Cookie provider state refreshes after deletion

---

## Scenario 51 - Collection Git Sync Initialize

**Feature:** Connect collection to remote Git repository

**Setup:** Empty GitHub/Gitea repository and PAT are available

**Steps:**
1. Create a collection with three requests
2. Collection menu -> Git Sync
3. Enter provider, repo URL, branch and PAT
4. Test connection
5. Initialize sync

**Expected:**
- Remote repository contains `collection.json`, optional `environments/` and `README.md`
- Sensitive environment values are scrubbed
- Collection status badge shows synced state

**What to check:** Initial sync writes a usable remote representation without secrets

---

## Scenario 52 - Collection Git Sync Push and Pull

**Feature:** Push local changes and pull remote changes

**Steps:**
1. Rename a request locally
2. Git Sync -> Push with commit message
3. Edit `collection.json` remotely
4. Git Sync -> Pull
5. Confirm pull preview

**Expected:**
- Push updates remote repository
- Pull applies remote change locally
- `lastSyncedSha` updates after both operations

**What to check:** SHA tracking and content refresh are correct

---

## Scenario 53 - Collection Git Conflict

**Feature:** Resolve local/remote conflict

**Steps:**
1. Local: edit request URL without pushing
2. Remote: edit the same request in repository UI
3. Git Sync -> Pull
4. Choose Use Remote
5. Repeat and choose Keep Local

**Expected:**
- Conflict dialog appears
- Use Remote applies remote version
- Keep Local preserves local version and updates reference

**What to check:** Conflict resolution is explicit and reversible through user choice

---

## Scenario 54 - Workspace Git Sync

**Feature:** Sync complete workspace

**Steps:**
1. Workspace menu -> Git Sync
2. Enter repo URL, provider, branch and PAT
3. Test connection
4. Initialize sync
5. Rename a request and push

**Expected:**
- Remote contains `workspace.json`, `collections/`, `environments/`, `README.md`
- `workspace.json` excludes sensitive Git config
- Push updates changed collection file

**What to check:** Workspace sync preserves IDs and removes local-only secrets

---

## Scenario 55 - Default Headers

**Feature:** Predefined request headers

**Steps:**
1. Create a new request
2. Open Headers tab
3. Send `GET {{BASE_URL}}/debug/echo`
4. Inspect echoed headers

**Expected:**
- Headers tab shows Host, User-Agent, Accept, Accept-Encoding and Connection defaults
- Echo response contains the sent default headers
- Manual header overrides remain respected

**What to check:** Defaults are visible and do not duplicate user-defined headers

---

## Scenario 56 - Request Tab Indicators

**Feature:** Request tabs show data indicators

**Steps:**
1. Add a query param
2. Add JSON body
3. Add Bearer auth token
4. Add Script and Chain values
5. Check request tab labels

**Expected:**
- Params, Headers, Body, Auth, Script and Chain show indicators when data exists
- Indicators disappear after values are removed

**What to check:** Indicators reflect actual data state, not stale UI state

---

## Scenario 57 - Reset All Data

**Feature:** Reset app data while preserving license

**Setup:** At least one workspace, collection, environment and history entry exist

**Steps:**
1. Settings -> Reset All Data
2. Read warning dialog
3. Cancel and verify data remains
4. Open reset again and confirm

**Expected:**
- Cancel changes nothing
- Confirm clears collections, workspaces, environments, history and settings
- License activation and install ID are preserved

**What to check:** Reset removes app data but does not remove license storage

---

## Scenario 58 - Activation Flow

**Feature:** License activation UI

**Steps:**
1. Settings -> Activation
2. Enter invalid invoice/trial ID and token
3. Try activation
4. If test credentials are available, enter valid credentials

**Expected:**
- Invalid credentials show clear error
- Valid credentials activate Pro or Trial
- Offline cache allows restart without immediate reactivation

**What to check:** Product key and install-bound activation are correct for OlympAPI

---

## Scenario 59 - Appearance Settings

**Feature:** Theme and accent persistence

**Steps:**
1. Settings -> Appearance
2. Switch System, Light and Dark modes
3. Disable Match OlympSSH style
4. Pick a custom accent pair
5. Try several accent templates from the expanded palette
6. Restart app

**Expected:**
- Theme changes immediately
- Accent affects highlights and selected controls
- Expanded palette offers additional accent choices
- Settings persist after restart

**What to check:** Appearance matches other OlympSuite apps while allowing customization

---

## Scenario 60 - Workspace Appearance Override

**Feature:** Workspace-specific UI accent override

**Steps:**
1. Create workspace `Appearance A`
2. Workspace selector -> Appearance
3. Enable custom workspace appearance and choose an accent pair
4. Create or switch to workspace `Appearance B`
5. Leave `Appearance B` inheriting global appearance
6. Switch between both workspaces
7. Restart app and switch again

**Expected:**
- Workspace A changes the app accent immediately
- Workspace B uses the global app accent
- Workspace override persists after restart

**What to check:** Workspace appearance overrides app settings without changing Light/Dark/System mode

---

## Scenario 61 - Collection Appearance Override

**Feature:** Collection-specific UI accent override

**Steps:**
1. In a workspace, configure a workspace appearance color
2. Collection menu -> Settings
3. Enable UI Appearance and choose a different accent pair
4. Save a request in that collection and open it in a tab
5. Open a new unsaved tab
6. Switch between the saved collection request and the unsaved tab

**Expected:**
- Saved collection request uses the collection accent
- Collection accent overrides workspace accent
- Unsaved tab falls back to workspace or app accent
- Clearing collection appearance restores inherited colors

**What to check:** Resolution order is Collection -> Workspace -> App Settings

---

## Scenario 62 - Timed Git Sync

**Feature:** Time-based auto-push for Git Sync

**Setup:** Git Sync is configured for a workspace or collection and Pro features are available

**Steps:**
1. Open Git Sync settings
2. Enable Timed Auto-Push
3. Set interval to `5` minutes
4. Set a daily push time that is already due today
5. Make a local request change and save it
6. Wait for timed sync or restart the app after the daily time
7. Repeat with a remote-only change or conflict

**Expected:**
- Timed sync pushes only when local changes are unsynced
- Commit message starts with `Timed sync:`
- Up-to-date state creates no extra commit
- Remote-ahead or conflict state is skipped and reported

**What to check:** Timed sync does not duplicate Auto-Commit-on-Save and respects Git status

---

## Scenario 63 - Workspace Restore from Git

**Feature:** Restore workspace from a previous Git commit

**Setup:** Workspace Git Sync repository contains multiple commits

**Steps:**
1. Workspace menu -> Git Sync
2. Open Restore from Git
3. Select an older restore point
4. Review the collection/environment summary
5. Confirm Restore locally
6. Inspect workspace collections and environments
7. Check Git Sync status

**Expected:**
- Selected commit is loaded from the workspace manifest
- Workspace, collections and environments are restored locally
- Remote repository is not pushed automatically
- Git Sync shows local changes if restored state differs from last sync

**What to check:** Restore is explicit, local-only and keeps sensitive placeholders safe

---

## Scenario 64 - Diagnostics and Support

**Feature:** Diagnostics, shortcuts and support screens

**Steps:**
1. Settings -> Keyboard Shortcuts
2. Settings -> Diagnostics
3. Settings -> Support
4. Open external links where available

**Expected:**
- Shortcut reference is readable
- Diagnostics show app/system state
- Support screen opens documentation or feedback links

**What to check:** Utility screens do not require an active request or collection

---

## Scenario 65 - Dynamic Spec: Baseline Sync

**Feature:** Auto Sync setup and initial baseline import against a pinned spec
**Setup:** Test server running. Use `http://localhost:3000/swagger-dynamic.json?scenario=0` to pin the baseline.

**Steps:**
1. In OlympAPI, create a new empty collection named `Dynamic Sync Test`
2. Right-click the collection (or use the ⋮ menu) → **Auto Sync Setup**
3. Enable Auto Sync, paste the spec URL: `http://localhost:3000/swagger-dynamic.json?scenario=0`
4. Click **Test Connection** — verify the result chip shows `OlympAPI Validation Suite — Dynamic Sync v1.0.0 · 6 operations`
5. Click **Save**
6. Click **Sync Now**
7. When `changesFound` badge appears, click **Review N Changes**
8. In the diff dialog, click **Apply All** and confirm
9. Inspect imported requests

**Expected:**
- Collection contains 6 requests across `/dynamic/users`, `/dynamic/users/{id}`, `/dynamic/products`
- No extra or missing operations
- operationIds match `dynamic_listUsers`, `dynamic_createUser`, `dynamic_getUserById`, `dynamic_updateUser`, `dynamic_deleteUser`, `dynamic_listProducts`
- Badge shows green `upToDate` icon after apply

**What to check:** Baseline import is clean and stable with `?scenario=0` pinned

---

## Scenario 66 - Dynamic Spec: Detect Added Endpoint

**Feature:** Auto Sync detects a new endpoint added between syncs
**Setup:** Collection from Scenario 65 is synced at baseline (`?scenario=0`).

**Steps:**
1. Open the collection ⋮ menu → **Auto Sync Setup**
2. Change the Spec URL to `http://localhost:3000/swagger-dynamic.json?scenario=1`
3. Click **Save**
4. Click **Sync Now**
5. When the `changesFound` badge appears, click **Review N Changes** to open the diff dialog
6. Inspect the diff dialog — look for a "New Endpoints" section

**Expected:**
- Sync detects `POST /dynamic/users/bulk-import` as a new operation in the "New Endpoints" section
- Default action is "Apply" for the added entry
- After applying: new request `bulk-import` appears in the collection
- Existing 6 requests are unchanged
- Badge returns to green `upToDate`

**What to check:** Added endpoint is surfaced as an addition, not a replacement

---

## Scenario 67 - Dynamic Spec: Detect Modified Operation

**Feature:** Auto Sync detects a parameter and response code change
**Setup:** Collection synced at baseline (`?scenario=0`).

**Steps:**
1. Open the collection ⋮ menu → **Auto Sync Setup**
2. Switch Spec URL to `http://localhost:3000/swagger-dynamic.json?scenario=2`, click **Save**
3. Click **Sync Now**
4. When the diff dialog prompt appears, open it (click **Review N Changes**)
5. Inspect the "Modified Endpoints" section for `dynamic_getUserById`
6. Choose "Apply" and confirm
7. Open the `GET /dynamic/users/{id}` request

**Expected:**
- Diff dialog shows `dynamic_getUserById` in "Modified Endpoints"
- After applying: request now includes `include_deleted` query parameter
- 410 response code is reflected in `specSnapshot` metadata
- Other operations are unchanged
- User-defined auth/headers/scripts on the request are preserved

**What to check:** Modified operation updates params/responses without replacing the whole request

---

## Scenario 68 - Dynamic Spec: Detect Removed Operation + Auto-Rotate

**Feature:** Auto Sync detects a removed HTTP method; timed rotation works end-to-end
**Setup:** Collection synced at baseline (`?scenario=0`).

**Steps:**
1. Open the collection ⋮ menu → **Auto Sync Setup**
2. Switch Spec URL to `http://localhost:3000/swagger-dynamic.json?scenario=3`, click **Save**
3. Click **Sync Now** — open the diff dialog via **Review N Changes**
4. Verify the "Removed Endpoints" section shows `DELETE /dynamic/users/{id}`
5. Verify the "New Endpoints" section shows `GET /dynamic/audit-log`
6. Apply all changes
7. Remove the `?scenario=3` override (set URL to `http://localhost:3000/swagger-dynamic.json`), click **Save**
8. Call `GET http://localhost:3000/swagger-dynamic.json?info` — note `currentScenario`, `totalScenarios`, `secondsUntilNextChange`
9. Wait until the next minute boundary (check `X-Sync-Next-Change-In` response header)
10. The 60s scheduler fires automatically (or click **Sync Now**); observe the `changesFound` badge appear

**Expected:**
- Scenario 3: DELETE operation removed from diff (shown in "Removed" section), audit-log endpoint added (shown in "New" section)
- `?info` endpoint returns `currentScenario`, `totalScenarios: 6`, `secondsUntilNextChange`
- After the minute boundary the spec version increments and sync detects further changes automatically
- `X-Sync-Next-Change-In` header counts down correctly
- Badge transitions: idle → syncing → changesFound (orange)

**What to check:** Auto-rotation drives real spec diffs detectable by OlympAPI Auto Sync
