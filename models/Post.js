import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize'; // Adjust path as needed

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The title of the post',
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'URL-friendly identifier (auto-generated from title)',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The content of the post (rich text)',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

sequelize.sync({ force: false })

export default Post;
