// The `/api/categories` endpoint
const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET: /api/categories/
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET: /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST: /api/categories/
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    // 200 status code means the request is successful
    res.status(200).json(category);
  } catch (err) {
    // 400 status code means the server could not understand the request
    res.status(400).json(err);
  }
});

// PUT: /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!category[0]) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json({ message: 'Category updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE: /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json({ message: 'Category deleted successfully!'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
