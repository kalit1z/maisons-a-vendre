import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Sidebar from "@layouts/partials/Sidebar";
import Post from "@partials/Post";
import ReactMarkdown from 'react-markdown'; // Import de react-markdown
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";

// category page
const Category = ({ postsByCategories, category, posts, categories, frontmatter, content }) => {
  const { title, metaTitle, description } = frontmatter;

  return (
    <Base title={metaTitle} description={description}>
      <div className="section">
        <div className="container">
          <h1 className="h2 mb-12">{title}</h1>
          {/* Rendre le contenu Markdown avec la classe `content` */}
          <div className="content">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
          <div className="row">
            <div className="lg:col-8">
              <div className="row rounded border border-border p-4 px-3 dark:border-darkmode-border lg:p-6">
                {postsByCategories.map((post, i) => (
                  <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                    <Post post={post} />
                  </div>
                ))}
              </div>
            </div>
            <Sidebar posts={posts} categories={categories} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Category;

// category page paths
export const getStaticPaths = () => {
  const categories = getTaxonomy(`content/${config.settings.blog_folder}`, 'categories');
  const paths = categories.map((category) => ({
    params: { category: slugify(category) }
  }));

  return { paths, fallback: false };
};

// category page data
export const getStaticProps = ({ params }) => {
  const filePath = path.join('content', 'canton', `${params.category}.md`);

  if (!fs.existsSync(filePath)) {
    return {
      notFound: true,
    };
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent); // Récupérer aussi le contenu

  const posts = getSinglePage(`content/${config.settings.blog_folder}`);
  const filterPosts = posts.filter((post) =>
    post.frontmatter.categories.find((category) =>
      slugify(category).includes(params.category)
    )
  );

  const categories = getTaxonomy(`content/${config.settings.blog_folder}`, "categories");

  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.map(e => slugify(e)).includes(category)
    );
    return {
      name: category,
      posts: filteredPosts.length,
    };
  });

  return {
    props: {
      posts,
      postsByCategories: filterPosts,
      category: params.category,
      categories: categoriesWithPostsCount,
      frontmatter,
      content, // Passer le contenu au composant
    },
  };
};
