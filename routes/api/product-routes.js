// The `/api/products` endpoint
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models'); 

// get all products
// GET: /api/products
router.get('/', async (req, res) => {
  // Find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product
// GET: /api/products/:id
router.get('/:id', async (req, res) => {
  // TODO: find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag },],
    });
    if (!productData) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(productData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new product
// POST: /api/products
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update product
// PUT: /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!product[0]) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id },
    });

    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    let newProductTags = [];

    if (req.body.tagIds && Array.isArray(req.body.tagIds)) {
      newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
    }

    await Promise.all([
      ProductTag.destroy({ where: { id: productTags.map(({ id }) => id) } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({ message: 'Product successfully updated!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE: /api/products/:id
router.delete('/:id', async (req, res) => {
  // Delete one product by its `id` value
  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
