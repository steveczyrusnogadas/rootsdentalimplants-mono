# WordPress route and embed census

Type: research
Status: resolved

## Question

What public URLs, third-party embeds (video, forms, chat, analytics, booking widgets), and media hosts does the live WordPress site at https://rootsdentalimplants.com/ actually use?

This is a census, not the corpus dump. Record the tree, the form fields on the main intake surfaces, and every third-party host. Do not download the media library.

## Answer

32 published pages + 3 Blog posts. `/locations/{city}/` 301s to `/locations/` (no public city pages). Intake is Gravity Forms 1/2/3/6, Elementor pricing-guide popup `1043`, Call Us popup `882`, and HighLevel quizzes/dinner RSVPs. Header Book Now is outbound NexHealth (not a Lead). No preferred-time field; SMS/TCPA checkboxes sit on GF 1/2 and HighLevel widgets. Video is YouTube/Vimeo; images are first-party uploads; analytics are GTM `GTM-5LCL4JQ`, Meta pixel, CallRail. Full tree, fields, and hosts: [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md).

## Comments

- First research pass aborted before an answer. Partial fetches are in `research/_raw/` (robots.txt, sitemap index, page/post/author/category sitemaps, homepage HTML). Resume from those instead of starting over.
- Resolved from a live-site walk. Findings plus `_raw/` dumps: [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md). Dinner HighLevel forms other than Troutdale, and quizzes other than Portland, have IDs only.
