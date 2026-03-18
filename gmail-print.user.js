// ==UserScript==
// @name         Gmail Print - Clean Content Only
// @namespace    https://nparashuram.com/greasemoney/gmail-print-clean
// @version      2.0
// @description  Strips Gmail headers/metadata from print view, keeping only the email body content
// @match        https://mail.google.com/mail/*/u/*?view=pt*
// @match        https://mail.google.com/mail/*?view=pt*
// @match        https://mail.google.com/mail/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Only run on Gmail print view pages (URL contains view=pt)
    if (!window.location.href.includes('view=pt')) {
        return;
    }

    // Safety: never nuke the page if we can't find content.
    // Instead of replacing body.innerHTML, we clone content first,
    // and only replace if we actually extracted something meaningful.

    function extractContentNodes() {
        // We try multiple strategies in order. Each returns an array of
        // DOM nodes (the email body content) or null.

        // ── Strategy 1: table.message with overflow div ──
        // Gmail wraps the email body in:
        //   table.message > tr > td[colspan="2"] > table > tr > td > div[style*="overflow"]
        // This has been stable in Gmail's print view for years.
        const strat1 = tryMessageTableOverflow();
        if (strat1) return strat1;

        // ── Strategy 2: .maincontent with overflow div ──
        // If Gmail drops the .message class, fall back to looking inside .maincontent
        const strat2 = tryMaincontentOverflow();
        if (strat2) return strat2;

        // ── Strategy 3: largest div heuristic ──
        // Find the deepest div with the most innerHTML content.
        // Gmail headers are small; the email body is large.
        const strat3 = tryLargestDiv();
        if (strat3) return strat3;

        return null;
    }

    function tryMessageTableOverflow() {
        const tables = document.querySelectorAll('table.message');
        if (tables.length === 0) return null;

        const contents = [];
        for (const table of tables) {
            const div = findOverflowDiv(table);
            if (div) contents.push(div.cloneNode(true));
        }
        return contents.length > 0 ? contents : null;
    }

    function tryMaincontentOverflow() {
        const main = document.querySelector('.maincontent');
        if (!main) return null;

        const contents = [];
        // Look for all overflow divs inside maincontent — each is one message in a thread
        const divs = main.querySelectorAll('div[style*="overflow"]');
        for (const div of divs) {
            // Skip tiny divs (likely not email content)
            if (div.innerHTML.length > 100) {
                contents.push(div.cloneNode(true));
            }
        }
        return contents.length > 0 ? contents : null;
    }

    function tryLargestDiv() {
        // Heuristic: the email body is the largest content block on the page.
        // Skip the top-level containers (.bodycontainer, .maincontent) and
        // find the largest leaf-ish div.
        const allDivs = document.querySelectorAll('.bodycontainer div, .maincontent div');
        let best = null;
        let bestLen = 0;

        for (const div of allDivs) {
            // Skip top-level wrappers
            if (div.classList.contains('bodycontainer') || div.classList.contains('maincontent')) continue;
            const len = div.innerHTML.length;
            // Must be substantial content and not a parent of an already-better candidate
            if (len > 500 && len > bestLen) {
                // Prefer divs that don't contain other candidate divs (more specific)
                const childDivs = div.querySelectorAll('div');
                const isLeafy = Array.from(childDivs).every(c => c.innerHTML.length < len * 0.9);
                if (isLeafy || len > bestLen * 2) {
                    best = div;
                    bestLen = len;
                }
            }
        }
        return best ? [best.cloneNode(true)] : null;
    }

    function findOverflowDiv(container) {
        // Look for div with overflow style — Gmail uses this to wrap email body
        const divs = container.querySelectorAll('div[style*="overflow"]');
        for (const div of divs) {
            if (div.innerHTML.length > 100) return div;
        }
        // Fallback: look for the deepest td with substantial content
        const tds = container.querySelectorAll('td');
        let best = null;
        let bestLen = 0;
        for (const td of tds) {
            if (td.innerHTML.length > bestLen && td.querySelector('div, table')) {
                best = td;
                bestLen = td.innerHTML.length;
            }
        }
        return best;
    }

    function cleanPrintView() {
        const body = document.body;
        if (!body) return;

        const contentNodes = extractContentNodes();

        // SAFETY: if we found nothing, leave the page untouched.
        // The user gets Gmail's default print view — better than a blank page.
        if (!contentNodes || contentNodes.length === 0) {
            console.warn('[Gmail Print Clean] Could not find email content. Leaving page as-is.');
            return;
        }

        // We have content — now safe to replace the body.
        body.innerHTML = '';

        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: 'Open Sans', Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #000;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            img { max-width: 100%; }
            table { max-width: 100%; }
            a { color: #1155CC; }
            .message-separator {
                border: none;
                border-top: 1px solid #ddd;
                margin: 24px 0;
            }
            @media print {
                body { margin: 0; padding: 10px; }
            }
        `;
        body.appendChild(style);

        // Append each message's content (supports threads with multiple messages)
        contentNodes.forEach((node, i) => {
            if (i > 0) {
                const hr = document.createElement('hr');
                hr.className = 'message-separator';
                body.appendChild(hr);
            }
            // Remove the overflow:hidden that Gmail adds — it can clip content in print
            node.style.overflow = 'visible';
            body.appendChild(node);
        });

        // Clean up page title
        const title = document.title || '';
        document.title = title.replace(/^Gmail\s*-\s*/, '');

        // Re-trigger print after DOM settles
        setTimeout(() => { window.print(); }, 300);
    }

    // Prevent Gmail's built-in onload from triggering print before we clean up
    document.body.onload = null;

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        cleanPrintView();
    } else {
        window.addEventListener('DOMContentLoaded', cleanPrintView);
    }
})();
