---
layout: page
title: "Kategori"
description: "Daftar kategori artikel"
permalink: /categories/
---

# Kategori Artikel

{% for category in site.categories %}
## {{ category[0] }}

<ul class="category-posts">
    {% for post in category[1] %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <time>{{ post.date | date: "%d %B %Y" }}</time>
    </li>
    {% endfor %}
</ul>
{% endfor %}
