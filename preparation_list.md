# Preparation List

Before you edit `data/site.json`, it helps to prepare the content in plain language first. You can treat this file like a guided worksheet: write naturally, answer in full sentences if you want, and do not worry about formatting yet.

## 1. Start with how you want to introduce yourself

Write the English name you want to use on the website, your current title, and the one-sentence impression you want a visitor to remember after ten seconds on the page.

Then write a short personal summary in natural English. A good version usually answers three things: what you do, what kinds of problems or topics you care about, and what makes your background distinctive.

If it helps, write something like:

“I'm a ______ based in ______. My work focuses on ______. I care most about ______, and my background combines ______ with ______.”

## 2. Gather the quick facts that should appear near the top

Write down the city or region you want to show publicly, the email address you are comfortable publishing, whether you are open to opportunities, and the single best contact method you want people to use first.

If you do not want one of these items to appear, just write “leave this out”.

## 3. Prepare three to five short highlights

These are the short lines that make you feel sharp and memorable. They should not repeat your summary. Instead, use them to show your strengths, taste, or focus.

For example, you might write that you:

- work across research, product, and engineering
- care about AI-native products or data systems
- have experience in both Chinese and international environments
- value thoughtful execution and high product quality

Write your own version in a way that sounds like you.

## 4. Prepare your education story

For each degree or major educational experience you want to show, write it like a short paragraph instead of a resume line first.

Say:

- what degree or program it was
- which school it was at
- where it was located
- what years it covered
- what mattered most there

Then add two or three details that are actually worth showing on a website, such as research focus, awards, exchange programs, advisors, thesis topics, or notable projects.

## 5. Prepare your work experience story

For each role, internship, or founder experience, write a concise paragraph explaining what you owned, what kind of work you did, and what kind of result you created.

Try to avoid generic descriptions like “responsible for product work”. Instead, explain the real scope:

- what product, team, or topic you worked on
- what decisions you made
- what you shipped, improved, or discovered
- what changed because of your work

If a role has measurable outcomes, include them in plain language now. We can always shorten them later.

## 6. Decide which public platforms really matter

You said you mainly use Chinese and global mainstream platforms, so the site already keeps the list focused. Right now the sample includes:

- China: Bilibili, Xiaohongshu, WeChat Official Account, Douyin, Zhihu, Weibo
- Global: X, YouTube, Instagram, TikTok
- Academic / professional: Google Scholar, GitHub, LinkedIn

Go through these one by one and decide:

1. which ones you actively use and want to show
2. which ones exist but should stay private
3. which ones you do not use at all

For each platform you keep, prepare:

- the exact public URL
- a short note describing what people will find there

For example:

“Bilibili: I post product demos, public talks, and occasional technical explainers.”

If you want to add one or two more reasonable platforms, the most sensible options are usually **Threads** or a personal **newsletter**, but only if you really use them.

## 7. Prepare your products section

For each product or project you want to feature, write a natural description that answers:

- what it is
- who it is for
- why it exists
- what makes it different
- what your role was

Then collect the link people should click. If there is a public repository and you want to show it, prepare that too.

If you have several projects, rank them by how much you want a stranger to remember them. The website should show the strongest ones first.

## 8. Prepare your publications and academic outputs

Since GitHub Pages cannot reliably scrape Google Scholar directly in the browser, the website reads publication data from JSON. That means you should prepare the publication list yourself first, ideally by copying from your Google Scholar profile carefully.

For each item you want to show, gather:

- title
- authors
- venue
- year
- type, such as paper, patent, preprint, or report
- citation count if you want to display it
- a one- or two-sentence plain-language summary
- links to the paper, PDF, or code if available

You should also prepare your Google Scholar profile URL so visitors can open the full profile directly.

## 9. Prepare your resume link and profile image

If you want a Resume button, decide where the PDF will live and prepare the final URL.

If you want a profile image, choose one that matches the overall style of the site: clean, bright, and professional. A portrait with a calm background usually works better than a casual photo.

## 10. Final writing pass before you fill the JSON

Before you move everything into `data/site.json`, read what you wrote once from the perspective of a stranger.

Ask yourself:

- Does this sound like a real person rather than a copied resume?
- Does it clearly show what I do now, not only what I did in the past?
- Are the links the exact ones I want the public to click?
- Are there any lines that feel too vague, too long, or too modest?

Once this feels right, you can copy the content into `data/site.json` section by section.
