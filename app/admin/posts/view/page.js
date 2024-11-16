'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function EditPost() {
  const [post, setPost] = useState({
    title: '',
    slug: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // Fetch the post data when the id is available
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/posts/${id}`);
          const data = await res.json();
          if (res.ok) {
            setPost({
              title: data.title,
              slug: data.slug,
              content: data.content // Directly use the content here
            });
          } else {
            alert('Post not found!');
          }
          setIsLoading(false);
        } catch (error) {
          alert('Error fetching post data');
        }
      };

      fetchPost();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Title and slug as Heading and Subheading */}
      <div className={styles.header}>
        <h1>{post.title}</h1> {/* Title of the post */}
        <h2 className={styles.slug}>{post.slug}</h2> {/* Slug as subheading */}
      </div>

      {/* Display only the post content */}
      <div className={styles.contentContainer}>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }} // Render HTML content
          className={styles.content}
        />
      </div>
    </div>
  );
}
