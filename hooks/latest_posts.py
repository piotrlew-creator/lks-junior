"""Najnowsze wpisy z Aktualności na stronie głównej.

Hook przekazuje do szablonu strony głównej (overrides/home.html) listę
`latest_posts`: tytuł, adres, datę po polsku i krótki opis. Opis to pole
`description` z nagłówka wpisu albo — gdy go nie ma — pierwszy akapit
zwykłego tekstu przed znacznikiem <!-- more -->.
"""
import re

MIESIACE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca",
            "sierpnia", "września", "października", "listopada", "grudnia"]
LIMIT = 3


def _summary(post):
    desc = (post.meta or {}).get("description")
    if desc:
        return " ".join(str(desc).split())
    text = (post.markdown or "").split("<!-- more -->")[0]
    text = re.sub(r"<(div|section|figure)[^>]*>.*?</\1>", "", text, flags=re.S)
    for para in re.split(r"\n\s*\n", text):
        para = para.strip()
        if not para or para.startswith(("#", "<", "!", "|", ":")):
            continue
        para = re.sub(r"\[([^\]]+)\]\([^)]*\)(\{[^}]*\})?", r"\1", para)
        para = re.sub(r"[*_`]", "", para)
        para = " ".join(para.split())
        if len(para) > 190:
            para = para[:190].rsplit(" ", 1)[0] + "…"
        return para
    return ""


def on_page_context(context, page, config, nav):
    if not page.is_homepage:
        return context
    blog = None
    for name, plugin in config.plugins.items():
        if name.endswith("blog") and hasattr(plugin, "blog"):
            blog = plugin.blog
            break
    posts = []
    if blog is not None:
        for post in sorted(blog.posts, key=lambda p: p.config.date.created, reverse=True)[:LIMIT]:
            d = post.config.date.created
            posts.append({
                "title": post.title,
                "url": post.url,
                "date": f"{d.day} {MIESIACE[d.month - 1]} {d.year}",
                "iso": d.strftime("%Y-%m-%d"),
                "summary": _summary(post),
            })
    context["latest_posts"] = posts
    return context
