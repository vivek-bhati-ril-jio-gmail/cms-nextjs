// app/api/posts/route.js
import Post from '../../../models/Post';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1
  const limit = parseInt(searchParams.get('limit') || '10', 10); // Default to 10 posts per page
  const offset = (page - 1) * limit;

  try {
    // Fetch paginated posts
    const posts = await Post.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Optional: Sort posts by creation date
    });

    // Get total count of posts to calculate total pages
    const totalPosts = await Post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ msg: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(req) {
  const { title, content, slug } = await req.json();
  try {
    const newPost = await Post.create({ title, content, slug });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ msg: 'Error creating post' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    const post = await Post.findByPk(id);
    if (post) {
      await post.destroy();
      return NextResponse.json({ msg: 'Post deleted' }, { status: 200 });
    }
    return NextResponse.json({ msg: 'Post not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ msg: 'Error deleting post' }, { status: 500 });
  }
}
