import { useEffect, useState } from 'react';
import { Button, Card, Image, Table, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getProducts, type Product } from '../../api/productsApi';
import ProductFormModal from './ProductFormModal';

const { Title, Text } = Typography;

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <Card bordered={false} style={{ borderRadius: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={2} style={{ marginTop: 0, marginBottom: 6 }}>
              Products
            </Title>
            <Text style={{ color: '#777' }}>
              Manage artworks, pricing, stock and featured products.
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#A77833',
              borderColor: '#A77833',
              height: 42,
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            Add Product
          </Button>
        </div>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={products}
          columns={[
            {
              title: 'Image',
              dataIndex: 'imageUrl',
              key: 'imageUrl',
              render: (imageUrl: string) => (
                <Image
                  src={imageUrl}
                  width={64}
                  height={64}
                  style={{
                    objectFit: 'cover',
                    borderRadius: 10,
                  }}
                />
              ),
            },
            {
              title: 'Product',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
              render: (price: number) => `$${price}`,
            },
            {
              title: 'Stock',
              dataIndex: 'stock',
              key: 'stock',
            },
            {
              title: 'Status',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive: boolean) =>
                isActive ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Inactive</Tag>
                ),
            },
          ]}
        />
      </Card>

      <ProductFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadProducts}
      />
    </div>
  );
}

export default ProductsPage;
