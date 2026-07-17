const mongoose = require('mongoose');
const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    readTime: { type: String, default: '5 min read' },
    isHero: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Article', ArticleSchema);