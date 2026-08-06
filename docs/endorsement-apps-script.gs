/**
 * UNNYC — formal organisation endorsement intake
 * ---------------------------------------------------------------------------
 * Receiving end for src/app/api/formal-endorsement/route.js. That route holds
 * the webhook URL server-side and POSTs JSON here; this appends a row.
 *
 * DEPLOY (all of this is in the Google UI — see docs/ENDORSEMENT-INTAKE.md):
 *   1. Create a Google Sheet. Note its id from the URL.
 *   2. Extensions → Apps Script. Paste this file over Code.gs.
 *   3. Set SHEET_ID below, then Run → setupSheet once to write the header row
 *      and confirm the script can reach the sheet.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone            <-- REQUIRED. Vercel is anonymous;
 *                                              "Anyone with a Google account"
 *                                              silently returns a login page
 *                                              and the route reports 502.
 *   5. Copy the Web app URL (.../exec) and set it as
 *      ENDORSEMENT_SHEET_WEBHOOK_URL in Vercel. Treat it as a SECRET: anyone
 *      holding it can append rows.
 *
 * The URL changes on every "New deployment". Use Manage deployments → edit the
 * existing one to keep it stable, or you must update Vercel each time.
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Endorsements';

/* Column order. Matches the payload the route forwards, which is the form body
   plus submittedAt. Add new fields to the END so existing rows stay aligned. */
const COLUMNS = [
  'submittedAt',
  'orgName',
  'orgType',
  'country',
  'employees',
  'firstName',
  'jobTitle',
  'workEmail',
  'endorses',
  'consent',
];

function sheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

/** Run once from the editor: writes the header row and proves access works. */
function setupSheet() {
  const sh = sheet_();
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  Logger.log('OK — "%s" ready, %s row(s).', SHEET_NAME, sh.getLastRow());
}

function doPost(e) {
  // Apps Script has no per-script mutex around appendRow; two concurrent
  // submissions can land on the same row. Serialise them.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return reply_(false, 'Busy, try again');
  }

  try {
    if (!e || !e.postData || !e.postData.contents) return reply_(false, 'No body');
    const data = JSON.parse(e.postData.contents);

    // The route already validates required fields and returns 400, so this is
    // a backstop for anything reaching the URL directly.
    for (const f of ['orgName', 'orgType', 'workEmail', 'consent']) {
      if (!data[f]) return reply_(false, 'Missing ' + f);
    }

    const sh = sheet_();
    if (sh.getLastRow() === 0) setupSheet();

    // Leading apostrophe defeats formula injection: a value beginning = + - @
    // is otherwise evaluated by Sheets when someone opens the file.
    sh.appendRow(
      COLUMNS.map(function (key) {
        let v = data[key];
        if (v === undefined || v === null) v = '';
        v = String(v);
        return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
      })
    );

    return reply_(true);
  } catch (err) {
    // Surface the reason in the Apps Script execution log; the route turns any
    // non-2xx into a 502 for the browser.
    Logger.log('doPost failed: %s', err && err.message);
    return reply_(false, 'Server error');
  } finally {
    lock.releaseLock();
  }
}

/** A GET is handy for checking the deployment is reachable and public. */
function doGet() {
  return reply_(true, 'UNNYC endorsement intake is live');
}

function reply_(ok, message) {
  const body = { ok: ok };
  if (message) body.message = message;
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
