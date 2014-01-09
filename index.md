---
layout: page
title: "Home"
---

{% for post in site.posts limit 4 %}
<div>
	<h2><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h2>
	<p>{{ post.excerpt }}</p><br>
	<a href="{{ post.url }}">Read more...</a><br><br>
</div>
{% endfor %}

{% include JB/setup %}