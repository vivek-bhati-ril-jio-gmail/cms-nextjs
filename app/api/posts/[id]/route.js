import { NextResponse } from 'next/server';
import Post from '../../../../models/Post'; // Post model

// GET request to fetch a post by ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Fetch the post by ID from the database
    const post = await Post.findByPk(id); // Use Sequelize's `findByPk` method

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}

// PUT request to update the post by ID
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  // Validate the incoming data
  if (!data.title || !data.content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  try {
    // Find the post by ID
    const post = await Post.findByPk(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update the post
    await post.update({
      title: data.title,
      slug: data.slug || post.slug, // Only update slug if provided
      content: data.content,
    });

    return NextResponse.json(post); // Return the updated post
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}
