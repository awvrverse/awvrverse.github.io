module Jekyll
  class CategoryPage < Page
    def initialize(site, base, dir, category, posts)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      self.data['title'] = category
      self.data['posts'] = posts
      self.data['posts_count'] = posts.size
    end
  end

  class CategoryPageGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.categories.each do |category, posts|
        dir = "category/#{category.to_url}"
        site.pages << CategoryPage.new(site, site.source, dir, category, posts)
      end
    end
  end
end

# Helper untuk URL-friendly
class String
  def to_url
    self.downcase.strip.gsub(/\s+/, '-').gsub(/[^\w-]/, '')
  end
end
