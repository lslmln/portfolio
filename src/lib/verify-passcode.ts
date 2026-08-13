"use server";

// Server Action — this function's code runs only on the server and is never
// sent to the browser (Next.js replaces the client-side reference with an
// RPC call), so the passcode comparison below is not visible via view-source,
// devtools, or the JS bundle. The actual value lives in `.env.local`
// (gitignored, never committed) as WORK_PASSCODE, not in any file shipped to
// the client — see work-section.tsx for the (unauthenticated) caller.
export async function verifyPasscode(passcode: string): Promise<boolean> {
  const expected = process.env.WORK_PASSCODE;
  if (!expected) return false;
  return passcode.trim().toLowerCase() === expected.trim().toLowerCase();
}
