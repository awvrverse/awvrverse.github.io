module Jekyll
  class TagPage < Page
    def initialize(site, base, dir, tag, posts)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['title'] = tag
      self.data['posts'] = posts
      self.data['posts_count'] = posts.size
    end
  end

  class TagPageGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.tags.each do |tag, posts|
        dir = "tag/#{tag.to_url}"
        site.pages << TagPage.new(site, site.source, dir, tag, posts)
      end
    end
  end
end
