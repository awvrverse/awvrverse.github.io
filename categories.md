---
layout: page
title: "Kategori"
description: "Jelajahi artikel berdasarkan kategori"
permalink: /categories/
---

<div class="categories-page">
    <div class="categories-stats">
        <p>Menampilkan <strong>{{ site.categories.size }}</strong> kategori dari <strong>{{ site.posts.size }}</strong> artikel</p>
    </div>

    <div class="categories-grid">
        {% assign sorted_categories = site.categories | sort %}
        {% for category in sorted_categories %}
            {% assign cat_name = category[0] %}
            {% assign posts = category[1] %}
            
            <a href="{{ '/category/' | append: cat_name | slugify | append: '/' | relative_url }}" 
               class="category-card" 
               id="{{ cat_name | slugify }}">
                <div class="category-icon">
                    <span class="material-icons-round">folder</span>
                </div>
                <div class="category-info">
                    <h3 class="category-name">{{ cat_name }}</h3>
                    <span class="category-count">{{ posts.size }} artikel</span>
                </div>
                <span class="material-icons-round category-arrow">arrow_forward</span>
            </a>
        {% endfor %}
    </div>
</div>

<style>
.categories-page {
    max-width: 1000px;
    margin: 0 auto;
}

.categories-stats {
    text-align: center;
    padding: var(--spacing-lg);
    background-color: var(--md-sys-color-primary-container);
    border-radius: var(--md-sys-shape-corner-large);
    margin-bottom: var(--spacing-2xl);
    color: var(--md-sys-color-on-primary-container);
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
}

.category-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-large);
    box-shadow: var(--md-sys-elevation-1);
    transition: var(--transition-fast);
    text-decoration: none;
    color: var(--md-sys-color-on-surface);
}

.category-card:hover {
    box-shadow: var(--md-sys-elevation-3);
    transform: translateY(-2px);
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
}

.category-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--md-sys-color-primary-container);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--md-sys-color-on-primary-container);
    flex-shrink: 0;
}

.category-card:hover .category-icon {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
}

.category-info {
    flex: 1;
}

.category-name {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
}

.category-count {
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface-variant);
}

.category-card:hover .category-count {
    color: var(--md-sys-color-on-primary-container);
}

.category-arrow {
    color: var(--md-sys-color-on-surface-variant);
    transition: var(--transition-fast);
}

.category-card:hover .category-arrow {
    transform: translateX(4px);
    color: var(--md-sys-color-on-primary-container);
}

@media (max-width: 640px) {
    .categories-grid {
        grid-template-columns: 1fr;
    }
}
</style>
