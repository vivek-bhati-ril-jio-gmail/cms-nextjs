import Page from '../../../models/Page'; // Assuming you have a Page model similar to Post
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1
  const limit = parseInt(searchParams.get('limit') || '10', 10); // Default to 10 pages per page
  const offset = (page - 1) * limit;

  try {
    // Fetch paginated pages
    const pages = await Page.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Optional: Sort pages by creation date
    });

    // Get total count of pages to calculate total pages
    const totalPages = await Page.count();
    const totalPagesCalculated = Math.ceil(totalPages / limit);

    return NextResponse.json({
      pages,
      totalPages: totalPagesCalculated,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ msg: 'Error fetching pages' }, { status: 500 });
  }
}

export async function POST(req) {
  const { title, content, slug } = await req.json();
  try {
    const newPage = await Page.create({ title, content, slug });
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ msg: 'Error creating page' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, title, content, slug } = await req.json();
  try {
    const page = await Page.findByPk(id);
    if (page) {
      page.title = title;
      page.content = content;
      page.slug = slug;
      await page.save();
      return NextResponse.json(page, { status: 200 });
    }
    return NextResponse.json({ msg: 'Page not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ msg: 'Error updating page' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    const page = await Page.findByPk(id);
    if (page) {
      await page.destroy();
      return NextResponse.json({ msg: 'Page deleted' }, { status: 200 });
    }
    return NextResponse.json({ msg: 'Page not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ msg: 'Error deleting page' }, { status: 500 });
  }
}
